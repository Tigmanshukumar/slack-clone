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
        className="rounded-full hover:cursor-pointer hover:bg-[#6D28D9] transition border border-[rgba(255,255,255,0.08)] bg-[#18181B] text-[#E4E4E7] px-3 py-2 text-sm"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        title="Attach file"
      >
        {uploading ? "Uploading…" : "Attach"}
      </button>
      <input
        className="flex-1 rounded-full border border-[rgba(255,255,255,0.08)] bg-[#18181B] px-4 py-2 text-[16px] outline-none text-[#E4E4E7] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/30 transition"
        placeholder={uploading ? "Max Limit 5MB" : "Type a message"}
        value={input}
        onChange={e => onInputChange(e.target.value)}
        onKeyDown={onKeyDown}
      
      />
      
      <button
        className="rounded-full hover:cursor-pointer   bg-[#7C3AED] hover:bg-[#6D28D9] transition text-white px-4 py-2 text-sm shadow-[0_0_10px_rgba(124,58,237,0.25)]"
        onClick={onSend}
        disabled={uploading}
      >
        {uploading ? "Please wait…" : "Send"}
      </button>
    </div>
  );
}
