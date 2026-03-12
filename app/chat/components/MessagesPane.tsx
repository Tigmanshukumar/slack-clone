"use client";
import { RefObject, useState, useRef, useEffect, MutableRefObject } from "react";
import { formatTimestamp } from "@/lib/date";

type Outbox = { id: string; content: string; status: "sending" | "error"; conversationId: string };

type Props = {
  conversationId: string;
  listRef: RefObject<HTMLDivElement>;
  messages: any[];
  messagesLoading: boolean;
  myUserId: string | null;
  reactionsByMessage: Record<string, { counts: Record<string, number>; mine: Set<string> }>;
  EMOJIS: string[];
  onDeleteMessage: (id: string) => void;
  onToggleReaction: (messageId: string, emoji: string) => void;
  onEditMessage: (messageId: string, newContent: string) => void;
  // ── Pin props ──
  pinnedMessageIds: string[];
  onPinMessage: (id: string) => void;
  onUnpinMessage: (id: string) => void;
  messageRefs?: MutableRefObject<Record<string, HTMLDivElement | null>>;
  outbox: Outbox[];
  onRetryOutbox: (o: Outbox) => void;
  typingUserIds: any[];
  activeOther: any | null;
  showNewBtn: boolean;
  onClickNewMessages: () => void;
};

// ── Blob download helper ──
async function downloadFile(url: string, fileName: string) {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  } catch {
    window.open(url, "_blank");
  }
}

// ── Download icon ──
function DownloadIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

// ── Pin icon ──
function PinIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="17" x2="12" y2="22" />
      <path d="M5 17h14v-1.76a2 2 0 00-1.11-1.79l-1.78-.9A2 2 0 0115 10.76V6h1a2 2 0 000-4H8a2 2 0 000 4h1v4.76a2 2 0 01-1.11 1.79l-1.78.9A2 2 0 005 15.24V17z" />
    </svg>
  );
}

// ── Editable message textarea ──
function EditableMessage({
  initialContent,
  onSave,
  onCancel,
}: {
  messageId: string;
  initialContent: string;
  onSave: (newContent: string) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState(initialContent);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const len = value.length;
    inputRef.current?.setSelectionRange(len, len);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) onSave(value.trim());
    }
    if (e.key === "Escape") onCancel();
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <textarea
        ref={inputRef}
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={2}
        className="w-full resize-none rounded-lg bg-[#27272A] border border-[#7C3AED]/60 text-[#E4E4E7] text-[14px] px-3 py-2 outline-none focus:border-[#7C3AED]"
      />
      <div className="flex items-center gap-2 text-[11px]">
        <button
          onClick={() => { if (value.trim()) onSave(value.trim()); }}
          className="px-2 py-0.5 rounded bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-colors"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="px-2 py-0.5 rounded bg-[#27272A] text-[#A1A1AA] hover:text-[#E4E4E7] transition-colors"
        >
          Cancel
        </button>
        <span className="text-[#52525B]">Enter to save · Esc to cancel</span>
      </div>
    </div>
  );
}

// ── Main component ──
export default function MessagesPane({
  conversationId,
  listRef,
  messages,
  messagesLoading,
  myUserId,
  reactionsByMessage,
  EMOJIS,
  onDeleteMessage,
  onToggleReaction,
  onEditMessage,
  pinnedMessageIds,
  onPinMessage,
  onUnpinMessage,
    messageRefs = { current: {} },
  outbox,
  onRetryOutbox,
  typingUserIds,
  activeOther,
  showNewBtn,
  onClickNewMessages,
}: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = async (messageId: string, url: string, fileName: string) => {
    setDownloadingId(messageId);
    await downloadFile(url, fileName);
    setDownloadingId(null);
  };

  return (
    <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-2 bg-[#0F0F10]">

      {/* ── Loading skeleton ── */}
      {messagesLoading ? (
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
              <div className="h-12 w-48 max-w-[70%] rounded-xl bg-[#18181B] animate-pulse" />
            </div>
          ))}
        </div>

      ) : messages.length === 0 ? (
        <div className="flex h-full items-center justify-center text-[#71717A]">
          No messages yet
        </div>

      ) : (
        (messages as any[]).map(m => {
          const mine = !!(myUserId && m.senderId === myUserId);
          const isEditing = editingId === m._id;
          const canEdit = mine && !m.deleted && !m.fileId;
          const isDownloading = downloadingId === m._id;
          const isPinned = (pinnedMessageIds ?? []).includes(m._id);

          const info = reactionsByMessage[m._id] || { counts: {}, mine: new Set() };
          const hasReactions = Object.values(info.counts).some(c => (c as number) > 0);

          return (
            // ── Attach ref for scroll-to ──
            <div
              key={m._id}
ref={(el: HTMLDivElement | null) => { if (messageRefs?.current) messageRefs.current[m._id] = el; }}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              {/* ── Pinned left border indicator ── */}
              <div className={`group relative max-w-[70%] ${isPinned ? "border-l-2 border-l-[#7C3AED] pl-1.5 rounded-l-sm" : ""}`}>

                {/* ── Floating emoji picker ── */}
                {!m.deleted && !isEditing && (
                  <div className={`
                    absolute -top-10 z-20
                    ${mine ? "right-0" : "left-0"}
                    flex items-center gap-0.5 px-1.5 py-1
                    rounded-full bg-[#1C1C1F] border border-[rgba(255,255,255,0.08)] shadow-lg
                    opacity-0 scale-95 pointer-events-none
                    group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto
                    transition-all duration-150
                  `}>
                    {EMOJIS.map(e => {
                      const mineReacted = info.mine.has(e);
                      return (
                        <button
                          key={`${m._id}-${e}-picker`}
                          className={`text-[18px] w-8 h-8 flex items-center justify-center rounded-full transition-all duration-100 hover:scale-125 hover:bg-[rgba(255,255,255,0.08)] ${
                            mineReacted ? "scale-110 bg-[#7C3AED]/20" : ""
                          }`}
                          onClick={() => onToggleReaction(m._id, e)}
                          title={mineReacted ? `Remove ${e}` : `React with ${e}`}
                        >
                          {e}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* ── Message bubble ── */}
                <div className={`relative rounded-xl px-3 py-2 text-[15px] ${
                  m.deleted
                    ? "bg-[#1F1F23] text-[#A1A1AA]"
                    : mine
                    ? "bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] text-white shadow-[0_0_10px_rgba(124,58,237,0.25)]"
                    : "bg-[#18181B] text-[#E4E4E7] shadow-sm shadow-black/20"
                }`}>

                  {/* ── Pin badge — top-right corner of bubble ── */}
                  {isPinned && !m.deleted && (
                    <span className="absolute -top-1.5 -right-1.5 bg-[#7C3AED] text-white rounded-full p-0.5 leading-none text-[9px]">
                      📌
                    </span>
                  )}

                  {/* ── File content ── */}
                  {m.fileId ? (
                    <div className="font-normal">
                      {m.fileType === "image" ? (
                        <div className="overflow-hidden rounded-lg border border-[rgba(255,255,255,0.08)]">
                          {m.fileUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={m.fileUrl}
                              alt={m.fileName || "image"}
                              className="max-w-[220px] max-h-[220px] object-cover block"
                            />
                          ) : (
                            <div className="h-24 w-48 bg-[#27272A] animate-pulse rounded-lg" />
                          )}
                          <button
                            onClick={() => handleDownload(m._id, m.fileUrl, m.fileName || "image")}
                            disabled={isDownloading || !m.fileUrl}
                            className="flex w-full items-center justify-center gap-1.5 bg-[#18181B]/80 py-1.5 text-xs text-[#A1A1AA] hover:text-white hover:cursor-pointer hover:bg-[#27272A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isDownloading ? (
                              <>
                                <span className="inline-block h-3 w-3 border-2 border-[#A1A1AA] border-t-transparent rounded-full animate-spin" />
                                <span>Downloading…</span>
                              </>
                            ) : (
                              <>
                                <DownloadIcon />
                                <span>Download</span>
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-3 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#18181B]/60 px-3 py-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span><img src="/pdf-file.png" className="w-6 h-6" alt="" /></span>
                            <span className="text-sm truncate max-w-[140px]">{m.fileName || "File"}</span>
                          </div>
                          <button
                            onClick={() => handleDownload(m._id, m.fileUrl, m.fileName || "file")}
                            disabled={isDownloading || !m.fileUrl}
                            className="shrink-0 flex items-center gap-1 text-xs text-[#A1A1AA] hover:text-white hover:cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isDownloading ? (
                              <span className="inline-block h-3 w-3 border-2 border-[#A78BFA] border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <DownloadIcon />
                            )}
                            <span>{isDownloading ? "…" : "Download"}</span>
                          </button>
                        </div>
                      )}
                    </div>

                  ) : isEditing ? (
                    <EditableMessage
                      messageId={m._id}
                      initialContent={m.content}
                      onSave={(newContent) => {
                        onEditMessage(m._id, newContent);
                        setEditingId(null);
                      }}
                      onCancel={() => setEditingId(null)}
                    />

                  ) : (
                    <div className={`font-normal ${m.deleted ? "italic" : ""}`}>
                      {m.deleted ? "This message was deleted" : m.content}
                    </div>
                  )}

                  {/* ── Timestamp + Edit / Delete / Pin ── */}
                  {!isEditing && (
                    <div className="mt-1 flex items-center justify-end gap-2 text-[11px] text-gray-300 font-normal">
                      {m.edited && !m.deleted && (
                        <span className="text-[#71717A] italic">edited</span>
                      )}
                      <span>{formatTimestamp(new Date(m.createdAt))}</span>

                      {/* Pin / Unpin — shown on hover for ALL messages */}
                      {!m.deleted && (
                        <button
                          className={`
                            opacity-0 group-hover:opacity-100 transition-opacity
                            flex items-center gap-0.5 underline-offset-2 hover:underline
                            ${isPinned ? "text-[#7C3AED]" : "text-[#71717A] hover:text-[#A78BFA]"}
                          `}
                          onClick={() => isPinned ? onUnpinMessage(m._id) : onPinMessage(m._id)}
                          title={isPinned ? "Unpin message" : "Pin message"}
                        >
                          <PinIcon filled={isPinned} />
                          <span>{isPinned ? "Unpin" : "Pin"}</span>
                        </button>
                      )}

                      {/* Edit / Delete — only for own messages */}
                      {mine && !m.deleted && (
                        <>
                          {canEdit && (
                            <button
                              className="underline-offset-2 hover:underline text-[#A78BFA]"
                              onClick={() => setEditingId(m._id)}
                            >
                              Edit
                            </button>
                          )}
                          <button
                            className="underline-offset-2 hover:underline text-red-500"
                            onClick={() => onDeleteMessage(m._id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>{/* end bubble */}

                {/* ── Reaction counts — outside bubble ── */}
                {!m.deleted && !isEditing && hasReactions && (
                  <div className={`mt-1 flex flex-wrap items-center gap-1 ${mine ? "justify-end" : "justify-start"}`}>
                    {EMOJIS.filter(e => (info.counts[e] || 0) > 0).map(e => {
                      const count = info.counts[e] || 0;
                      const mineReacted = info.mine.has(e);
                      return (
                        <button
                          key={`${m._id}-${e}-count`}
                          className={`text-[12px] px-2 py-0.5 rounded-full border transition-colors ${
                            mineReacted
                              ? "border-[#7C3AED] bg-[#7C3AED]/20 text-white"
                              : "border-[rgba(255,255,255,0.12)] bg-[#18181B] text-[#E4E4E7] hover:border-[#7C3AED]/50"
                          }`}
                          onClick={() => onToggleReaction(m._id, e)}
                          title={mineReacted ? "Remove reaction" : "Add reaction"}
                        >
                          {e}
                          <span className="ml-1 text-[11px] font-medium">{count}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

              </div>{/* end group */}
            </div>
          );
        })
      )}

      {/* ── Optimistic outbox ── */}
      {outbox.length > 0 &&
        outbox.filter(o => o.conversationId === conversationId).map(o => (
          <div key={o.id} className="flex justify-end">
            <div className="max-w-[70%] rounded-xl px-3 py-2 text-[15px] bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] text-white shadow-[0_0_10px_rgba(124,58,237,0.25)]">
              <div className="font-normal">{o.content}</div>
              <div className="mt-1 flex items-center justify-end gap-2 text-[11px] text-gray-300 font-normal">
                {o.status === "sending" ? (
                  <>
                    <span className="inline-block h-3 w-3 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                    <span>Sending…</span>
                  </>
                ) : (
                  <>
                    <span className="text-[#f87171]">Failed to send</span>
                    <button
                      className="underline underline-offset-2 hover:text-white"
                      onClick={() => onRetryOutbox(o)}
                    >
                      Retry
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

      {/* ── Typing indicator ── */}
      {Array.isArray(typingUserIds) && typingUserIds.length > 0 && activeOther && (
        <div className="flex items-center gap-2 pl-2 pt-2 text-xs text-[#71717A]">
          <span>{activeOther.name} is typing</span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#A1A1AA] animate-bounce" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#A1A1AA] animate-bounce [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#A1A1AA] animate-bounce [animation-delay:300ms]" />
          </span>
        </div>
      )}

      {/* ── New messages button ── */}
      {showNewBtn && (
        <button
          className="fixed bottom-20 right-6 rounded-full bg-[#18181B] border border-[rgba(255,255,255,0.08)] text-[#E4E4E7] px-3 py-2 text-xs shadow"
          onClick={onClickNewMessages}
        >
          ↓ New messages
        </button>
      )}

    </div>
  );
}