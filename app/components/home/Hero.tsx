"use client";
import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#6c47ff] via-[#7f5aff] to-[#b44dff]" />
      <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
      <div className="absolute -bottom-20 -right-16 h-72 w-72 rounded-full bg-pink-300/20 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-6 py-24">
        <div className="flex items-center gap-3 text-white">
          
          <div className="text-lg font-semibold tracking-tight">Slack Chat</div>
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
              <SignUpButton>
                <button className="inline-flex cursor-default hover:cursor-pointer items-center rounded-full bg-white px-6 py-3 text-sm font-medium text-[#3b2bd1]">
                  Create an account
                </button>
              </SignUpButton>
              <SignInButton>
                <button className="inline-flex cursor-default hover:cursor-pointer items-center rounded-full border border-white/70 px-6 py-3 text-sm font-medium text-white">
                  Sign in
                </button>
              </SignInButton>
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
  );
}
