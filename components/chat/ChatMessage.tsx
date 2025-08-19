'use client';


type MessageProps = {
  role: 'user' | 'assistant';
  content: string;
  isError?: boolean;
};

function LoadingDot() {
  return (
    <div className="w-3 h-3 bg-black/40 rounded-full animate-pulse"></div>
  );
}

export default function ChatMessage({ role, content, isError }: MessageProps) {
  const isAssistant = role === 'assistant';
  
  // 如果是错误消息，调整样式
  const getMessageStyles = () => {
    if (isError) {
      return 'bg-red-50 border-red-200 text-red-800';
    }
    return isAssistant ? 'bg-zinc-50 border-zinc-200' : 'bg-[#E5F3FF] border-zinc-200';
  };
  
  return (
    <div
      className={`rounded-full border px-4 h-12 w-fit flex items-center animate-fadeIn ${getMessageStyles()} ${
        isAssistant ? 'mr-auto' : 'ml-auto'
      }`}
    >
      <div className={`whitespace-pre-wrap text-base font-normal ${
        isError ? 'text-red-800' : 'text-black'
      }`}>
        {isError && '⚠️ '}
        {content}
      </div>
    </div>
  );
}

export function UserMessage({ content }: { content: string }) {
  return <ChatMessage role="user" content={content} />;
}

export function AssistantMessage({ content, isError }: { content: string; isError?: boolean }) {
  // 如果内容为空，显示加载动画
  if (!content) {
    return (
      <div className="mr-auto">
        <LoadingDot />
      </div>
    );
  }

  return (
    <div className={`whitespace-pre-wrap text-base font-normal mr-auto animate-fadeIn ${isError ? 'text-red-800' : 'text-black'}`}>
      {isError && '⚠️ '}
      {content}
    </div>
  );
}
