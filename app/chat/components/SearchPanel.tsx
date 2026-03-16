"use client";
import { useState, useEffect, useRef } from "react";
import { formatTimestamp } from "@/lib/date";

type Message = {
  _id: string;
  content: string;
  senderId: string;
  createdAt: number;
  deleted?: boolean;
  fileId?: string;
  fileName?: string;
  fileType?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  messages: Message[];
  myUserId: string | null;
  onScrollToMessage: (id: string) => void;
};

// Highlight matching substring in text
function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <span>{text}</span>;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-[#7C3AED]/40 text-white rounded px-0.5">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

export default function SearchPanel({ open, onClose, messages, myUserId, onScrollToMessage }: Props) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when panel opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const trimmed = query.trim().toLowerCase();

  const results = trimmed.length < 1
    ? []
    : messages.filter(m => {
        if (m.deleted) return false;
        // Match text messages
        if (!m.fileId && m.content?.toLowerCase().includes(trimmed)) return true;
        // Match file names
        if (m.fileId && m.fileName?.toLowerCase().includes(trimmed)) return true;
        return false;
      });

  return (
    <>
      {/* Backdrop — clicking outside closes panel */}
      {open && (
        <div
          className="fixed inset-0 z-30"
          onClick={onClose}
        />
      )}

      {/* Slide-in panel */}
      <div className={`
        fixed top-0 right-0 h-full z-40
        w-full sm:w-[360px]
        bg-[#111113] border-l border-[rgba(255,255,255,0.06)]
        shadow-2xl flex flex-col
        transition-transform duration-200 ease-in-out
        ${open ? "translate-x-0" : "translate-x-full"}
      `}>

        {/* ── Header ── */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-[rgba(255,255,255,0.06)]">
          <svg className="shrink-0 text-[#71717A]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search messages…"
            className="flex-1 bg-transparent text-[#E4E4E7] text-[14px] outline-none placeholder:text-[#52525B]"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-[#71717A] hover:text-[#E4E4E7] transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-1 text-[#71717A] hover:text-[#E4E4E7] transition-colors"
            title="Close search"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* ── Results count ── */}
        {trimmed.length > 0 && (
          <div className="px-4 py-2 text-[11px] text-[#52525B] border-b border-[rgba(255,255,255,0.04)]">
            {results.length === 0
              ? "No results"
              : `${results.length} result${results.length !== 1 ? "s" : ""}`}
          </div>
        )}

        {/* ── Results list ── */}
        <div className="flex-1 overflow-y-auto">
          {trimmed.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-[#52525B]">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span className="text-[13px]">Type to search messages</span>
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-[#52525B]">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span className="text-[13px]">No messages match "{query}"</span>
            </div>
          ) : (
            <div className="divide-y divide-[rgba(255,255,255,0.04)]">
              {results.map(m => {
                const mine = m.senderId === myUserId;
                const isFile = !!m.fileId;
                const displayText = isFile ? (m.fileName || "File") : m.content;

                return (
                  <button
                    key={m._id}
                    onClick={() => { onScrollToMessage(m._id); onClose(); }}
                    className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors group"
                  >
                    {/* sender label */}
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[11px] font-medium ${mine ? "text-[#A78BFA]" : "text-[#71717A]"}`}>
                        {mine ? "You" : "Them"}
                      </span>
                      <span className="text-[10px] text-[#3F3F46]">
                        {formatTimestamp(new Date(m.createdAt))}
                      </span>
                    </div>

                    {/* message preview */}
                    <div className="flex items-start gap-2">
                      {isFile && (
                        <span className="mt-0.5 shrink-0 text-[#71717A]">
                          {m.fileType === "image" ? (
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                              <polyline points="21 15 16 10 5 21"/>
                            </svg>
                          ) : (
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                              <polyline points="14 2 14 8 20 8"/>
                            </svg>
                          )}
                        </span>
                      )}
                      <p className="text-[13px] text-[#A1A1AA] line-clamp-2 leading-relaxed group-hover:text-[#E4E4E7] transition-colors">
                        <Highlight text={displayText} query={query} />
                      </p>
                    </div>

                    {/* jump to arrow hint */}
                    <div className="mt-1.5 flex items-center gap-1 text-[10px] text-[#3F3F46] group-hover:text-[#7C3AED] transition-colors">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                      Jump to message
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}