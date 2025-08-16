import { ChevronUp, User2 } from 'lucide-react';

export default function UserProfileMenu() {
  return (
    <div className="mt-2">
      <button
        type="button"
        className="flex w-full items-center justify-between rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-black/60 hover:bg-zinc-50"
      >
        <span className="flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-zinc-200">
            <User2 className="h-4 w-4 text-black/60" />
          </span>
          我的账户
        </span>
        <ChevronUp className="h-4 w-4 text-black/60" />
      </button>
    </div>
  );
}
