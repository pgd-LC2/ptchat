'use client';


type MessageProps = {
  role: 'user' | 'assistant';
  content: string;
};

function LoadingDot() {
  return (
    <div className="w-3 h-3 bg-black/40 rounded-full animate-pulse"></div>
  );
}

export default function ChatMessage({ role, content }: MessageProps) {
  const isAssistant = role === 'assistant';
  return (
    <div
      className={`rounded-full border px-4 h-12 w-fit flex items-center animate-fadeIn ${
        isAssistant ? 'bg-zinc-50 border-zinc-200 mr-auto' : 'bg-[#E5F3FF] border-zinc-200 ml-auto'
      }`}
    >
      <div className="whitespace-pre-wrap text-black text-base font-normal">{content}</div>
    </div>
  );
}

export function UserMessage({ content }: { content: string }) {
  return <ChatMessage role="user" content={content} />;
}

export function AssistantMessage({ content }: { content: string }) {
  // 如果内容为空，显示加载动画
  if (!content) {
    return (
      <div className="mr-auto">
        <LoadingDot />
      </div>
    );
  }

  return (
    <div className="whitespace-pre-wrap text-black text-base font-normal mr-auto animate-fadeIn">
      {content}
    </div>
  );
}
