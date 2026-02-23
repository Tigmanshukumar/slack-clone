import Hero from "./components/home/Hero";
import Features from "./components/home/Features";
import HowItWorks from "./components/home/HowItWorks";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <HowItWorks />
    </main>
  );
}
