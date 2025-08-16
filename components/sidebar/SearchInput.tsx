import { useState } from 'react';
import { Search } from 'lucide-react';

type Props = {
  onSearch?: (query: string) => void;
};

export default function SearchInput({ onSearch }: Props) {
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch?.(value);
  };

  return (
    <div className="px-3 py-2">
      <div className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm">
        <Search className="h-4 w-4 text-black/60" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="搜索聊天"
          className="flex-1 bg-transparent outline-none placeholder:text-black/60 font-semibold"
        />
      </div>
    </div>
  );
}