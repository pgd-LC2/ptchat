'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import ChatView, { ChatMessage } from '../components/chat/ChatView';

type ChatSession = {
  id: string;
  title: string;
  messages: ChatMessage[];
  lastActivity: Date;
};

export default function HomePage() {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: '1',
      title: 'GitLab SSH 错误快',
      messages: [],
      lastActivity: new Date(Date.now() - 86400000)
    },
    {
      id: '2', 
      title: '写一大段内容',
      messages: [],
      lastActivity: new Date(Date.now() - 172800000)
    },
    {
      id: '3',
      title: '神经网络输出原理', 
      messages: [],
      lastActivity: new Date(Date.now() - 259200000)
    },
  ]);
  const [currentChatId, setCurrentChatId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentMessages = currentChatId 
    ? chatSessions.find(session => session.id === currentChatId)?.messages || []
    : [];

  const filteredSessions = searchQuery
    ? chatSessions.filter(session => 
        session.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : chatSessions;

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, []);

  const handleNewChat = useCallback(() => {
    const newChat: ChatSession = {
      id: `chat_${Date.now()}`,
      title: '新对话',
      messages: [],
      lastActivity: new Date()
    };
    setChatSessions(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    setInput('');
  }, []);

  const handleChatSelect = useCallback((chatId: string) => {
    setCurrentChatId(chatId);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleAppSelect = useCallback((appName: string) => {
    console.log(`切换到应用: ${appName}`);
    // 这里可以实现不同应用的逻辑
  }, []);

  const simulateAssistantStream = useCallback((text: string, assistantId: string, chatId: string) => {
    let i = 0;
    timerRef.current && clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      i += 1;
      setChatSessions(prev => 
        prev.map(session => 
          session.id === chatId 
            ? {
                ...session,
                messages: session.messages.map(m => 
                  m.id === assistantId ? { ...m, content: text.slice(0, i) } : m
                )
              }
            : session
        )
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

      // 如果没有当前聊天，创建新的
      let targetChatId = currentChatId;
      if (!targetChatId) {
        const newChat: ChatSession = {
          id: `chat_${Date.now()}`,
          title: value.slice(0, 20) + (value.length > 20 ? '...' : ''),
          messages: [],
          lastActivity: new Date()
        };
        setChatSessions(prev => [newChat, ...prev]);
        targetChatId = newChat.id;
        setCurrentChatId(targetChatId);
      }

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

      setChatSessions(prev => 
        prev.map(session => 
          session.id === targetChatId 
            ? {
                ...session,
                messages: [...session.messages, userMsg, assistantMsg],
                lastActivity: new Date(),
                title: session.messages.length === 0 
                  ? value.slice(0, 20) + (value.length > 20 ? '...' : '')
                  : session.title
              }
            : session
        )
      );
      setInput('');
      setIsLoading(true);

      const responseText =
        `这是一个来自前端本地的模拟流式响应。你刚才说：“${value}”。` +
        '当你接入真实 LLM API 时，这里将被替换为真正的流式内容。';

      simulateAssistantStream(responseText, assistantMsg.id, targetChatId);
    },
    [input, isLoading, simulateAssistantStream, currentChatId, setChatSessions]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <>
      <Sidebar 
        chatSessions={filteredSessions}
        currentChatId={currentChatId}
        onNewChat={handleNewChat}
        onChatSelect={handleChatSelect}
        onSearch={handleSearch}
        onAppSelect={handleAppSelect}
      />
      <main className="flex-1">
        <ChatView
          messages={currentMessages}
          input={input}
          isLoading={isLoading}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
        />
      </main>
    </>
  );
}
