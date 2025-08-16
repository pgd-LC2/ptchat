import { ChevronUp } from 'lucide-react';

export default function UserProfileMenu() {
  return (
    <div className="mt-2">
      <button
        type="button"
        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-base text-black hover:bg-zinc-50"
      >
        <div className="flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-xs font-medium text-white">
            PP
          </span>
          <div className="text-left">
            <div className="text-base text-black">pgd p</div>
            <div className="text-xs text-black/60">Free</div>
          </div>
        </div>
        <ChevronUp className="h-4 w-4 text-black/60" />
      </button>
    </div>
  );
}
