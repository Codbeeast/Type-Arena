import { Hero } from "@/components/Hero";
import { StatsStrip } from "@/components/StatsStrip";
import { Features } from "@/components/Features";
import { TypingPreview } from "@/components/TypingPreview";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-neon-blue selection:text-black">
      <Hero />
      <StatsStrip />
      <Features />
      <TypingPreview />
      <Footer />
    </main>
  );
}
