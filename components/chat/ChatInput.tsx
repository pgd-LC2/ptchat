'use client';


import { Mic, Paperclip, Search, Send } from 'lucide-react';

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
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-50"
          aria-label="附件"
        >
          <Paperclip className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-50"
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
          type="submit"
          disabled={disabled || value.trim().length === 0}
          className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${
            value.trim().length === 0 
              ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
              : disabled
              ? 'bg-[#E5F3FF] text-[#0285FF]'
              : 'bg-[#0285FF] text-white hover:bg-[#0264CC]'
          }`}
          aria-label="发送"
        >
          <Send className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-50"
          aria-label="语音"
        >
          <Mic className="h-5 w-5" />
        </button>
      </form>
      <div className="mt-1 text-center text-[12px] text-zinc-500">
        按 Enter 发送，Shift+Enter 换行
      </div>
    </div>
  );
}
