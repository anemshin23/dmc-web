import { getLearnMorePage } from "../../lib/sanity";
import { MissionContent } from "./MissionContent";

export default async function LearnMore() {
  const data = await getLearnMorePage();
  return (
    <main className="min-h-screen py-12 sm:py-16">
      <MissionContent data={data} />
    </main>
  );
}
