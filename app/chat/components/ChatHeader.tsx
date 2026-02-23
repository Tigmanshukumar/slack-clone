"use client";
import Image from "next/image";

type Props = {
  convos: any[];
  activeId: string;
  activeOther: any | null;
  onBack: () => void;
  onDeleteGroup: () => void;
};

export default function ChatHeader({
  convos,
  activeId,
  activeOther,
  onBack,
  onDeleteGroup,
}: Props) {
  const c = (convos as any[]).find(x => x._id === activeId);
  return (
    <div className="h-16 border-b border-[rgba(255,255,255,0.05)] bg-[#111113]/95 backdrop-blur-sm flex items-center justify-between px-6">
      <div className="flex items-center gap-3 min-w-0">
        <button
          className="md:hidden mr-1 text-sm px-2 py-1 border rounded border-[rgba(255,255,255,0.08)] text-[#E4E4E7]"
          onClick={onBack}
        >
          Back
        </button>
        {c?.isGroup ? (
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 rounded-md bg-[#7C3AED]/20 flex items-center justify-center text-[12px] text-[#E4E4E7]">
              {c.name?.slice(0,2)?.toUpperCase() || "GR"}
            </div>
            <div className="flex flex-col leading-tight">
              <div className="text-white font-semibold text-[15px] truncate">{c.name || "Group"}</div>
              <div className="text-xs text-[#71717A]">{c.members.length} members</div>
            </div>
          </div>
        ) : activeOther ? (
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative">
              <Image src={activeOther.imageUrl || "/vercel.svg"} width={36} height={36} alt={activeOther.name} className="rounded-full" />
              <span
                className={`absolute -right-0 -bottom-0 h-2.5 w-2.5 rounded-full border border-[#111113] ${
                  activeOther.online ? "bg-[#22C55E] animate-pulse" : "bg-zinc-500"
                }`}
              />
            </div>
            <div className="flex flex-col leading-tight">
              <div className="text-white font-semibold text-[15px] truncate">{activeOther.name}</div>
              <div className="text-xs text-[#A1A1AA] flex items-center gap-1">
                <span className={`inline-block h-2 w-2 rounded-full ${activeOther.online ? "bg-[#22C55E]" : "bg-zinc-500"}`} />
                <span>{activeOther.online ? "Online" : "Offline"}</span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <div className="flex items-center gap-1">
        <button className="p-2 rounded-lg hover:bg-white/5 transition" title="Search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#E4E4E7]">
            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        </button>
        <button className="p-2 rounded-lg hover:bg-white/5 transition hidden sm:block" title="Call">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#E4E4E7]">
            <path d="M6 2h3l2 5-2 1a11 11 0 006 6l1-2 5 2v3c0 1.1-.9 2-2 2A16 16 0 016 4c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.4" fill="none" />
          </svg>
        </button>
        <button className="p-2 rounded-lg hover:bg-white/5 transition" title="More">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#E4E4E7]">
            <circle cx="5" cy="12" r="1.8" fill="currentColor" />
            <circle cx="12" cy="12" r="1.8" fill="currentColor" />
            <circle cx="19" cy="12" r="1.8" fill="currentColor" />
          </svg>
        </button>
        {c?.isGroup ? (
          <button
            className="ml-1 text-xs px-2 py-1 rounded-lg border border-[rgba(255,255,255,0.08)] text-[#f87171] hover:bg-[#f87171]/10 transition"
            onClick={onDeleteGroup}
          >
            Delete group
          </button>
        ) : null}
      </div>
    </div>
  );
}
