"use client";

import Image from "next/image";

export type TeamMember = {
  id: string;
  name: string;
  image: string; // path in public/ or URL (Sanity CDN)
  role: string;
  year: string;
  blurb: string;
};

type TeamGridProps = {
  members: TeamMember[];
};

export function TeamGrid({ members }: TeamGridProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {members.map((member) => (
          <li
            key={member.id}
            className="flex flex-col items-center text-center"
          >
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-[var(--pages-writing)]/15 border-2 border-[var(--pages-writing)]/20 shrink-0">
              {member.image ? (
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center text-[var(--pages-writing)]/40 text-4xl font-title" aria-hidden>
                  ?
                </span>
              )}
            </div>
            <h3 className="mt-4 text-lg font-semibold text-[var(--title-color)] font-title">
              {member.name}
            </h3>
            <p className="text-sm font-medium text-[var(--pages-writing)]/90">
              {member.role}
            </p>
            <p className="text-sm text-[var(--pages-writing)]/80">
              {member.year}
            </p>
            <p className="mt-2 text-sm text-[var(--pages-writing)] leading-relaxed max-w-xs">
              {member.blurb}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
