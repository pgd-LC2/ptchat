import { MessageSquare } from 'lucide-react';

type Props = {
  title: string;
  active?: boolean;
};

export default function ChatHistoryItem({ title, active }: Props) {
  return (
    <a
      href="#"
      className={`group flex h-10 items-center gap-2 truncate rounded-md px-3 text-sm ${active ? 'bg-zinc-100 text-black' : 'text-black/60 hover:bg-zinc-50'}`}
    >
      <MessageSquare className="h-4 w-4 text-black/60 group-hover:text-black/60" />
      <span className="truncate">{title}</span>
    </a>
  );
}
