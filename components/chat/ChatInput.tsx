'use client';


import { Mic, Paperclip, Search } from 'lucide-react';

// 自定义向上箭头图标
function ArrowUpIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M8.99992 16V6.41407L5.70696 9.70704C5.31643 10.0976 4.68342 10.0976 4.29289 9.70704C3.90237 9.31652 3.90237 8.6835 4.29289 8.29298L9.29289 3.29298L9.36907 3.22462C9.76184 2.90427 10.3408 2.92686 10.707 3.29298L15.707 8.29298L15.7753 8.36915C16.0957 8.76192 16.0731 9.34092 15.707 9.70704C15.3408 10.0732 14.7618 10.0958 14.3691 9.7754L14.2929 9.70704L10.9999 6.41407V16C10.9999 16.5523 10.5522 17 9.99992 17C9.44764 17 8.99992 16.5523 8.99992 16Z"
        fill="currentColor"
      />
    </svg>
  );
}

type Props = {
  className?: string;
  value: string;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function ChatInput({ className, value, disabled, onChange, onSubmit }: Props) {
  return (
    <div className={`w-full pb-3 max-w-[800px] mx-auto px-6 ${className || ''}`}>
      <form
        className="flex items-center gap-2 rounded-full overflow-hidden border border-zinc-200 bg-white px-4 py-3 shadow-sm hover:border-zinc-300 focus-within:border-zinc-400 min-h-[52px]"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(e);
        }}
      >
        <button
          type="button"
          className="inline-flex h-12 w-12 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-50"
          aria-label="附件"
        >
          <Paperclip className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="inline-flex h-12 w-12 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-50"
          aria-label="搜索"
        >
          <Search className="h-5 w-5" />
        </button>
        <div className="flex-1 flex items-center text-base text-zinc-900">
          <textarea
            name="input"
            value={value}
            onChange={onChange}
            placeholder="输入消息..."
            rows={1}
            onInput={(e) => {
              const ta = e.currentTarget;
              ta.style.height = 'auto';
              ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const form = e.currentTarget.form;
                if (form && value.trim().length > 0 && !disabled) {
                  form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
                }
              }
            }}
            className="w-full resize-none bg-transparent outline-none placeholder:text-zinc-400 leading-6 py-1"
          />
        </div>
        <button
          type="button"
          className="inline-flex h-12 w-12 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-50"
          aria-label="语音"
        >
          <Mic className="h-5 w-5" />
        </button>
        <button
          type="submit"
          disabled={disabled || value.trim().length === 0}
          className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${
          className={`inline-flex h-12 w-12 items-center justify-center rounded-full ${
            disabled
              ? 'bg-[#E5F3FF] text-[#0285FF]'
              : value.trim().length === 0 
              ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
              : 'bg-[#0285FF] text-white hover:bg-[#0264CC]'
          }`}
          aria-label="发送"
        >
          <ArrowUpIcon className="h-5 w-5" />
        </button>
      </form>
      <div className="mt-1 text-center text-[12px] text-zinc-500">
        按 Enter 发送，Shift+Enter 换行
      </div>
    </div>
  );
}
