import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ChangelogContent } from "./changelog-content";

export const metadata = { title: "Changelog" };

export default function ChangelogPage() {
  return (
    <>
      <Header />
      <main className="py-20 md:py-28 bg-cream">
        <ChangelogContent />
      </main>
      <Footer />
    </>
  );
}
