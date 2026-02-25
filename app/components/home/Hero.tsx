"use client";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useEffect, useState, useRef } from "react";
import Button from "@/app/components/home/Button"; // adjust path to where you saved the file

const TYPING_PHRASE = "Start Messaging";
const TYPING_SPEED = 90;
const PAUSE_AFTER = 1800;
const DELETE_SPEED = 45;
const PAUSE_BEFORE = 800;

function useTypingAnimation() {
  const [displayed, setDisplayed] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const phaseRef = useRef<"typing" | "pausing" | "deleting" | "waiting">(
    "typing",
  );
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const tick = () => {
      if (phaseRef.current === "typing") {
        if (indexRef.current < TYPING_PHRASE.length) {
          indexRef.current++;
          setDisplayed(TYPING_PHRASE.slice(0, indexRef.current));
          timerRef.current = setTimeout(tick, TYPING_SPEED);
        } else {
          phaseRef.current = "pausing";
          timerRef.current = setTimeout(tick, PAUSE_AFTER);
        }
      } else if (phaseRef.current === "pausing") {
        phaseRef.current = "deleting";
        tick();
      } else if (phaseRef.current === "deleting") {
        if (indexRef.current > 0) {
          indexRef.current--;
          setDisplayed(TYPING_PHRASE.slice(0, indexRef.current));
          timerRef.current = setTimeout(tick, DELETE_SPEED);
        } else {
          phaseRef.current = "waiting";
          timerRef.current = setTimeout(tick, PAUSE_BEFORE);
        }
      } else {
        phaseRef.current = "typing";
        tick();
      }
    };

    timerRef.current = setTimeout(tick, 400);
    const cursorInterval = setInterval(() => setShowCursor((v) => !v), 530);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      clearInterval(cursorInterval);
    };
  }, []);

  return { displayed, showCursor };
}

const MOCK_MESSAGES = [
  {
    side: "left",
    avatarUrl: "/9434619.jpg",
    text: "Hey, are you free for a quick call?",
  },
  {
    side: "right",
    avatarUrl: "/9442242.jpg",
    text: "Sure! Give me 5 minutes",
  },
  {
    side: "left",
    avatarUrl: "/9434619.jpg",
    text: "Perfect, I'll send the link now.",
  },
];

export default function Hero() {
  const { displayed, showCursor } = useTypingAnimation();

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
            Channels when you need reach. Direct messages for quick decisions.
            Built with Next.js, Clerk, and Convex.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <SignedOut>
              <SignUpButton>
                <button className="relative flex items-center gap-1 bg-white px-8 py-3 bg-inherit rounded-4xl font-semibold text-[#6c47ff] cursor-pointer overflow-hidden transition-all duration-700 ease-custom border-2 border-transparent hover:text-white hover:rounded-3xl hover:border-white group hover:duration-700">
      <svg
        viewBox="0 0 24 24"
        className="absolute w-6 fill-[#6c47ff] z-[9] transition-all duration-700 ease-custom -left-1/4 group-hover:left-4 group-hover:fill-white"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
      </svg>
      <span className="relative z-[1] transition-all duration-700 ease-custom -translate-x-3 group-hover:translate-x-3">
        Create an account
      </span>
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-[#7f5aff] rounded-full opacity-0 transition-all duration-700 ease-custom group-hover:w-[220px] group-hover:h-[220px] group-hover:opacity-100" />
      <svg
        viewBox="0 0 24 24"
        className="absolute w-6 fill-[#6c47ff] z-[9] transition-all duration-700 ease-custom right-4 group-hover:-right-1/4 group-hover:fill-white"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
      </svg>
    </button>
              </SignUpButton>
              <SignInButton>
                <button className="inline-flex cursor-default  hover:cursor-pointer hover:bg-white transition-all duration-700 hover:text-[#6c47ff] items-center rounded-full border border-white/70 px-6 py-3 text-sm font-medium text-white">
                  Sign in
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
  <Link href="/chat">
    <Button />
  </Link>
</SignedIn>
          </div>
        </div>

        {/* Preview card */}
        <div className="mt-12 rounded-2xl border border-white/20 bg-white/10 backdrop-blur p-4">
          <div className="rounded-xl bg-gradient-to-br from-white/30 to-white/5 p-4 flex flex-col gap-3 min-h-[15rem]">
            {MOCK_MESSAGES.map((m, i) => (
              <div
                key={i}
                className={`flex items-end gap-2 ${m.side === "right" ? "flex-row-reverse" : ""}`}
              >
                <img
                  src={m.avatarUrl}
                  alt="avatar"
                  className="h-7 w-7 rounded-full shrink-0 object-cover"
                />
                <div
                  className={`rounded-2xl px-3 py-1.5 text-sm text-white max-w-[75%] shadow-sm ${
                    m.side === "right" ? "bg-[#7C3AED]/70" : "bg-white/20"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {/* Typing input row */}
            <div className="mt-auto flex hover:cursor-text items-center gap-2 rounded-full bg-white/20 border border-white/30 px-4 py-2">
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    className="text-white/70 shrink-0"
  >
    <path
      d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66L9.41 17.41a2 2 0 01-2.83-2.83l8.49-8.48"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
              <span className="flex-1 text-sm text-white/80 tracking-wide">
                {displayed}
                <span
                  className="inline-block w-[2px] h-[1em] ml-[1px] align-middle bg-white rounded-sm"
                  style={{
                    opacity: showCursor ? 1 : 0,
                    transition: "opacity 0.1s",
                  }}
                />
              </span>
              <div className="h-6 w-6 hover:cursor-pointer rounded-full bg-white/30 flex items-center justify-center shrink-0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                  <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
