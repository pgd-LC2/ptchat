type Props = {
  title: string;
  active?: boolean;
};

export default function ChatHistoryItem({ title, active }: Props) {
  return (
    <a
      href="#"
      className={`group flex h-8 items-center truncate rounded-md px-3 text-sm font-medium ${active ? 'bg-zinc-100 text-black' : 'text-black/60 hover:bg-zinc-50'}`}
    >
      <span className="truncate">{title}</span>
    </a>
  );
}
