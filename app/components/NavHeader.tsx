"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";

const eventLinks = [
  { label: "Upcoming Events", href: "/upcoming-events" },
  { label: "Past Events", href: "/past-events" },
];

type NavHeaderProps = {
  variant?: "floating" | "solid";
};

export function NavHeader({ variant = "floating" }: NavHeaderProps) {
  const [eventsOpen, setEventsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setEventsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isFloating = variant === "floating";
  const headerClasses = isFloating
    ? "absolute top-4 left-4 right-4 sm:top-8 sm:left-6 sm:right-6 z-20 mx-auto flex h-14 sm:h-16 max-w-6xl items-center justify-between px-4 sm:px-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10"
    : "flex h-14 sm:h-16 max-w-6xl w-full mx-auto items-center justify-between px-4 sm:px-8 rounded-2xl bg-[var(--pages-boxes)] backdrop-blur-md border-2 border-[var(--pages-writing)]/30";

  const linkClasses = isFloating
    ? "text-sm font-medium text-white drop-shadow-sm hover:text-white/90 transition-colors"
    : "text-sm font-medium text-[var(--pages-writing)] hover:opacity-80 transition-colors";
  const dropdownPanelClasses = isFloating
    ? "absolute top-full left-0 mt-2 min-w-[180px] rounded-xl bg-white/15 backdrop-blur-md border border-white/20 py-2 shadow-lg"
    : "absolute top-full left-0 mt-2 min-w-[180px] rounded-xl bg-[var(--pages-boxes)] border-2 border-[var(--pages-writing)]/30 py-2 shadow-lg";
  const dropdownLinkClasses = isFloating
    ? "block px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors first:rounded-t-xl last:rounded-b-xl"
    : "block px-4 py-2 text-sm font-medium text-[var(--pages-writing)] hover:bg-[var(--pages-writing)]/10 transition-colors first:rounded-t-xl last:rounded-b-xl";
  const logoClasses = isFloating
    ? "text-lg font-semibold text-white drop-shadow-sm hover:text-white/90 transition-colors"
    : "text-lg font-semibold text-[var(--pages-writing)] hover:opacity-80 transition-colors";
  const eventsButtonClasses = isFloating
    ? "flex items-center gap-1 text-sm font-medium text-white drop-shadow-sm hover:text-white/90 transition-colors"
    : "flex items-center gap-1 text-sm font-medium text-[var(--pages-writing)] hover:opacity-80 transition-colors";

  return (
    <header className={headerClasses}>
      <Link
        href="/"
        className={`${logoClasses} flex items-center justify-center`}
        aria-label="Home"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </Link>
      <nav className="flex items-center gap-4 sm:gap-8">
        <Link href="/learn-more" className={linkClasses}>
          Learn More
        </Link>

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setEventsOpen((o) => !o)}
            className={eventsButtonClasses}
            aria-expanded={eventsOpen}
            aria-haspopup="true"
          >
            Events
            <svg
              className={`h-4 w-4 transition-transform ${eventsOpen ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {eventsOpen && (
            <div className={dropdownPanelClasses}>
              {eventLinks.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setEventsOpen(false)}
                  className={dropdownLinkClasses}
                >
                  {label}
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link href="/team" className={linkClasses}>
          Team
        </Link>
      </nav>
    </header>
  );
}
