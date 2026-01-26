import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Demo } from "@/components/Demo";
import { Workflow } from "@/components/Workflow";
import { Features } from "@/components/Features";
import { UseCases } from "@/components/UseCases";
import { Pricing } from "@/components/Pricing";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <Demo />
      <Workflow />
      <Features />
      <UseCases />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}
