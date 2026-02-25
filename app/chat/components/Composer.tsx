"use client";
import { KeyboardEvent, useRef } from "react";

type Props = {
  input: string;
  onInputChange: (v: string) => void;
  onSend: () => void;
  onSelectFile: (file: File) => void;
  uploading?: boolean;
};

export default function Composer({ input, onInputChange, onSend, onSelectFile, uploading }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSend();
  };
  return (
    <div className="h-16 border-t border-[rgba(255,255,255,0.05)] bg-[#111113] flex items-center gap-2 px-3">
      <input
        ref={fileRef}
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        className="hidden"
        onChange={e => {
          const f = e.target.files?.[0];
          if (f) onSelectFile(f);
          if (fileRef.current) fileRef.current.value = "";
        }}
      />
      <button
        className="h-9 w-9 rounded-full flex items-center justify-center hover:cursor-pointer hover:bg-[#7C3AED]/20 transition border border-[rgba(255,255,255,0.08)] bg-[#18181B] text-[#A1A1AA] hover:text-[#7C3AED] shrink-0"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        title="Attach file"
      >
        {uploading ? (
          <span className="inline-block h-4 w-4 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66L9.41 17.41a2 2 0 01-2.83-2.83l8.49-8.48"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
      <input
        className="flex-1 rounded-full border border-[rgba(255,255,255,0.08)] bg-[#18181B] px-4 py-2 text-[16px] outline-none text-[#E4E4E7] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/30 transition"
        placeholder={uploading ? "Uploading… (Max 5MB)" : "Type a message"}
        value={input}
        onChange={e => onInputChange(e.target.value)}
        onKeyDown={onKeyDown}
      />
      <button
        className="rounded-full hover:cursor-pointer bg-[#7C3AED] hover:bg-[#6D28D9] transition text-white px-4 py-2 text-sm shadow-[0_0_10px_rgba(124,58,237,0.25)]"
        onClick={onSend}
        disabled={uploading}
      >
        {uploading ? "Wait…" : "Send"}
      </button>
    </div>
  );
}