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
      <EventCalendar events={events} />
    </main>
  );
}
