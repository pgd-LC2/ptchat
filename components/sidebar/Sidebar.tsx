import SidebarHeader from './SidebarHeader';
import NewChatButton from './NewChatButton';
import SearchButton from './SearchButton';
import AppItem from './AppItem';
import ChatHistoryItem from './ChatHistoryItem';
import UserProfileMenu from '../header/UserProfileMenu';
import { Zap, Sparkles, Book } from 'lucide-react';

// 自定义Sora图标
function SoraIcon({ className }: { className?: string }) {
  return (
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 20 20" 
      fill="currentColor" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      aria-hidden="true"
    >
      <path d="M16.585 10C16.585 6.3632 13.6368 3.41504 10 3.41504C6.3632 3.41504 3.41504 6.3632 3.41504 10C3.41504 13.6368 6.3632 16.585 10 16.585C13.6368 16.585 16.585 13.6368 16.585 10ZM17.915 10C17.915 14.3713 14.3713 17.915 10 17.915C5.62867 17.915 2.08496 14.3713 2.08496 10C2.08496 5.62867 5.62867 2.08496 10 2.08496C14.3713 2.08496 17.915 5.62867 17.915 10Z"></path>
      <path d="M7.96545 12.1812V7.81878C7.96545 7.17205 8.68092 6.78144 9.22494 7.13117L12.6179 9.31238C13.1185 9.63416 13.1185 10.3658 12.6179 10.6876L9.22494 12.8688C8.68092 13.2186 7.96545 12.828 7.96545 12.1812Z"></path>
    </svg>
  );
}

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
          icon={<SoraIcon className="h-6 w-6" />} 
          label="Sora" 
          onClick={() => onAppSelect('Sora')}
        />
        <AppItem 
          icon={<Zap className="h-6 w-6" />} 
          label="GPT" 
          onClick={() => onAppSelect('GPT')}
        />
        <AppItem 
          icon={<Sparkles className="h-6 w-6" />} 
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