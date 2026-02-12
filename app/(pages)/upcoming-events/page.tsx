import { getUpcomingEvents } from "@/app/lib/sanity";
import { EventCalendar } from "./EventCalendar";

export default async function UpcomingEvents() {
  const sanityEvents = await getUpcomingEvents();
  const events = sanityEvents.map((e) => ({
    id: e._id,
    title: e.title ?? "",
    date: e.date ?? "",
    time: e.time ?? "",
    location: e.location ?? "",
    description: e.description ?? "",
    partiful: e.partiful ?? undefined,
  }));

  return (
    <main className="py-16">
      <h1 className="text-3xl font-semibold text-[var(--title-color)] mb-8 font-title">Upcoming Events</h1>
      {events.length === 0 ? (
        <p className="text-[var(--pages-writing)]/80 max-w-md">
          No upcoming events right now. Add events in Sanity Studio (Upcoming Events), and make sure to publish them.
          If you expect to see events, check that <code className="text-sm bg-[var(--pages-writing)]/10 px-1 rounded">NEXT_PUBLIC_SANITY_PROJECT_ID</code> and{" "}
          <code className="text-sm bg-[var(--pages-writing)]/10 px-1 rounded">NEXT_PUBLIC_SANITY_DATASET</code> are set in <code className="text-sm bg-[var(--pages-writing)]/10 px-1 rounded">.env.local</code>.
        </p>
      ) : (
        <EventCalendar events={events} />
      )}
    </main>
  );
}
