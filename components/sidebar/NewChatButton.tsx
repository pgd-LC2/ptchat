import { PencilLine } from 'lucide-react';

type Props = {
  className?: string;
  onClick?: () => void;
};

export default function NewChatButton({ className, onClick }: Props) {
  return (
    <button
      type="button"
      className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-black hover:bg-zinc-50 transition w-full ${className || ''}`}
      onClick={onClick}
    >
      <PencilLine className="h-4 w-4 text-black/60" />
      <span className="font-semibold">新建聊天</span>
    </button>
  );
}
