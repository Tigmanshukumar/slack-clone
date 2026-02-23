"use client";
import { KeyboardEvent } from "react";

type Props = {
  input: string;
  onInputChange: (v: string) => void;
  onSend: () => void;
};

export default function Composer({ input, onInputChange, onSend }: Props) {
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSend();
  };
  return (
    <div className="h-16 border-t border-[rgba(255,255,255,0.05)] bg-[#111113] flex items-center gap-2 px-3">
      <input
        className="flex-1 rounded-full border border-[rgba(255,255,255,0.08)] bg-[#18181B] px-4 py-2 text-[16px] outline-none text-[#E4E4E7] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/30 transition"
        placeholder="Type a message"
        value={input}
        onChange={e => onInputChange(e.target.value)}
        onKeyDown={onKeyDown}
      />
      <button
        className="rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] transition text-white px-4 py-2 text-sm shadow-[0_0_10px_rgba(124,58,237,0.25)]"
        onClick={onSend}
      >
        Send
      </button>
    </div>
  );
}
