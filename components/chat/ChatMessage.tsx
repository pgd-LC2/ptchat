'use client';


type MessageProps = {
  role: 'user' | 'assistant';
  content: string;
};

function LoadingDots() {
  return (
    <div className="flex items-center space-x-1">
      <div className="w-2 h-2 bg-black/40 rounded-full animate-pulse"></div>
      <div className="w-2 h-2 bg-black/40 rounded-full animate-pulse [animation-delay:0.2s]"></div>
      <div className="w-2 h-2 bg-black/40 rounded-full animate-pulse [animation-delay:0.4s]"></div>
    </div>
  );
}

export default function ChatMessage({ role, content }: MessageProps) {
  const isAssistant = role === 'assistant';
  return (
    <div
      className={`rounded-full border px-4 h-12 w-fit flex items-center ${
        isAssistant ? 'bg-zinc-50 border-zinc-200 mr-auto' : 'bg-[#E5F3FF] border-zinc-200 ml-auto'
      }`}
    >
      <div className="whitespace-pre-wrap text-black text-base">{content}</div>
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
        <LoadingDots />
      </div>
    );
  }

  return (
    <div className="whitespace-pre-wrap text-black text-base mr-auto">
      {content}
    </div>
  );
}
