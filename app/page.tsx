import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#6c47ff] via-[#7f5aff] to-[#b44dff]" />
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-16 h-72 w-72 rounded-full bg-pink-300/20 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-6 py-24">
          <div className="flex items-center gap-3 text-white">
            <Image src="/next.svg" alt="Logo" width={40} height={40} className="dark:invert opacity-90" />
            <div className="text-lg font-semibold tracking-tight">Tars Chat</div>
          </div>
          <div className="mt-8 max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-semibold leading-tight text-white tracking-[0.01em]">
              Stay in sync with fast, focused messaging
            </h1>
            <p className="mt-4 text-white/90">
              Channels when you need reach. Direct messages for quick decisions. Built with Next.js, Clerk, and Convex.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <SignedOut>
                <Link href="/sign-up" className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-medium text-[#3b2bd1]">
                  Create an account
                </Link>
                <Link href="/sign-in" className="inline-flex items-center rounded-full border border-white/70 px-6 py-3 text-sm font-medium text-white">
                  Sign in
                </Link>
              </SignedOut>
              <SignedIn>
                <Link href="/chat" className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-medium text-[#3b2bd1]">
                  Open chat
                </Link>
              </SignedIn>
            </div>
          </div>
          <div className="mt-12 rounded-2xl border border-white/20 bg-white/10 backdrop-blur p-4">
            <div className="h-48 rounded-xl bg-gradient-to-br from-white/30 to-white/5" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 tracking-[0.01em]">Why teams like it</h2>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Feature title="Direct messages" desc="Fast, private 1:1 conversations that update in real time." />
          <Feature title="Searchable people" desc="Find teammates quickly and jump into context." />
          <Feature title="Reliable timestamps" desc="Readable times for today; clear dates for everything else." />
          <Feature title="Presence" desc="Know who’s online at a glance." />
          <Feature title="Typing" desc="See activity as it happens." />
          <Feature title="Responsive" desc="A focused mobile chat and a roomy desktop layout." />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 tracking-[0.01em]">How it works</h2>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Step n="1" title="Sign in" desc="Use email or social. Profiles sync automatically." />
          <Step n="2" title="Find people" desc="Search users and open or create a DM." />
          <Step n="3" title="Start chatting" desc="Messages stream live with smart auto‑scroll." />
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
      </section>
    </main>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-950">
      <div className="text-sm font-semibold text-black dark:text-zinc-50">{title}</div>
      <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{desc}</div>
    </div>
  );
}

function Step({ n, title, desc }: { n: string; title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-950">
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-full bg-[#6c47ff] text-white text-xs flex items-center justify-center">{n}</div>
        <div className="text-sm font-semibold text-black dark:text-zinc-50">{title}</div>
      </div>
      <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{desc}</div>
    </div>
  );
}
