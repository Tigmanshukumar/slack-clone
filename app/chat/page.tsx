"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { formatTimestamp } from "@/lib/date";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

type ConvexId = string;

export default function ChatPage() {
  return (
    <div className="min-h-screen">
      <SignedOut>
        <div className="flex h-screen items-center justify-center text-zinc-600">
          <div>Please sign in to use chat.</div>
        </div>
      </SignedOut>
      <SignedIn>
        <ChatApp />
      </SignedIn>
    </div>
  );
}

function ChatApp() {
  const { user } = useUser();
  const clerkId = user?.id || "";
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const [autoStick, setAutoStick] = useState(true);
  const [showNewBtn, setShowNewBtn] = useState(false);

  const syncUser = useMutation(api.users.syncUser);
  const [myUserId, setMyUserId] = useState<ConvexId | null>(null);
  useEffect(() => {
    if (!clerkId) return;
    syncUser({
      clerkId,
      name:
        [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
        user?.username ||
        user?.emailAddresses?.[0]?.emailAddress ||
        "User",
      imageUrl: user?.imageUrl || "",
    }).then(id => setMyUserId(id as unknown as string));
  }, [clerkId, syncUser, user]);

  const users = useQuery(api.users.getUsers, myUserId ? { currentClerkId: clerkId } : "skip") || [];
  const convos = useQuery(api.conversations.getUserConversations, myUserId ? { userId: myUserId as any } : "skip") || [];
  const messages = useQuery(api.messages.getMessages, activeId ? { conversationId: activeId as any } : "skip") || [];

  const createOrGetConversation = useMutation(api.conversations.createOrGetConversation);
  const sendMessageMutation = useMutation(api.messages.sendMessage);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const onScroll = () => {
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 16;
      if (atBottom) {
        setAutoStick(true);
        setShowNewBtn(false);
      } else {
        setAutoStick(false);
      }
    };
    el.addEventListener("scroll", onScroll, { passive: true } as any);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    if (autoStick) {
      el.scrollTop = el.scrollHeight;
    } else {
      setShowNewBtn(true);
    }
  }, [messages, autoStick]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u: any) => u.name.toLowerCase().includes(q));
  }, [users, search]);

  const openWith = async (other: any) => {
    if (!myUserId) return;
    const id = await createOrGetConversation({
      userAId: myUserId as any,
      userBId: other._id,
    });
    setActiveId(id as unknown as string);
  };

  const send = async () => {
    const text = input.trim();
    if (!text || !activeId || !myUserId) return;
    setInput("");
    await sendMessageMutation({
      conversationId: activeId as any,
      senderId: myUserId as any,
      content: text,
    });
  };

  const activeOther = useMemo(() => {
    if (!activeId || !myUserId) return null;
    const c = (convos as any[]).find(x => x._id === activeId);
    if (!c) return null;
    const otherId = c.members.find((m: string) => m !== myUserId);
    return (users as any[]).find(u => u._id === otherId) || null;
  }, [activeId, convos, myUserId, users]);

  return (
    <div className="flex h-screen">
      <div className={`${activeId ? "hidden md:block" : "block"} w-full md:w-80 border-r border-zinc-200 dark:border-zinc-800`}>
        <div className="p-4">
          <input
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-[15px] outline-none"
            placeholder="Search users"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="px-4 pb-2 text-xs uppercase text-zinc-500">Users</div>
        <div className="overflow-y-auto max-h-[35vh] md:max-h-[40vh]">
          {filtered.length === 0 ? (
            <div className="px-4 py-6 text-sm text-zinc-500">No matching users</div>
          ) : (
            filtered.map((u: any) => (
              <button
                key={u._id}
                className="flex w-full items-center gap-3 px-4 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                onClick={() => openWith(u)}
              >
                <Image src={u.imageUrl || "/vercel.svg"} width={28} height={28} alt={u.name} className="rounded-full" />
                <div className="text-sm font-medium">{u.name}</div>
              </button>
            ))
          )}
        </div>
        <div className="px-4 pt-4 pb-2 text-xs uppercase text-zinc-500">Conversations</div>
        <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 260px)" }}>
          {convos.length === 0 ? (
            <div className="px-4 py-6 text-sm text-zinc-500">No conversations yet</div>
          ) : (
            (convos as any[]).map(c => {
              const otherId = c.members.find((m: string) => m !== myUserId);
              const other = (users as any[]).find(u => u._id === otherId);
              const active = c._id === activeId;
              return (
                <button
                  key={c._id}
                  className={`flex w-full items-center gap-3 px-4 py-3 ${active ? "bg-zinc-100 dark:bg-zinc-900" : "hover:bg-zinc-50 dark:hover:bg-zinc-900/50"}`}
                  onClick={() => setActiveId(c._id)}
                >
                  <Image src={other?.imageUrl || "/vercel.svg"} width={28} height={28} alt={other?.name || "User"} className="rounded-full" />
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <div className={`text-sm ${active ? "font-semibold" : "font-medium"}`}>{other?.name || "User"}</div>
                      <div className="text-xs text-white-500">
                        {formatTimestamp(new Date(c.updatedAt))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-zinc-500 truncate max-w-[160px]">
                        {c.lastMessage || "No messages yet"}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
      <div className={`${activeId ? "flex" : "hidden md:flex"} flex-1 flex-col`}>
        {!activeId ? (
          <div className="flex h-full items-center justify-center text-zinc-500">
            <div>Select a user to start chatting</div>
          </div>
        ) : (
          <>
            <div className="h-14 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-4 gap-3">
              <button
                className="md:hidden mr-2 text-sm px-2 py-1 border rounded"
                onClick={() => setActiveId(null)}
              >
                Back
              </button>
              {activeOther && (
                <>
                  <Image src={activeOther.imageUrl || "/vercel.svg"} width={28} height={28} alt={activeOther.name} className="rounded-full" />
                  <div className="text-sm font-semibold tracking-[0.01em]">{activeOther.name}</div>
                </>
              )}
            </div>
            <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-2 bg-white dark:bg-black">
              {messages.length === 0 ? (
                <div className="flex h-full items-center justify-center text-zinc-500">No messages yet</div>
              ) : (
                (messages as any[]).map(m => {
                  const mine = myUserId && m.senderId === myUserId;
                  return (
                    <div key={m._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] rounded-2xl px-3 py-2 text-[15px] ${mine ? "bg-[#6c47ff] text-white" : "bg-zinc-100 dark:bg-zinc-900"}`}>
                        <div className="font-normal">{m.content}</div>
                        <div className={`mt-1 text-[11px] ${mine ? "text-white/80" : "text-zinc-500"} font-normal text-right`}>
                          {formatTimestamp(new Date(m.createdAt))}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              {showNewBtn && (
                <button
                  className="fixed bottom-20 right-6 rounded-full bg-zinc-900 text-white px-3 py-2 text-xs shadow"
                  onClick={() => {
                    const el = listRef.current;
                    if (el) el.scrollTop = el.scrollHeight;
                    setAutoStick(true);
                    setShowNewBtn(false);
                  }}
                >
                  ↓ New messages
                </button>
              )}
            </div>
            <div className="h-16 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-2 px-3">
              <input
                className="flex-1 rounded-full border border-zinc-300 dark:border-zinc-700 bg-transparent px-4 py-2 text-[16px] outline-none"
                placeholder="Type a message"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") send();
                }}
              />
              <button
                className="rounded-full bg-[#6c47ff] text-white px-4 py-2 text-sm"
                onClick={send}
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
