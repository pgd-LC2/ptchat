import SidebarHeader from './SidebarHeader';
import NewChatButton from './NewChatButton';
import SearchButton from './SearchButton';
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
  onOpenSearchModal: () => void;
  onAppSelect: (appName: string) => void;
};

export default function Sidebar({ 
  chatSessions, 
  currentChatId, 
  onNewChat, 
  onChatSelect, 
  onOpenSearchModal,
  onAppSelect 
}: Props) {
  return (
    <aside className="flex h-screen w-[260px] flex-col border-r border-zinc-200 bg-white">
      {/* Header with logo and more button */}
      <SidebarHeader />
      
      {/* New Chat Button */}
      <div className="px-2">
        <NewChatButton onClick={onNewChat} />
      </div>
      
      {/* Search Input */}
      <div className="px-2">
        <SearchButton onClick={onOpenSearchModal} />
      </div>
      
      {/* Library button */}
      <div className="px-2">
        <AppItem 
          icon={<Book className="h-4 w-4" />} 
          label="库" 
          onClick={() => onAppSelect('库')}
        />
      </div>
      
      {/* 分割线 */}
      <div className="mx-2 my-2 border-t border-zinc-200"></div>
      
      {/* App Items */}
      <div className="px-2 py-1 space-y-0">
        <AppItem 
          icon={<PlayCircle className="h-3 w-4" />} 
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
      <div className="px-2 py-1">
        <h3 className="text-sm font-normal text-black/60 mb-2 px-3">聊天</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto px-2 space-y-0">
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
      <div className="border-t border-zinc-200"></div>
      
      <div className="pt-0 pb-0">
        <UserProfileMenu />
      </div>
    </aside>
  );
}