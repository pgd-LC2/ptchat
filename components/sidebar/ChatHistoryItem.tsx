type Props = {
  title: string;
  active?: boolean;
  onClick?: () => void;
};

export default function ChatHistoryItem({ title, active, onClick }: Props) {
  return (
    <button
      type="button"
      className={`group flex h-8 items-center truncate rounded-md px-3 text-sm font-medium ${active ? 'bg-zinc-100 text-black' : 'text-black/60 hover:bg-zinc-50'}`}
      onClick={onClick}
    >
      <span className="truncate">{title}</span>
    </button>
  );
}
