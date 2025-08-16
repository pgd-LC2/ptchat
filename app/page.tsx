'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Sidebar from '@/components/sidebar/Sidebar';
import ChatView, { ChatMessage } from '@/components/chat/ChatView';

export default function HomePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, []);

  const simulateAssistantStream = useCallback((text: string, assistantId: string) => {
    let i = 0;
    timerRef.current && clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      i += 1;
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, content: text.slice(0, i) } : m))
      );
      if (i >= text.length) {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsLoading(false);
      }
    }, 20);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const value = input.trim();
      if (!value || isLoading) return;

      const userMsg: ChatMessage = {
        id: `u_${Date.now()}`,
        role: 'user',
        content: value,
      };
      const assistantMsg: ChatMessage = {
        id: `a_${Date.now()}`,
        role: 'assistant',
        content: '',
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setInput('');
      setIsLoading(true);

      const responseText =
        `这是一个来自前端本地的模拟流式响应。你刚才说：“${value}”。` +
        '当你接入真实 LLM API 时，这里将被替换为真正的流式内容。';

      simulateAssistantStream(responseText, assistantMsg.id);
    },
    [input, isLoading, simulateAssistantStream]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <>
      <Sidebar />
      <main className="flex-1">
        <ChatView
          messages={messages}
          input={input}
          isLoading={isLoading}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
        />
      </main>
    </>
  );
}
