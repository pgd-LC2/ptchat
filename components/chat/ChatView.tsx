'use client';

import WelcomeScreen from './WelcomeScreen';
import { AssistantMessage, UserMessage } from './ChatMessage';
import ChatInput from './ChatInput';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

type SelectedFunction = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
} | null;

type Props = {
  messages: ChatMessage[];
  input: string;
  isLoading: boolean;
  selectedFunction: SelectedFunction;
  setSelectedFunction: (func: SelectedFunction) => void;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function ChatView({ messages, input, isLoading, selectedFunction, setSelectedFunction, onInputChange, onSubmit }: Props) {
  const hasMessages = messages.length > 0;
  return (
    <div className="flex min-h-screen flex-col">
      {hasMessages ? (
        <>
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-[900px] px-8 py-6 space-y-4">
              {messages.map((m) =>
                m.role === 'user' ? (
                  <UserMessage key={m.id} content={m.content} />
                ) : (
                  <AssistantMessage key={m.id} content={m.content} />
                )
              )}
            </div>
          </div>
          <div className="sticky bottom-0 bg-[#F7F7F8]/80 backdrop-blur supports-[backdrop-filter]:bg-[#F7F7F8]/60">
            <ChatInput 
              value={input} 
              disabled={isLoading} 
              selectedFunction={selectedFunction}
              setSelectedFunction={setSelectedFunction}
              onChange={onInputChange} 
              onSubmit={onSubmit} 
            />
          </div>
        </>
      ) : (
        <WelcomeScreen
          input={input}
          isLoading={isLoading}
          selectedFunction={selectedFunction}
          setSelectedFunction={setSelectedFunction}
          onInputChange={onInputChange}
          onSubmit={onSubmit}
          className="flex-1"
        />
      )}
    </div>
  );
}
