'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { sendChatMessage } from '../lib/api';
import Sidebar from '../components/sidebar/Sidebar';
import ChatView, { ChatMessage } from '../components/chat/ChatView';
import SearchModal from '../components/SearchModal';

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
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const currentMessages = currentChatId 
    ? chatSessions.find(session => session.id === currentChatId)?.messages || []
    : [];


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

  const handleOpenSearchModal = useCallback(() => {
    setIsSearchModalVisible(true);
  }, []);

  const handleCloseSearchModal = useCallback(() => {
    setIsSearchModalVisible(false);
  }, []);

  const handleAppSelect = useCallback((appName: string) => {
    console.log(`切换到应用: ${appName}`);
    // 这里可以实现不同应用的逻辑
  }, []);

  const handleStreamResponse = useCallback((assistantId: string, chatId: string) => {
    return (chunk: string) => {
      setChatSessions(prev => 
        prev.map(session => 
          session.id === chatId 
            ? {
                ...session,
                messages: session.messages.map(m => 
                  m.id === assistantId ? { ...m, content: chunk } : m
                )
              }
            : session
        )
      );
    };
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

      // 获取当前会话的所有消息
      const currentSession = chatSessions.find(session => session.id === targetChatId);
      const allMessages = currentSession ? [...currentSession.messages, userMsg] : [userMsg];

      // 调用模拟 API（无实际AI功能）
      sendChatMessage(allMessages, handleStreamResponse(assistantMsg.id, targetChatId))
        .finally(() => {
          setIsLoading(false);
        });
    },
    [input, isLoading, handleStreamResponse, currentChatId, setChatSessions, chatSessions]
  );

  return (
    <>
      <Sidebar 
        chatSessions={chatSessions}
        currentChatId={currentChatId}
        onNewChat={handleNewChat}
        onChatSelect={handleChatSelect}
        onOpenSearchModal={handleOpenSearchModal}
        onAppSelect={handleAppSelect}
      />
      <SearchModal
        isVisible={isSearchModalVisible}
        onClose={handleCloseSearchModal}
        chatSessions={chatSessions}
        currentChatId={currentChatId}
        onNewChat={handleNewChat}
        onChatSelect={handleChatSelect}
      />
      <main className="fixed left-[260px] right-0 top-0 bottom-0 overflow-hidden">
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
