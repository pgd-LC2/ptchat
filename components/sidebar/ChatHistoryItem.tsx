import { MessageSquare } from 'lucide-react';

type Props = {
  title: string;
  active?: boolean;
};

export default function ChatHistoryItem({ title, active }: Props) {
  return (
    <a
      href="#"
      className={`group flex h-10 items-center gap-2 truncate rounded-md px-3 text-sm ${active ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-700 hover:bg-zinc-50'}`}
    >
      <MessageSquare className="h-4 w-4 text-zinc-500 group-hover:text-zinc-600" />
      <span className="truncate">{title}</span>
    </a>
  );
}
