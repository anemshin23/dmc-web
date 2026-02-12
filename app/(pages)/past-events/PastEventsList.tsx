"use client";

import Image from "next/image";
import { useState } from "react";

export type PastEventItem = {
  id: string;
  title: string;
  date: string;
  description: string;
  images: string[];
};

type PastEventsListProps = {
  events: PastEventItem[];
};

export function PastEventsList({ events }: PastEventsListProps) {
  const [selectedEvent, setSelectedEvent] = useState<PastEventItem | null>(null);
  const [imageIndex, setImageIndex] = useState(0);

  const openEvent = (event: PastEventItem) => {
    setSelectedEvent(event);
    setImageIndex(0);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {events.map((event) => (
          <button
            key={event.id}
            type="button"
            onClick={() => openEvent(event)}
            className="text-left rounded-2xl bg-[var(--pages-boxes)] border-2 border-[var(--pages-writing)]/20 overflow-hidden shadow-sm hover:border-[var(--pages-writing)]/40 hover:shadow-md transition-all"
          >
            <div className="relative aspect-video w-full bg-[var(--pages-writing)]/10">
              {event.images[0] ? (
                <Image
                  src={event.images[0]}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 50vw"
                  unoptimized
                />
              ) : null}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-[var(--title-color)] font-title">{event.title}</h3>
              <p className="text-sm text-[var(--pages-writing)]/80 mt-1">{event.date}</p>
              <p className="text-sm text-[var(--pages-writing)]/90 mt-2 line-clamp-2">{event.description}</p>
            </div>
          </button>
        ))}
      </div>

      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 overflow-y-auto"
          onClick={() => setSelectedEvent(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="past-event-modal-title"
        >
          <div
            className="w-full max-w-2xl my-8 rounded-2xl bg-white shadow-xl border-2 border-[var(--pages-writing)]/20 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video w-full bg-[var(--pages-writing)]/10">
              {selectedEvent.images.length > 0 ? (
                <>
                  <Image
                    src={selectedEvent.images[imageIndex]}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 672px) 100vw, 672px"
                    unoptimized
                  />
                  {selectedEvent.images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageIndex((i) => (i === 0 ? selectedEvent.images.length - 1 : i - 1));
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 text-white p-2 hover:bg-black/70"
                        aria-label="Previous image"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageIndex((i) => (i === selectedEvent.images.length - 1 ? 0 : i + 1));
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 text-white p-2 hover:bg-black/70"
                        aria-label="Next image"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      <span className="absolute bottom-2 right-2 rounded bg-black/50 px-2 py-0.5 text-xs text-white">
                        {imageIndex + 1} / {selectedEvent.images.length}
                      </span>
                    </>
                  )}
                </>
              ) : null}
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start gap-4 mb-4">
                <div>
                  <h2 id="past-event-modal-title" className="text-xl font-semibold text-[var(--title-color)] font-title">
                    {selectedEvent.title}
                  </h2>
                  <p className="text-sm text-[var(--pages-writing)]/80 mt-1">{selectedEvent.date}</p>
                </div>
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
              <p className="text-[var(--pages-writing)] leading-relaxed">{selectedEvent.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
