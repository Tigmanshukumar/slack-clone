"use client";
import Link from "next/link";
import { SignedIn, SignedOut, SignUpButton } from "@clerk/nextjs";

function StepCard({ n, title, desc }: { n: string; title: string; desc: string }) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#111113] shadow-[0_1px_0_rgba(255,255,255,0.02)] p-4 transition-all duration-300 hover:border-[#7C3AED]/40 hover:bg-[#121214]">
      <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="absolute top-1/2 -translate-y-1/2 left-[-40%] w-24 h-[180%] bg-gradient-to-r from-transparent via-[#7C3AED]/20 to-transparent blur-xl transition-all duration-700 group-hover:left-[140%]" />
      </span>
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
    <section className="mx-auto max-w-6xl bg-black px-6 py-16">
      <h2 className="text-xl font-semibold text-[#E4E4E7] tracking-[0.01em]">How it works</h2>
      <div className="mt-6 rounded-2xl border border-white/10 bg-[#0F0F10] shadow-[0_1px_0_rgba(255,255,255,0.02)] p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
          <StepCard n="1" title="Sign in" desc="Use email or social. Profiles sync automatically." />
          <StepCard n="2" title="Find people" desc="Search users and open or create a DM." />
          <StepCard n="3" title="Start chatting" desc="Messages stream live with smart auto‑scroll." />
        </div>
        <div className="mt-8">
          <SignedOut>
            <SignUpButton>
            <button className="relative flex items-center gap-1 bg-[#6c47ff] px-8 py-2 rounded-xl font-semibold text-sm text-white cursor-pointer overflow-hidden transition-all duration-700 ease-custom border-2 border-transparent hover:text-[#6c47ff] hover:rounded-3xl hover:border-[#6c47ff] group hover:duration-700">
      <svg
        viewBox="0 0 24 24"
        className="absolute w-6 fill-white z-[9] transition-all duration-700 ease-custom -left-1/4 group-hover:left-4 group-hover:fill-[#6c47ff]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
      </svg>
      <span className="relative z-[1] transition-all duration-700 ease-custom -translate-x-3 group-hover:translate-x-3">
        Get started free
      </span>
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full opacity-0 transition-all duration-700 ease-custom group-hover:w-[220px] group-hover:h-[220px] group-hover:opacity-100" />
      <svg
        viewBox="0 0 24 24"
        className="absolute w-6 fill-white z-[9] transition-all duration-700 ease-custom right-4 group-hover:-right-1/4 group-hover:fill-[#6c47ff]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
      </svg>
    </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
          
    <button className="relative flex items-center gap-1 bg-[#6c47ff] px-8 py-2 rounded-xl font-semibold text-sm text-white cursor-pointer overflow-hidden transition-all duration-700 ease-custom border-2 border-transparent hover:text-[#6c47ff] hover:rounded-3xl hover:border-[#6c47ff] group hover:duration-700">
      <svg
        viewBox="0 0 24 24"
        className="absolute w-6 fill-white z-[9] transition-all duration-700 ease-custom -left-1/4 group-hover:left-4 group-hover:fill-[#6c47ff]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
      </svg>
      <span className="relative z-[1] transition-all duration-700 ease-custom -translate-x-3 group-hover:translate-x-3">
        Open Chat
      </span>
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full opacity-0 transition-all duration-700 ease-custom group-hover:w-[220px] group-hover:h-[220px] group-hover:opacity-100" />
      <svg
        viewBox="0 0 24 24"
        className="absolute w-6 fill-white z-[9] transition-all duration-700 ease-custom right-4 group-hover:-right-1/4 group-hover:fill-[#6c47ff]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
      </svg>
    </button>
          </SignedIn>
        </div>
      </div>
    </section>
  );
}
