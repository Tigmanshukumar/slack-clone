"use client";
import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";

function StepCard({ n, title, desc }: { n: string; title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-[rgba(255,255,255,0.08)] p-4 bg-white/5 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-full bg-[#6c47ff] text-white text-xs flex items-center justify-center">{n}</div>
        <div className="text-sm font-semibold text-[#E4E4E7]">{title}</div>
      </div>
      <div className="mt-1 text-sm text-[#A1A1AA]">{desc}</div>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="text-xl font-semibold text-[#E4E4E7] tracking-[0.01em]">How it works</h2>
      <div className="mt-6 rounded-2xl border border-[rgba(255,255,255,0.06)] bg-white/5 backdrop-blur-xl p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StepCard n="1" title="Sign in" desc="Use email or social. Profiles sync automatically." />
          <StepCard n="2" title="Find people" desc="Search users and open or create a DM." />
          <StepCard n="3" title="Start chatting" desc="Messages stream live with smart auto‑scroll." />
        </div>
        <div className="mt-8">
          <SignedOut>
            <Link href="/sign-up" className="inline-flex items-center rounded-full bg-[#6c47ff] px-6 py-3 text-sm font-medium text-white">
              Get started free
            </Link>
          </SignedOut>
          <SignedIn>
            <Link href="/chat" className="inline-flex items-center rounded-full bg-[#6c47ff] px-6 py-3 text-sm font-medium text-white">
              Open chat
            </Link>
          </SignedIn>
        </div>
      </div>
    </section>
  );
}
