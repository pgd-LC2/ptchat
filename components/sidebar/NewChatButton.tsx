import { PencilLine } from 'lucide-react';

type Props = {
  className?: string;
  onClick?: () => void;
};

export default function NewChatButton({ className, onClick }: Props) {
  return (
    <button
      type="button"
      className={`inline-flex items-center gap-3 rounded-lg px-3 py-3 text-base font-normal text-black hover:bg-zinc-50 transition-colors w-full ${className || ''}`}
      onClick={onClick}
    >
      <PencilLine className="h-4 w-4 text-black/60" />
      新建聊天
    </button>
  );
}
