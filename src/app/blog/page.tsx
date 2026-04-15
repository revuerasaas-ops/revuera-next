import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BlogContent } from "./blog-content";

export const metadata = { title: "Blog" };

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="py-20 md:py-28 bg-cream">
        <BlogContent />
      </main>
      <Footer />
    </>
  );
}
