'use client';

import { MAX_SELECTION } from '@/lib/categories';

export default function SelectionBar({
  count,
  onClear,
  onDownload,
  onDelete,
  isAdmin,
  busy
}: {
  count: number;
  onClear: () => void;
  onDownload: () => void;
  onDelete?: () => void;
  isAdmin: boolean;
  busy?: boolean;
}) {
  if (count === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
      <div className="glass flex items-center gap-3 rounded-full border border-edge px-4 py-2.5 shadow-glow shadow-[0_4px_0_rgba(0,0,0,0.5),0_8px_20px_rgba(0,0,0,0.5)]">
        <span className="font-mono text-sm text-ink">
          {count} / {MAX_SELECTION} selected
        </span>
        <button
          onClick={onClear}
          className="rounded-full px-3 py-1.5 text-sm text-muted transition-colors hover:text-ink"
        >
          Clear
        </button>
        {isAdmin && onDelete && (
          <button
            onClick={onDelete}
            disabled={busy}
            className="rounded-full bg-red-500/15 px-3 py-1.5 text-sm font-medium text-red-400 shadow-[0_2px_0_rgba(0,0,0,0.4)] transition-all active:translate-y-[1px] active:shadow-none hover:bg-red-500/25 disabled:opacity-50"
          >
            Delete selected
          </button>
        )}
        <button
          onClick={onDownload}
          disabled={busy}
          className="rounded-full bg-sakura px-4 py-1.5 text-sm font-medium text-void shadow-[0_2px_0_rgba(0,0,0,0.4)] transition-all hover:scale-[1.03] active:translate-y-[1px] active:shadow-none disabled:opacity-50"
        >
          {busy ? 'Preparing…' : 'Download selected'}
        </button>
      </div>
    </div>
  );
}
