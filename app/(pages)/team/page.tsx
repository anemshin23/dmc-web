import { getTeamMembers } from "@/app/lib/sanity";
import { TeamGrid } from "./TeamGrid";

export default async function Team() {
  const sanityMembers = await getTeamMembers();
  const members = sanityMembers.map((m) => ({
    id: m._id,
    name: m.name ?? "",
    image: m.imageUrl ?? "",
    role: m.role ?? "",
    year: m.year ?? "",
    blurb: m.blurb ?? "",
  }));

  return (
    <main className="py-16">
      <h1 className="text-3xl font-semibold text-[var(--title-color)] mb-10 font-title">Meet the Team</h1>
      <TeamGrid members={members} />
    </main>
  );
}
