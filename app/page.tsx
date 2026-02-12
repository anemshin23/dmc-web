import Image from "next/image";
import { NavHeader } from "./components/NavHeader";
import { getSiteSettings } from "./lib/sanity";

const DEFAULT_GROUPME_LINK = "https://groupme.com/join_group/REPLACE_WITH_YOUR_GROUPME_LINK";
const DEFAULT_CONTACT_EMAIL = "contact@dukemusiccoalition.org";

export default async function Home() {
  const settings = await getSiteSettings();
  const groupmeLink = settings.groupmeLink || DEFAULT_GROUPME_LINK;
  const contactEmail = settings.email || DEFAULT_CONTACT_EMAIL;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero with dmc.png background - full viewport */}
      <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden">
        <Image
          src="/dmc.png"
          alt=""
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div
          className="absolute inset-0 hero-overlay"
          aria-hidden
        />

        <NavHeader variant="floating" />

        <div className="relative z-10 flex flex-col items-center justify-center gap-6 pt-12">
          {/* No LuLuMar replacement - empty hero */}
        </div>
        <p className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-sm font-medium uppercase tracking-widest text-white/80">
          Scroll to connect
        </p>
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 animate-bounce" aria-hidden>
          <svg className="h-5 w-5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </span>
      </section>

      {/* Section below the fold: Join GroupMe (link), Email (mailto) */}
      <section className="min-h-[50vh] w-full flex flex-col items-center justify-center gap-10 py-20 px-6 bg-[var(--pages-bg)]">
        <a
          href={groupmeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-80 min-w-[280px] items-center gap-4 rounded-2xl bg-[var(--pages-boxes)] border-2 border-[var(--pages-writing)]/20 px-8 py-5 shadow-sm hover:border-[var(--pages-writing)]/40 hover:shadow-md transition-all"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--pages-writing)]/15 text-[var(--pages-writing)]">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </span>
          <span className="text-lg font-semibold text-[var(--pages-writing)]">Join GroupMe</span>
        </a>

        <a
          href={`mailto:${contactEmail}`}
          className="flex w-80 min-w-[280px] items-center gap-4 rounded-2xl bg-[var(--pages-boxes)] border-2 border-[var(--pages-writing)]/20 px-8 py-5 shadow-sm hover:border-[var(--pages-writing)]/40 hover:shadow-md transition-all"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--pages-writing)]/15 text-[var(--pages-writing)]">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </span>
          <span className="text-lg font-semibold text-[var(--pages-writing)]">Email</span>
        </a>
      </section>
    </div>
  );
}
