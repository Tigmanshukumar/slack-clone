"use client";

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#111113] shadow-[0_1px_0_rgba(255,255,255,0.02)] p-4 transition-all duration-300 hover:border-[#7C3AED]/40 hover:bg-[#121214]">
      <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="absolute top-1/2 -translate-y-1/2 left-[-40%] w-24 h-[180%] bg-gradient-to-r from-transparent via-[#7C3AED]/20 to-transparent blur-xl transition-all duration-700 group-hover:left-[140%]" />
      </span>
      <div className="text-sm font-semibold text-[#E4E4E7]">{title}</div>
      <div className="mt-1 text-sm text-[#A1A1AA]">{desc}</div>
    </div>
  );
}

export default function Features() {
  return (
    <section className="mx-auto max-w-6xl bg-black px-6 py-16">
      <h2 className="text-xl font-semibold text-[#E4E4E7] tracking-[0.01em]">Why teams like it</h2>
      <div className="mt-6 rounded-2xl border border-white/10 bg-[#0F0F10] shadow-[0_1px_0_rgba(255,255,255,0.02)] p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          <FeatureCard title="Direct messages" desc="Fast, private 1:1 conversations that update in real time." />
          <FeatureCard title="Searchable people" desc="Find teammates quickly and jump into context." />
          <FeatureCard title="Reliable timestamps" desc="Readable times for today; clear dates for everything else." />
          <FeatureCard title="Presence" desc="Know who’s online at a glance." />
          <FeatureCard title="Typing" desc="See activity as it happens." />
          <FeatureCard title="Responsive" desc="A focused mobile chat and a roomy desktop layout." />
        </div>
      </div>
    </section>
  );
}
