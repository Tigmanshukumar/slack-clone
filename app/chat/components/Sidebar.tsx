"use client";
import Image from "next/image";
import { formatTimestamp } from "@/lib/date";

type Props = {
  search: string;
  setSearch: (v: string) => void;
  users: any[];
  usersLoading: boolean;
  convos: any[];
  convosLoading: boolean;
  unreadCounts: any[];
  activeId: string | null;
  myUserId: string | null;
  onOpenWith: (u: any) => void;
  onSelectConversation: (id: string) => void;
  onClickNewGroup: () => void;
};

export default function Sidebar({
  search,
  setSearch,
  users,
  usersLoading,
  convos,
  convosLoading,
  unreadCounts,
  activeId,
  myUserId,
  onOpenWith,
  onSelectConversation,
  onClickNewGroup,
}: Props) {
  const filtered =
    search.trim().length === 0
      ? users
      : users.filter((u: any) =>
          (u.name || "").toLowerCase().includes(search.trim().toLowerCase())
        );
  return (
    <div className={`${activeId ? "hidden md:block" : "block"} w-full md:w-80 border-r border-[rgba(255,255,255,0.05)] bg-[#111113]`}>
      <div className="p-4">
        <input
          className="w-full rounded-full border border-[rgba(255,255,255,0.08)] bg-[#18181B] px-3 py-2 text-[15px] outline-none text-[#E4E4E7] focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/30 transition"
          placeholder="Search users"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button
          className="mt-3 w-full rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] transition text-white px-3 py-2 text-sm"
          onClick={onClickNewGroup}
        >
         + New group
        </button>
      </div>
      <div className="px-4 pb-2 text-xs uppercase text-[#A1A1AA]">Users</div>
      <div className="overflow-y-auto max-h-[35vh] md:max-h-[40vh]">
        {usersLoading ? (
          <div className="px-4 py-2 space-y-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-8 rounded-lg bg-[#18181B] animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-4 py-6 text-sm text-[#71717A]">No matching users</div>
        ) : (
          filtered.map((u: any) => (
            <button
              key={u._id}
              className="flex w-full items-center gap-3 px-4 py-2 hover:bg-white/5"
              onClick={() => onOpenWith(u)}
            >
              <div className="relative">
                <Image src={u.imageUrl || "/vercel.svg"} width={28} height={28} alt={u.name} className="rounded-full" />
                <span
                  className={`absolute -right-0 -bottom-0 h-2.5 w-2.5 rounded-full border border-[#0F0F10] ${
                    u.online ? "bg-[#22C55E]" : "bg-zinc-500"
                  }`}
                />
              </div>
              <div className="text-sm font-medium text-white">{u.name}</div>
            </button>
          ))
        )}
      </div>
      <div className="px-4 pt-4 pb-2 text-xs uppercase text-[#A1A1AA]">Conversations</div>
      <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 260px)" }}>
        {convosLoading ? (
          <div className="px-4 py-2 space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 rounded-lg bg-[#18181B] animate-pulse" />
            ))}
          </div>
        ) : convos.length === 0 ? (
          <div className="px-4 py-6 text-sm text-[#71717A]">No conversations yet</div>
        ) : (
          (convos as any[]).map(c => {
            const otherId = !c.isGroup ? c.members.find((m: string) => m !== myUserId) : null;
            const other = otherId ? (users as any[]).find((u: any) => u._id === otherId) : null;
            const active = c._id === activeId;
            const unread = (unreadCounts as any[]).find((r: any) => r.conversationId === c._id)?.count || 0;
            return (
              <button
                key={c._id}
                className={`flex w-full items-center gap-3 px-4 py-3 ${active ? "bg-[rgba(124,58,237,0.15)] border-l-4 border-l-[#7C3AED]" : "hover:bg-white/5"}`}
                onClick={() => onSelectConversation(c._id)}
              >
                <div className="relative">
                  {!c.isGroup ? (
                    <>
                      <Image src={other?.imageUrl || "/vercel.svg"} width={28} height={28} alt={other?.name || "User"} className="rounded-full" />
                      <span
                        className={`absolute -right-0 -bottom-0 h-2.5 w-2.5 rounded-full border border-[#111113] ${
                          other?.online ? "bg-[#22C55E]" : "bg-zinc-500"
                        }`}
                      />
                    </>
                  ) : (
                    <div className="h-7 w-7 rounded-md bg-[#7C3AED]/20 flex items-center justify-center text-[10px] text-[#E4E4E7]">
                      {c.name?.slice(0,2)?.toUpperCase() || "GR"}
                    </div>
                  )}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <div className={`text-sm ${active ? "font-semibold" : "font-medium"} text-white`}>
                      {c.isGroup ? (c.name || "Group") : (other?.name || "User")}
                    </div>
                    <div className="flex items-center gap-2">
                      {unread > 0 && (
                        <span className="inline-flex min-w-5 h-5 items-center justify-center rounded-full bg-[#7C3AED] text-white text-[11px] px-1">
                          {unread}
                        </span>
                      )}
                      <div className="text-xs text-[#71717A]">
                        {formatTimestamp(new Date(c.updatedAt))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-[#A1A1AA] truncate max-w-[160px]">
                      {c.isGroup ? `${c.members.length} members` : (c.lastMessage || "No messages yet")}
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
