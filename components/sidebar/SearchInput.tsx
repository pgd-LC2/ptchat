import { Search } from 'lucide-react';

export default function SearchInput() {
  return (
    <div className="px-3 py-2">
      <div className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm">
        <Search className="h-4 w-4 text-black/60" />
        <input
          type="text"
          placeholder="搜索聊天"
          className="flex-1 bg-transparent outline-none placeholder:text-black/60"
        />
      </div>
    </div>
  );
}