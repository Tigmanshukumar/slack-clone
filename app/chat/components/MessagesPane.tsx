"use client";
import { RefObject } from "react";
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
  outbox: Outbox[];
  onRetryOutbox: (o: Outbox) => void;
  typingUserIds: any[];
  activeOther: any | null;
  showNewBtn: boolean;
  onClickNewMessages: () => void;
};

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
  outbox,
  onRetryOutbox,
  typingUserIds,
  activeOther,
  showNewBtn,
  onClickNewMessages,
}: Props) {
  return (
    <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-2 bg-[#0F0F10]">
      {messagesLoading ? (
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
              <div className="h-12 w-48 max-w-[70%] rounded-xl bg-[#18181B] animate-pulse" />
            </div>
          ))}
        </div>
      ) : messages.length === 0 ? (
        <div className="flex h-full items-center justify-center text-[#71717A]">No messages yet</div>
      ) : (
        (messages as any[]).map(m => {
          const mine = myUserId && m.senderId === myUserId;
          return (
            <div key={m._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] rounded-xl px-3 py-2 text-[15px] ${
                m.deleted
                  ? "bg-[#1F1F23] text-[#A1A1AA]"
                  : mine
                  ? "bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] text-white shadow-[0_0_10px_rgba(124,58,237,0.25)]"
                  : "bg-[#18181B] text-[#E4E4E7] shadow-sm shadow-black/20"
              }`}>
                <div className={`font-normal ${m.deleted ? "italic" : ""}`}>
                  {m.deleted ? "This message was deleted" : m.content}
                </div>
                <div className={`mt-1 flex items-center justify-end gap-2 text-[11px] text-gray-300 font-normal`}>
                  <span>{formatTimestamp(new Date(m.createdAt))}</span>
                  {mine && !m.deleted && (
                    <button
                      className="text-[11px] underline-offset-2 hover:underline text-red-500"
                      onClick={() => onDeleteMessage(m._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
                {!m.deleted && (
                  <>
                    <div className="mt-1 flex flex-wrap items-center gap-1">
                      {EMOJIS.map(e => {
                        const info = reactionsByMessage[m._id] || { counts: {}, mine: new Set() };
                        const count = info.counts[e] || 0;
                        const mineReacted = info.mine.has(e);
                        return (
                          <button
                            key={`${m._id}-${e}`}
                            className={`text-[12px] px-2 py-0.5 rounded-full border ${
                              mineReacted ? "border-[#7C3AED] bg-[#7C3AED]/10" : "border-[rgba(255,255,255,0.08)]"
                            }`}
                            onClick={() => onToggleReaction(m._id, e)}
                            title={mineReacted ? "Remove reaction" : "Add reaction"}
                          >
                            <span>{e}</span>
                            {count > 0 && <span className="ml-1 text-[11px]">{count}</span>}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })
      )}
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
