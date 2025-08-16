import { Search } from 'lucide-react';

type Props = {
  onClick?: () => void;
};

export default function SearchButton({ onClick }: Props) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-base text-black hover:bg-zinc-50 transition-colors"
      onClick={onClick}
    >
      <Search className="h-4 w-4 text-black/60" />
      <span>搜索聊天</span>
    </button>
  );
}