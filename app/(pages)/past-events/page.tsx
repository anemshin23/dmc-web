import { getPastEvents } from "@/app/lib/sanity";
import { PastEventsList } from "./PastEventsList";

function formatDateForDisplay(value: string): string {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const parsed = new Date(`${value}T12:00:00`);
    return parsed.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }
  return value;
}

export default async function PastEvents() {
  const sanityEvents = await getPastEvents();
  const events = sanityEvents.map((e) => ({
    id: e._id,
    title: e.title ?? "",
    date: formatDateForDisplay(e.date ?? ""),
    description: e.description ?? "",
    images: (e.imageUrls ?? []).filter((u): u is string => Boolean(u)),
  }));

  return (
    <main className="py-16">
      <h1 className="text-3xl font-semibold text-[var(--title-color)] mb-8 font-title">Past Events</h1>
      <PastEventsList events={events} />
    </main>
  );
}
