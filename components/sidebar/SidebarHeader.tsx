import { MoreHorizontal } from 'lucide-react';
import NewChatButton from './NewChatButton';

export default function SidebarHeader() {
  return (
    <div className="flex items-center justify-between px-3 py-3">
      {/* Logo placeholder - 旋转的圆圈图标 */}
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black">
        <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
      </div>
      
      {/* 右侧更多按钮 */}
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center rounded-md text-black/60 hover:bg-zinc-50"
        aria-label="更多选项"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
    </div>
  );
}