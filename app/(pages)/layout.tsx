import { NavHeader } from "../components/NavHeader";

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen pages-purple-bg">
      <div className="sticky top-0 z-30 backdrop-blur-md">
        <div className="flex justify-center px-6 py-4">
          <NavHeader variant="solid" />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-8">
        {children}
      </div>
    </div>
  );
}
