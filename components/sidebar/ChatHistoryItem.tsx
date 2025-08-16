type Props = {
  title: string;
  active?: boolean;
  onClick?: () => void;
};

export default function ChatHistoryItem({ title, active, onClick }: Props) {
  return (
    <button
      type="button"
      className={`w-full group flex h-10 items-center truncate rounded-lg px-3 py-2 text-base font-normal text-left transition-colors ${active ? 'bg-zinc-100 text-black' : 'text-black/60 hover:bg-zinc-50'}`}
      onClick={onClick}
    >
      <span className="truncate">{title}</span>
    </button>
  );
}
