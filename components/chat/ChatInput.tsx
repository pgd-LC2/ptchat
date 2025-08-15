import { Mic, Paperclip, Search, Send } from 'lucide-react';

type Props = {
  className?: string;
};

export default function ChatInput({ className }: Props) {
  return (
    <div
      className={`mx-auto w-full max-w-[768px] px-6 pb-6 ${className || ''}`}
    >
      <div className="flex items-center gap-2 rounded-[28px] border border-zinc-200 bg-white px-3 py-2 shadow-sm hover:border-zinc-300 focus-within:border-zinc-400">
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-50"
        >
          <Paperclip className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-50"
        >
          <Search className="h-4 w-4" />
        </button>
        <div className="flex-1 py-1 text-base text-zinc-900">
          <div className="min-h-[40px] text-zinc-400">在这里输入内容（静态占位）</div>
        </div>
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-400"
          aria-disabled="true"
        >
          <Send className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-50"
        >
          <Mic className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-2 text-center text-[12px] text-zinc-500">
        本阶段为静态 UI 预览
      </div>
    </div>
  );
}
