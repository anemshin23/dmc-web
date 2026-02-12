"use client";

import { useState, useMemo } from "react";

export type EventItem = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  location: string;
  description: string;
  partiful?: string;
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type EventCalendarProps = {
  events: EventItem[];
};

function getInitialMonth(events: EventItem[]): { year: number; month: number } {
  const now = new Date();
  const today = { year: now.getFullYear(), month: now.getMonth() };
  if (events.length === 0) return today;
  const sorted = [...events].sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  const first = sorted.find((e) => e.date);
  if (!first?.date) return today;
  const [y, m] = first.date.split("-").map(Number);
  const month = (m ?? 1) - 1; // 0-indexed
  return { year: y ?? today.year, month: Number.isNaN(month) ? today.month : month };
}

export function EventCalendar({ events }: EventCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => getInitialMonth(events));
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const { daysInMonth, firstDayOfWeek, monthLabel } = useMemo(() => {
    const year = currentMonth.year;
    const month = currentMonth.month;
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const daysInMonth = last.getDate();
    const firstDayOfWeek = first.getDay();
    const monthLabel = first.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    return { daysInMonth, firstDayOfWeek, monthLabel };
  }, [currentMonth.year, currentMonth.month]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, EventItem[]> = {};
    events.forEach((ev) => {
      if (!map[ev.date]) map[ev.date] = [];
      map[ev.date].push(ev);
    });
    return map;
  }, [events]);

  const calendarCells = useMemo(() => {
    const cells: { day: number | null; events: EventItem[] }[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) cells.push({ day: null, events: [] });
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${currentMonth.year}-${String(currentMonth.month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      cells.push({ day: d, events: eventsByDate[dateStr] ?? [] });
    }
    return cells;
  }, [currentMonth, daysInMonth, firstDayOfWeek, eventsByDate]);

  const goPrev = () => {
    setCurrentMonth((m) =>
      m.month === 0 ? { year: m.year - 1, month: 11 } : { year: m.year, month: m.month - 1 }
    );
  };
  const goNext = () => {
    setCurrentMonth((m) =>
      m.month === 11 ? { year: m.year + 1, month: 0 } : { year: m.year, month: m.month + 1 }
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-[var(--title-color)] font-title">{monthLabel}</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={goPrev}
            className="rounded-lg bg-[var(--pages-boxes)] border-2 border-[var(--pages-writing)]/20 px-3 py-1.5 text-sm font-medium text-[var(--pages-writing)] hover:opacity-80"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={goNext}
            className="rounded-lg bg-[var(--pages-boxes)] border-2 border-[var(--pages-writing)]/20 px-3 py-1.5 text-sm font-medium text-[var(--pages-writing)] hover:opacity-80"
          >
            Next
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-[var(--pages-boxes)] border-2 border-[var(--pages-writing)]/20 overflow-hidden shadow-sm">
        <div className="grid grid-cols-7 border-b-2 border-[var(--pages-writing)]/20">
          {DAYS.map((day) => (
            <div
              key={day}
              className="py-3 text-center text-sm font-semibold text-[var(--pages-writing)]"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 auto-rows-fr min-h-[480px]">
          {calendarCells.map((cell, i) => (
            <div
              key={i}
              className="min-h-[6rem] border-b border-r border-[var(--pages-writing)]/10 p-2 last:border-r-0"
            >
              {cell.day === null ? (
                <span className="inline-block p-2 text-[var(--pages-writing)]/30 text-base" />
              ) : cell.events.length === 0 ? (
                <span className="inline-block p-2 text-[var(--pages-writing)]/50 text-base">
                  {cell.day}
                </span>
              ) : (
                <div className="flex flex-col gap-2 h-full">
                  <span className="text-sm text-[var(--pages-writing)]">
                    {cell.day}
                  </span>
                  {cell.events.map((ev) => (
                    <button
                      key={ev.id}
                      type="button"
                      onClick={() => setSelectedEvent(ev)}
                      className="text-left text-sm font-medium text-[var(--pages-writing)] bg-[var(--pages-writing)]/15 hover:bg-[var(--pages-writing)]/25 rounded px-3 py-2 truncate border border-[var(--pages-writing)]/20"
                    >
                      {ev.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setSelectedEvent(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="event-modal-title"
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white shadow-xl border-2 border-[var(--pages-writing)]/20 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start gap-4 mb-4">
              <h3 id="event-modal-title" className="text-xl font-semibold text-[var(--title-color)] font-title">
                {selectedEvent.title}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="shrink-0 rounded-lg p-1 text-[var(--pages-writing)] hover:bg-[var(--pages-writing)]/10"
                aria-label="Close"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <dl className="space-y-3 text-[var(--pages-writing)]">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--pages-writing)]/70">Date</dt>
                <dd>{new Date(selectedEvent.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--pages-writing)]/70">Time</dt>
                <dd>{selectedEvent.time}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--pages-writing)]/70">Where</dt>
                <dd>{selectedEvent.location}</dd>
              </div>
              {selectedEvent.description && (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--pages-writing)]/70">Details</dt>
                  <dd className="mt-1">{selectedEvent.description}</dd>
                </div>
              )}
              {selectedEvent.partiful && (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--pages-writing)]/70">RSVP</dt>
                  <dd className="mt-1">
                    <a
                      href={selectedEvent.partiful}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--theme-purple)] underline underline-offset-2 hover:opacity-80"
                    >
                      View on Partiful →
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}
