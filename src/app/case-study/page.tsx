import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CaseStudyContent } from "./case-study-content";

export const metadata = { title: "Case Study — Arrow Air Conditioning" };

export default function CaseStudyPage() {
  return (
    <>
      <Header />
      <CaseStudyContent />
      <Footer />
    </>
  );
}
