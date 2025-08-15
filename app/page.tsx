'use client';

import Sidebar from '../components/sidebar/Sidebar';
import ChatView from '../components/chat/ChatView';
import { useChat } from 'ai/react';

export default function HomePage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

  return (
    <>
      <Sidebar />
      <main className="flex-1">
        <ChatView
          messages={messages}
          input={input}
          isLoading={isLoading}
          onInputChange={handleInputChange as any}
          onSubmit={handleSubmit}
        />
      </main>
    </>
  );
}
