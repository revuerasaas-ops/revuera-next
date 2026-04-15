import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="py-32 text-center">
        <div className="section-container">
          <p className="text-8xl font-extrabold text-stone-200 mb-4">404</p>
          <h1 className="text-display-sm text-stone-900 mb-3">Page not found</h1>
          <p className="text-body-md text-stone-500 mb-8">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
          <Button asChild className="bg-brand-600 hover:bg-brand-700"><Link href="/"><Home className="h-4 w-4 mr-2" />Back to Home</Link></Button>
        </div>
      </main>
      <Footer />
    </>
  );
}
