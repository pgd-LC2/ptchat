import { MoreHorizontal } from 'lucide-react';
import NewChatButton from './NewChatButton';

export default function SidebarHeader() {
  return (
    <div className="flex items-center justify-between px-3 py-3">
      {/* 右侧更多按钮 */}
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center rounded-md text-black/60 hover:bg-zinc-50 ml-auto"
        aria-label="更多选项"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
    </div>
  );
}