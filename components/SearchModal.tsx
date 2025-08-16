'use client';

import { useState, useCallback } from 'react';
import { Search, X, MessageCircle, PencilLine } from 'lucide-react';
import ChatHistoryItem from './sidebar/ChatHistoryItem';

type ChatSession = {
  id: string;
  title: string;
  messages: any[];
  lastActivity: Date;
};

type Props = {
  isVisible: boolean;
  onClose: () => void;
  chatSessions: ChatSession[];
  currentChatId: string;
  onNewChat: () => void;
  onChatSelect: (chatId: string) => void;
};

export default function SearchModal({ 
  isVisible, 
  onClose, 
  chatSessions, 
  currentChatId, 
  onNewChat, 
  onChatSelect 
}: Props) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSessions = searchQuery
    ? chatSessions.filter(session => 
        session.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : chatSessions;

  const handleChatSelect = useCallback((chatId: string) => {
    onChatSelect(chatId);
    onClose();
  }, [onChatSelect, onClose]);

  const handleNewChat = useCallback(() => {
    onNewChat();
    onClose();
  }, [onNewChat, onClose]);

  // 按时间分组聊天会话
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);

  const todaySessions = filteredSessions.filter(session => 
    session.lastActivity >= today
  );
  
  const yesterdaySessions = filteredSessions.filter(session => 
    session.lastActivity >= yesterday && session.lastActivity < today
  );
  
  const olderSessions = filteredSessions.filter(session => 
    session.lastActivity < yesterday
  );

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* 模态框内容 */}
      <div className="relative w-full max-w-2xl max-h-[80vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* 头部搜索区域 */}
        <div className="p-6 border-b border-zinc-200">
          <div className="flex items-center gap-4">
            <div className="flex-1 flex items-center gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3">
              <Search className="h-5 w-5 text-black/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索聊天..."
                className="flex-1 bg-transparent outline-none placeholder:text-black/60 text-base"
                autoFocus
              />
            </div>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-black/60 hover:bg-zinc-100"
              onClick={onClose}
              aria-label="关闭"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="p-6 overflow-y-auto max-h-96">
          {/* 新建聊天按钮 */}
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-black hover:bg-zinc-50 transition w-full mb-4"
            onClick={handleNewChat}
          >
            <PencilLine className="h-4 w-4 text-black/60" />
            新聊天
          </button>

          {/* 搜索结果 */}
          {searchQuery && filteredSessions.length === 0 && (
            <div className="text-center py-8 text-black/60">
              未找到匹配的聊天记录
            </div>
          )}

          {/* 今天的聊天 */}
          {todaySessions.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-medium text-black/60 mb-3">今天</h3>
              <div className="space-y-1">
                {todaySessions.map((session) => (
                  <div key={session.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-zinc-50">
                    <MessageCircle className="h-4 w-4 text-black/60 flex-shrink-0" />
                    <ChatHistoryItem
                      title={session.title}
                      active={session.id === currentChatId}
                      onClick={() => handleChatSelect(session.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 昨天的聊天 */}
          {yesterdaySessions.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-medium text-black/60 mb-3">昨天</h3>
              <div className="space-y-1">
                {yesterdaySessions.map((session) => (
                  <div key={session.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-zinc-50">
                    <MessageCircle className="h-4 w-4 text-black/60 flex-shrink-0" />
                    <ChatHistoryItem
                      title={session.title}
                      active={session.id === currentChatId}
                      onClick={() => handleChatSelect(session.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 更早的聊天 */}
          {olderSessions.length > 0 && (
            <div>
              <h3 className="text-xs font-medium text-black/60 mb-3">更早</h3>
              <div className="space-y-1">
                {olderSessions.map((session) => (
                  <div key={session.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-zinc-50">
                    <MessageCircle className="h-4 w-4 text-black/60 flex-shrink-0" />
                    <ChatHistoryItem
                      title={session.title}
                      active={session.id === currentChatId}
                      onClick={() => handleChatSelect(session.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}