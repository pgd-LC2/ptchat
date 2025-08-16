'use client';

import WelcomeScreen from './WelcomeScreen';
import { AssistantMessage, UserMessage } from './ChatMessage';
import ChatInput from './ChatInput';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

type Props = {
  messages: ChatMessage[];
  input: string;
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function ChatView({ messages, input, isLoading, onInputChange, onSubmit }: Props) {
  const hasMessages = messages.length > 0;
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[768px] px-6 py-6 space-y-4">
          {!hasMessages && <WelcomeScreen />}
          {messages.map((m) =>
            m.role === 'user' ? (
              <UserMessage key={m.id} content={m.content} />
            ) : (
              <AssistantMessage key={m.id} content={m.content} />
            )
          )}
        </div>
      </div>
      <div className="sticky bottom-0 border-t border-zinc-200 bg-[#F7F7F8]/80 backdrop-blur supports-[backdrop-filter]:bg-[#F7F7F8]/60">
        <div className="mx-auto w-full max-w-[600px] px-4">
          <ChatInput value={input} disabled={isLoading} onChange={onInputChange} onSubmit={onSubmit} />
        </div>
      </div>
    </div>
  );
}
