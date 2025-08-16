import SidebarHeader from './SidebarHeader';
import NewChatButton from './NewChatButton';
import SearchInput from './SearchInput';
import AppItem from './AppItem';
import ChatHistoryItem from './ChatHistoryItem';
import UserProfileMenu from '../header/UserProfileMenu';
import { PlayCircle, Zap, Sparkles, Book } from 'lucide-react';

type ChatSession = {
  id: string;
  title: string;
  messages: any[];
  lastActivity: Date;
};

type Props = {
  chatSessions: ChatSession[];
  currentChatId: string;
  onNewChat: () => void;
  onChatSelect: (chatId: string) => void;
  onSearch: (query: string) => void;
  onAppSelect: (appName: string) => void;
};

export default function Sidebar({ 
  chatSessions, 
  currentChatId, 
  onNewChat, 
  onChatSelect, 
  onSearch, 
  onAppSelect 
}: Props) {
  return (
    <aside className="flex h-screen w-[260px] flex-col border-r border-zinc-200 bg-white">
      {/* Header with logo and more button */}
      <SidebarHeader />
      
      {/* New Chat Button */}
      <div className="px-3 py-1">
        <NewChatButton onClick={onNewChat} />
      </div>
      
      {/* Search Input */}
      <SearchInput onSearch={onSearch} />
      
      {/* Library button */}
      <div className="px-3 py-1">
        <AppItem 
          icon={<Book className="h-4 w-4" />} 
          label="库" 
          onClick={() => onAppSelect('库')}
        />
      </div>
      
      {/* App Items */}
      <div className="px-3 py-2 space-y-1">
        <AppItem 
          icon={<PlayCircle className="h-4 w-4" />} 
          label="Sora" 
          onClick={() => onAppSelect('Sora')}
        />
        <AppItem 
          icon={<Zap className="h-4 w-4" />} 
          label="GPT" 
          onClick={() => onAppSelect('GPT')}
        />
        <AppItem 
          icon={<Sparkles className="h-4 w-4" />} 
          label="Bolt Prompter" 
          onClick={() => onAppSelect('Bolt Prompter')}
        />
      </div>
      
      {/* Chat History Section */}
      <div className="px-3 py-2">
        <h3 className="text-xs font-medium text-black/60 mb-2">聊天</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto px-3 space-y-1">
      <div className="flex-1 overflow-y-auto px-3 space-y-2">
        {chatSessions.map((session) => (
          <ChatHistoryItem 
            key={session.id}
            title={session.title} 
            active={session.id === currentChatId}
            onClick={() => onChatSelect(session.id)}
          />
        ))}
      </div>
      
      {/* 分割线 */}
      <div className="mx-3 border-t border-zinc-200"></div>
      
      <div className="px-3 py-3">
        <UserProfileMenu />
      </div>
    </aside>
  );
}
  )
}