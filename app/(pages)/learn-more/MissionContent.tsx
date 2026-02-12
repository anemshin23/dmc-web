"use client";

import type { LearnMorePage } from "../../lib/sanity";

const DEFAULT_HEADLINE = "Expanding performance, community, and music accessibility at Duke";
const DEFAULT_MISSION_1 =
  "Duke Music Coalition seeks to increase the presence of music on campus by creating and convening opportunities for all. These include building a network of performers and music lovers, expanding chances for students to perform, bringing in guest speakers from the music and creative industries, and hosting workshops like instrument lessons or studio tours—all while keeping involvement flexible and low-commitment. No auditions, no demanding ensembles, just music.";
const DEFAULT_MISSION_2 =
  "We bring together musicians, listeners, and creators who want to engage with music socially, creatively, and professionally, serving as a one-stop shop for all things music. Open to anyone: singers, instrument players, DJs, producers, and general music lovers alike.";
const DEFAULT_GOALS: Array<{ _key?: string; title: string; items: string[] }> = [
  {
    title: "Increase Student-Facing Music Events on Campus",
    items: [
      "Create more casual, low-barrier performance opportunities",
      "Host social and networking music events",
      "Support academic + music-industry programming",
      "Help students meet like-minded peers — without a large time commitment",
    ],
  },
  {
    title: "Make Music at Duke Less Fragmented & More Accessible",
    items: [
      "Serve as a central convening hub for student music groups",
      "Collaborate with DEMAN, arts leadership, and campus partners",
      "Streamline access to resources, spaces, and opportunities",
    ],
  },
  {
    title: "Building a Music Community",
    items: [
      "Foster collaboration between performers, listeners, and creators",
      "Encourage inclusive participation — not just for musicians",
    ],
  },
  {
    title: "Work Toward 2026 Duke Music Day",
    items: [
      "A campus-wide celebration of music and arts culture",
      "Morning: conference with panels, workshops, alumni + industry speakers",
      "Afternoon / Evening: music festival with student & guest performances",
    ],
  },
];

type MissionContentProps = {
  data?: LearnMorePage | null;
};

export function MissionContent({ data }: MissionContentProps) {
  const headline = data?.headline ?? DEFAULT_HEADLINE;
  const mission1 = data?.missionParagraph1 ?? DEFAULT_MISSION_1;
  const mission2 = data?.missionParagraph2 ?? DEFAULT_MISSION_2;
  const goals = (data?.coreGoals && data.coreGoals.length > 0 ? data.coreGoals : DEFAULT_GOALS) as Array<{ _key?: string; title: string; items: string[] }>;

  return (
    <article className="max-w-4xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-[var(--title-color)] mb-12 leading-tight font-title">
        {headline}
      </h1>

      <section className="mb-14">
        <h2 className="text-xl font-bold text-[var(--title-color)] mb-4 font-title">
          Our Mission
        </h2>
        <div className="space-y-4 text-[var(--pages-writing)] leading-relaxed">
          <p>{mission1}</p>
          <p>{mission2}</p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-[var(--title-color)] mb-6 font-title">
          Our Core Goals
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {goals.map((goal, index) => (
            <div
              key={goal._key ?? index}
              className="rounded-xl border-2 border-[var(--pages-writing)]/30 bg-[var(--pages-boxes)] p-5 transition-all duration-300 hover:border-[var(--pages-writing)]/50 flex flex-col h-full"
            >
              <div className="flex items-start gap-3 mb-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--pages-writing)]/20 text-sm font-bold text-[var(--pages-writing)]">
                  {index + 1}
                </span>
                <h3 className="font-semibold text-[var(--title-color)] leading-snug font-title">
                  {goal.title}
                </h3>
              </div>
              <ul className="list-none space-y-2 flex-1">
                {(goal.items ?? []).map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-[var(--pages-writing)] text-sm"
                  >
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--pages-writing)]/70"
                      aria-hidden
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
