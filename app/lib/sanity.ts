import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;
const writeToken = process.env.SANITY_API_WRITE_TOKEN;

export const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: false,
});

const writeClient =
  projectId && dataset && writeToken
    ? createClient({
        projectId,
        dataset,
        apiVersion: "2024-01-01",
        useCdn: false,
        token: writeToken,
      })
    : null;

const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]{ groupmeLink, email }`;
const LEARN_MORE_QUERY = `*[_type == "learnMorePage"][0]{
  headline,
  missionParagraph1,
  missionParagraph2,
  coreGoals
}`;
const UPCOMING_EVENTS_QUERY = `*[_type == "event"] | order(date asc) {
  _id,
  title,
  date,
  time,
  location,
  description,
  partiful
}`;
const PAST_EVENTS_QUERY = `*[_type == "pastEvent"] | order(date desc) {
  _id,
  title,
  date,
  description,
  "imageUrls": images[].asset->url,
  "sourceEventId": sourceEvent->_id
}`;
const ALL_EVENTS_QUERY = `*[_type == "event"] | order(date desc) {
  _id,
  title,
  date,
  description
}`;
const TEAM_MEMBERS_QUERY = `*[_type == "teamMember"] | order(_createdAt asc) {
  _id,
  name,
  "imageUrl": image.asset->url,
  role,
  year,
  blurb
}`;

export type SiteSettings = {
  groupmeLink?: string | null;
  email?: string | null;
};

export type LearnMorePage = {
  headline?: string | null;
  missionParagraph1?: string | null;
  missionParagraph2?: string | null;
  coreGoals?: Array<{ _key: string; title: string; items: string[] }> | null;
};

export type SanityEvent = {
  _id: string;
  title?: string | null;
  date?: string | null;
  time?: string | null;
  location?: string | null;
  description?: string | null;
  partiful?: string | null;
};

export type SanityPastEvent = {
  _id: string;
  title?: string | null;
  date?: string | null;
  description?: string | null;
  imageUrls?: (string | null)[] | null;
  sourceEventId?: string | null;
};

export type SanityTeamMember = {
  _id: string;
  name?: string | null;
  imageUrl?: string | null;
  role?: string | null;
  year?: string | null;
  blurb?: string | null;
};

type EventForPastSeed = {
  _id: string;
  title?: string | null;
  date?: string | null;
  description?: string | null;
};

function toPastSeedDocId(eventId: string): string {
  return `past-${eventId}`;
}

async function ensurePastEventDocsFromEndedEvents(
  endedEvents: EventForPastSeed[],
  linkedEventIds: Set<string>
) {
  if (!writeClient || endedEvents.length === 0) return;

  const missing = endedEvents.filter((event) => !linkedEventIds.has(event._id));
  if (missing.length === 0) return;

  await Promise.all(
    missing.map((event) =>
      writeClient.createIfNotExists({
        _id: toPastSeedDocId(event._id),
        _type: "pastEvent",
        title: event.title || "Untitled event",
        date: event.date || "",
        description: event.description || "",
        sourceEvent: {
          _type: "reference",
          _ref: event._id,
        },
      })
    )
  );
}

async function removeEndedUpcomingEvents(endedEvents: EventForPastSeed[]) {
  if (!writeClient || endedEvents.length === 0) return;
  await Promise.all(endedEvents.map((event) => writeClient.delete(event._id)));
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!projectId || !dataset) return {};
  try {
    const data = await client.fetch<SiteSettings | null>(
      SITE_SETTINGS_QUERY,
      {},
      { cache: "no-store" } // 👈 ADD THIS
    );
    return data ?? {};
  } catch {
    return {};
  }
}

export async function getLearnMorePage(): Promise<LearnMorePage> {
  if (!projectId || !dataset) return {};
  try {
    const data = await client.fetch<LearnMorePage | null>(LEARN_MORE_QUERY);
    return data ?? {};
  } catch {
    return {};
  }
}

export async function getUpcomingEvents(): Promise<SanityEvent[]> {
  if (!projectId || !dataset) return [];
  try {
    const data = await client.fetch<SanityEvent[] | null>(UPCOMING_EVENTS_QUERY);
    const list = data ?? [];
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    return list.filter((e) => e.date && e.date >= today);
  } catch {
    return [];
  }
}

export async function getPastEvents(): Promise<SanityPastEvent[]> {
  if (!projectId || !dataset) return [];
  try {
    const [manualPastEvents, allEvents] = await Promise.all([
      client.fetch<SanityPastEvent[] | null>(PAST_EVENTS_QUERY),
      client.fetch<SanityEvent[] | null>(ALL_EVENTS_QUERY),
    ]);

    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const manual = manualPastEvents ?? [];
    const endedUpcoming = (allEvents ?? []).filter((event) => event.date && event.date < today);

    const linkedEventIds = new Set(
      manual
        .map((event) => event.sourceEventId)
        .filter((id): id is string => Boolean(id))
    );

    await ensurePastEventDocsFromEndedEvents(endedUpcoming, linkedEventIds);
    await removeEndedUpcomingEvents(endedUpcoming);

    const refreshed = await client.fetch<SanityPastEvent[] | null>(PAST_EVENTS_QUERY);
    const fromSanity = refreshed ?? manual;

    // Merge: always include virtual "past" rows for ended upcoming events that are not
    // already represented as a pastEvent (e.g. no write token on Vercel, or first visit).
    // Previously we returned only fromSanity when length > 0, which hid events like
    // "Battle of the Bands" whenever any other pastEvent doc existed.
    const coveredSourceIds = new Set(
      fromSanity.map((p) => p.sourceEventId).filter((id): id is string => Boolean(id))
    );
    const coveredPastSeedIds = new Set(fromSanity.map((p) => p._id));

    const virtualPast: SanityPastEvent[] = endedUpcoming
      .filter(
        (event) =>
          !coveredSourceIds.has(event._id) &&
          !coveredPastSeedIds.has(toPastSeedDocId(event._id))
      )
      .map((event) => ({
        _id: `auto-${event._id}`,
        title: event.title,
        date: event.date,
        description: event.description ?? "",
        imageUrls: [],
        sourceEventId: event._id,
      }));

    const merged = [...fromSanity, ...virtualPast];
    return merged.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
  } catch {
    return [];
  }
}

export async function getTeamMembers(): Promise<SanityTeamMember[]> {
  if (!projectId || !dataset) return [];
  try {
    const data = await client.fetch<SanityTeamMember[] | null>(TEAM_MEMBERS_QUERY);
    return data ?? [];
  } catch {
    return [];
  }
}
