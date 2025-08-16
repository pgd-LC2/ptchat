import { Plus } from 'lucide-react';

type Props = {
  className?: string;
};

export default function NewChatButton({ className }: Props) {
  return (
    <button
      type="button"
      className={`inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-2 text-sm text-black/60 hover:bg-zinc-50 transition ${className || ''}`}
    >
      <Plus className="h-4 w-4" />
      新建聊天
    </button>
  );
}
