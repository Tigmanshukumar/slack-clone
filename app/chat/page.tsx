"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Sidebar from "./components/Sidebar";
import ChatHeader from "./components/ChatHeader";
import MessagesPane from "./components/MessagesPane";
import Composer from "./components/Composer";
import GroupCreatorModal from "./components/GroupCreatorModal";

type ConvexId = string;

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-[#0F0F10] text-[#E4E4E7]">
      <SignedOut>
        <div className="flex h-screen items-center justify-center text-[#A1A1AA]">
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
  const [showGroupCreator, setShowGroupCreator] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});
  const [groupError, setGroupError] = useState<string>("");

  const syncUser = useMutation(api.users.syncUser);
  const setOnlineStatus = useMutation(api.users.setOnlineStatus);
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

  useEffect(() => {
    if (!clerkId) return;
    setOnlineStatus({ clerkId, online: true });
    const goOffline = () => {
      setOnlineStatus({ clerkId, online: false });
    };
    window.addEventListener("pagehide", goOffline);
    window.addEventListener("beforeunload", goOffline);
    return () => {
      window.removeEventListener("pagehide", goOffline);
      window.removeEventListener("beforeunload", goOffline);
      setOnlineStatus({ clerkId, online: false });
    };
  }, [clerkId, setOnlineStatus]);

  useEffect(() => {
    if (!clerkId) return;
    const interval = setInterval(() => {
      setOnlineStatus({ clerkId, online: true });
    }, 10000);
    return () => clearInterval(interval);
  }, [clerkId, setOnlineStatus]);

  const usersRaw = useQuery(api.users.getUsers, myUserId ? { currentClerkId: clerkId } : "skip");
  const convosRaw = useQuery(api.conversations.getUserConversations, myUserId ? { userId: myUserId as any } : "skip");
  const messagesRaw = useQuery(api.messages.getMessages, activeId ? { conversationId: activeId as any } : "skip");
  const unreadCounts = useQuery(api.messages.getUnreadCounts, myUserId ? { userId: myUserId as any } : "skip") || [];
  const users = usersRaw || [];
  const convos = convosRaw || [];
  const messages = messagesRaw || [];
  const usersLoading = usersRaw === undefined && !!myUserId;
  const convosLoading = convosRaw === undefined && !!myUserId;
  const messagesLoading = messagesRaw === undefined && !!activeId;
  const [typingTick, setTypingTick] = useState<number>(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setTypingTick(Date.now()), 2000);
    return () => clearInterval(id);
  }, []);
  const typingUserIds = useQuery(
    // @ts-ignore - generated types update at dev time
    (api as any).typing?.getTyping || api.typing.getTyping,
    activeId && myUserId ? { conversationId: activeId as any, excludeUserId: myUserId as any, now: typingTick } : "skip"
  ) || [];
  const reactions = useQuery(
    // @ts-ignore
    ((api as any).reactions?.getReactionsForConversation || (api as any).reactions?.getReactionsForConversation) as any,
    activeId ? { conversationId: activeId as any } : "skip"
  ) || [];

  const createOrGetConversation = useMutation(api.conversations.createOrGetConversation);
  const sendMessageMutation = useMutation(api.messages.sendMessage);
  const markConversationRead = useMutation(api.messages.markConversationRead);
  // @ts-ignore - generated types update at dev time
  const setTypingMutation = useMutation(((api as any).typing?.setTyping || api.typing.setTyping) as any);
  const deleteMessageMutation = useMutation(api.messages.deleteMessage);
  // @ts-ignore
  const createGroupConversation = useMutation((api as any).conversations?.createGroupConversation || (api as any).conversations?.createGroupConversation);
  // @ts-ignore
  const toggleReaction = useMutation(((api as any).reactions?.toggleReaction || (api as any).reactions?.toggleReaction) as any);
  // @ts-ignore
  const deleteGroupConversation = useMutation((api as any).conversations?.deleteGroupConversation || (api as any).conversations?.deleteGroupConversation);

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
  const openWith = async (other: any) => {
    if (!myUserId) return;
    const id = await createOrGetConversation({
      userAId: myUserId as any,
      userBId: other._id,
    });
    setActiveId(id as unknown as string);
    await markConversationRead({ conversationId: id as any, userId: myUserId as any });
  };

  const [outbox, setOutbox] = useState<{ id: string; content: string; status: "sending" | "error"; conversationId: string }[]>([]);
  const send = async () => {
    const text = input.trim();
    if (!text || !activeId || !myUserId) return;
    setInput("");
    const tempId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setOutbox(prev => [...prev, { id: tempId, content: text, status: "sending", conversationId: activeId }]);
    try {
      await sendMessageMutation({
        conversationId: activeId as any,
        senderId: myUserId as any,
        content: text,
      });
      setOutbox(prev => prev.filter(o => o.id !== tempId));
      await markConversationRead({ conversationId: activeId as any, userId: myUserId as any });
    } catch (e) {
      setOutbox(prev => prev.map(o => (o.id === tempId ? { ...o, status: "error" } : o)));
    }
  };

  const lastTypingSent = useRef<number>(0);

  useEffect(() => {
    if (!activeId || !myUserId) return;
    markConversationRead({ conversationId: activeId as any, userId: myUserId as any });
  }, [activeId, messages, myUserId, markConversationRead]);

  const activeOther = useMemo(() => {
    if (!activeId || !myUserId) return null;
    const c = (convos as any[]).find(x => x._id === activeId);
    if (!c) return null;
    if (c.isGroup) return null;
    const otherId = c.members.find((m: string) => m !== myUserId);
    return (users as any[]).find(u => u._id === otherId) || null;
  }, [activeId, convos, myUserId, users]);

  const EMOJIS = ["👍", "❤️", "😂", "😮", "😢"];
  const reactionsByMessage = useMemo(() => {
    const map: Record<
      string,
      { counts: Record<string, number>; mine: Set<string> }
    > = {};
    (reactions as any[]).forEach(r => {
      const msgId = r.messageId;
      if (!map[msgId]) map[msgId] = { counts: {}, mine: new Set() };
      map[msgId].counts[r.emoji] = (map[msgId].counts[r.emoji] || 0) + 1;
      if (r.userId === myUserId) map[msgId].mine.add(r.emoji);
    });
    return map;
  }, [reactions, myUserId]);

  return (
    <div className="flex h-screen">
      <Sidebar
        search={search}
        setSearch={setSearch}
        users={users as any[]}
        usersLoading={usersLoading}
        convos={convos as any[]}
        convosLoading={convosLoading}
        unreadCounts={unreadCounts as any[]}
        activeId={activeId}
        myUserId={myUserId}
        onOpenWith={openWith}
        onSelectConversation={id => setActiveId(id)}
        onClickNewGroup={() => setShowGroupCreator(true)}
      />
      <div className={`${activeId ? "flex" : "hidden md:flex"} flex-1 flex-col`}>
        {!activeId ? (
          <div className="flex h-full items-center justify-center text-[#A1A1AA]">
            <div>Select a user to start chatting</div>
          </div>
        ) : (
          <>
            <ChatHeader
              convos={convos as any[]}
              activeId={activeId}
              activeOther={activeOther}
              onBack={() => setActiveId(null)}
              onDeleteGroup={async () => {
                if (!myUserId || !activeId) return;
                const ok = window.confirm("Delete this group for all members? This cannot be undone.");
                if (!ok) return;
                // @ts-ignore
                await deleteGroupConversation({ conversationId: activeId as any, requesterId: myUserId as any });
                setActiveId(null);
              }}
            />
            <MessagesPane
              conversationId={activeId}
              listRef={listRef}
              messages={messages as any[]}
              messagesLoading={messagesLoading}
              myUserId={myUserId}
              reactionsByMessage={reactionsByMessage}
              EMOJIS={EMOJIS}
              onDeleteMessage={(id: string) => {
                if (!myUserId) return;
                deleteMessageMutation({ messageId: id as any, userId: myUserId as any });
              }}
              onToggleReaction={(messageId: string, emoji: string) => {
                if (!myUserId) return;
                toggleReaction({ messageId: messageId as any, userId: myUserId as any, emoji });
              }}
              outbox={outbox}
              onRetryOutbox={async (o) => {
                if (!myUserId || !activeId) return;
                setOutbox(prev => prev.map(x => (x.id === o.id ? { ...x, status: "sending" } : x)));
                try {
                  await sendMessageMutation({
                    conversationId: activeId as any,
                    senderId: myUserId as any,
                    content: o.content,
                  });
                  setOutbox(prev => prev.filter(x => x.id !== o.id));
                  await markConversationRead({ conversationId: activeId as any, userId: myUserId as any });
                } catch {
                  setOutbox(prev => prev.map(x => (x.id === o.id ? { ...x, status: "error" } : x)));
                }
              }}
              typingUserIds={typingUserIds as any[]}
              activeOther={activeOther}
              showNewBtn={showNewBtn}
              onClickNewMessages={() => {
                const el = listRef.current;
                if (el) el.scrollTop = el.scrollHeight;
                setAutoStick(true);
                setShowNewBtn(false);
              }}
            />
            <Composer
              input={input}
              onInputChange={(v: string) => {
                setInput(v);
                const now = Date.now();
                if (activeId && myUserId && now - lastTypingSent.current > 900) {
                  lastTypingSent.current = now;
                  setTypingMutation({ conversationId: activeId as any, userId: myUserId as any });
                }
              }}
              onSend={send}
            />
          </>
        )}
      </div>
      <GroupCreatorModal
        open={showGroupCreator}
        onClose={() => setShowGroupCreator(false)}
        users={users as any[]}
        groupName={groupName}
        setGroupName={(v: string) => {
          setGroupName(v);
          setGroupError("");
        }}
        groupError={groupError}
        selectedIds={selectedIds}
        setSelectedIds={fn => {
          setSelectedIds(prev => fn(prev));
          setGroupError("");
        }}
        onCreate={async () => {
          if (!myUserId) return;
          const chosen = Object.keys(selectedIds).filter(id => selectedIds[id]);
          const allMembers = Array.from(new Set([myUserId, ...chosen]));
          if (groupName.trim().length === 0) {
            setGroupError("Please enter a group name.");
            return;
          }
          if (allMembers.length < 2) {
            setGroupError("Pick at least one other member.");
            return;
          }
          // @ts-ignore
          const id = await createGroupConversation({ name: groupName.trim(), memberIds: allMembers as any });
          setShowGroupCreator(false);
          setGroupName("");
          setSelectedIds({});
          setActiveId(id as any);
        }}
        canCreate={groupName.trim().length > 0}
      />
    </div>
  );
}
