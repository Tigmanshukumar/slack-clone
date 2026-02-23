"use client";

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#111113] shadow-[0_1px_0_rgba(255,255,255,0.02)] p-4">
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
