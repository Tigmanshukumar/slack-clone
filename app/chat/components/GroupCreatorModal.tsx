"use client";

type Props = {
  open: boolean;
  onClose: () => void;
  users: any[];
  groupName: string;
  setGroupName: (v: string) => void;
  groupError: string;
  selectedIds: Record<string, boolean>;
  setSelectedIds: (fn: (prev: Record<string, boolean>) => Record<string, boolean>) => void;
  onCreate: () => void;
  canCreate: boolean;
};

export default function GroupCreatorModal({
  open,
  onClose,
  users,
  groupName,
  setGroupName,
  groupError,
  selectedIds,
  setSelectedIds,
  onCreate,
  canCreate,
}: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="w-full max-w-md rounded-2xl border border-[rgba(255,255,255,0.05)] bg-[#111113] p-4">
        <div className="text-sm font-semibold mb-2">Create group</div>
        <input
          className="w-full rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#18181B] px-3 py-2 text-[14px] outline-none text-[#E4E4E7] focus:border-[#7C3AED] mb-3"
          placeholder="Group name"
          value={groupName}
          onChange={e => setGroupName(e.target.value)}
        />
        {groupError && <div className="mb-2 text-[12px] text-[#f87171]">{groupError}</div>}
        <div className="max-h-64 overflow-y-auto space-y-1 mb-3">
          {(users as any[]).map(u => (
            <label key={u._id} className="flex items-center gap-2 text-sm px-2 py-1 rounded hover:bg-white/5">
              <input
                type="checkbox"
                checked={!!selectedIds[u._id]}
                onChange={e => {
                  setSelectedIds(prev => ({ ...prev, [u._id]: e.target.checked }));
                }}
              />
              <span>{u.name}</span>
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <button className="px-3 py-2 text-sm rounded-full border border-[rgba(255,255,255,0.08)]" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-3 py-2 text-sm rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onCreate}
            disabled={!canCreate}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
