'use client';

import { useState, useCallback, useEffect } from 'react';
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
  const [isAnimating, setIsAnimating] = useState(false);

  // 处理动画状态
  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
    }
  }, [isVisible]);

  const handleClose = useCallback(() => {
    setIsAnimating(false);
    // 延迟关闭以允许动画完成
    setTimeout(() => {
      onClose();
    }, 150);
  }, [onClose]);

  const filteredSessions = searchQuery
    ? chatSessions.filter(session => 
        session.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : chatSessions;

  const handleChatSelect = useCallback((chatId: string) => {
    onChatSelect(chatId);
    handleClose();
  }, [onChatSelect, onClose]);

  const handleNewChat = useCallback(() => {
    onNewChat();
    handleClose();
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
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-150 ${
      isAnimating ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* 背景遮罩 */}
      <div 
        className={`absolute inset-0 bg-black/50 transition-opacity duration-150 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      
      {/* 模态框内容 */}
      <div className={`relative w-full max-w-2xl max-h-[80vh] bg-white rounded-xl shadow-xl overflow-hidden transform transition-all duration-150 ${
        isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        {/* 头部搜索区域 */}
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center gap-3 rounded-md bg-zinc-50 px-4 py-3 focus-within:bg-zinc-100 transition-all">
              <Search className="h-5 w-5 text-black/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索聊天..."
                className="flex-1 bg-transparent outline-none placeholder:text-black/60 text-base font-normal"
                autoFocus
              />
            </div>
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-black/60 hover:bg-zinc-100 transition-colors"
              onClick={handleClose}
              aria-label="关闭"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="px-4 pb-4 overflow-y-auto max-h-96">
          {/* 新建聊天按钮 */}
          <button
            type="button"
            className="inline-flex items-center gap-3 rounded-md px-3 py-3 text-base font-normal text-black hover:bg-zinc-50 transition-colors w-full mb-3"
            onClick={handleNewChat}
          >
            <PencilLine className="h-5 w-5 text-black/60" />
            新聊天
          </button>

          {/* 搜索结果 */}
          {searchQuery && filteredSessions.length === 0 && (
            <div className="text-center py-8 text-base text-black/60">
              未找到匹配的聊天记录
            </div>
          )}

          {/* 今天的聊天 */}
          {todaySessions.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-normal text-black/60 mb-2 px-1">今天</h3>
              <div className="space-y-0">
                {todaySessions.map((session) => (
                  <div key={session.id} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-50 transition-colors cursor-pointer text-base font-normal" onClick={() => handleChatSelect(session.id)}>
                    <MessageCircle className="h-4 w-4 text-black/60 flex-shrink-0" />
                    <span className="text-base font-normal text-black truncate">{session.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 昨天的聊天 */}
          {yesterdaySessions.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-normal text-black/60 mb-2 px-1">昨天</h3>
              <div className="space-y-0">
                {yesterdaySessions.map((session) => (
                  <div key={session.id} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-50 transition-colors cursor-pointer text-base font-normal" onClick={() => handleChatSelect(session.id)}>
                    <MessageCircle className="h-4 w-4 text-black/60 flex-shrink-0" />
                    <span className="text-base font-normal text-black truncate">{session.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 更早的聊天 */}
          {olderSessions.length > 0 && (
            <div>
              <h3 className="text-sm font-normal text-black/60 mb-2 px-1">更早</h3>
              <div className="space-y-0">
                {olderSessions.map((session) => (
                  <div key={session.id} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-50 transition-colors cursor-pointer text-base font-normal" onClick={() => handleChatSelect(session.id)}>
                    <MessageCircle className="h-4 w-4 text-black/60 flex-shrink-0" />
                    <span className="text-base font-normal text-black truncate">{session.title}</span>
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