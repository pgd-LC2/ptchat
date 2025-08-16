'use client';


type MessageProps = {
  role: 'user' | 'assistant';
  content: string;
};

export default function ChatMessage({ role, content }: MessageProps) {
  const isAssistant = role === 'assistant';
  return (
    <div
      className={`rounded-2xl border p-3 w-fit ${
        isAssistant ? 'bg-zinc-50 border-zinc-200 mr-auto' : 'bg-white border-zinc-200 ml-auto'
      }`}
    >
      <div className="whitespace-pre-wrap text-zinc-900 text-base">{content}</div>
    </div>
  );
}

export function UserMessage({ content }: { content: string }) {
  return <ChatMessage role="user" content={content} />;
}

export function AssistantMessage({ content }: { content: string }) {
  return <ChatMessage role="assistant" content={content} />;
}
