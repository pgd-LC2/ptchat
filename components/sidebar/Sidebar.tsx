import SidebarHeader from './SidebarHeader';
import NewChatButton from './NewChatButton';
import SearchButton from './SearchButton';
import AppItem from './AppItem';
import ChatHistoryItem from './ChatHistoryItem';
import UserProfileMenu from '../header/UserProfileMenu';
import { Book } from 'lucide-react';

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

// 自定义GPT图标
function GPTIcon({ className }: { className?: string }) {
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
      <path d="M7.94556 14.0277C7.9455 12.9376 7.06204 12.054 5.97192 12.054C4.88191 12.0542 3.99835 12.9376 3.99829 14.0277C3.99829 15.1177 4.88188 16.0012 5.97192 16.0013C7.06207 16.0013 7.94556 15.1178 7.94556 14.0277ZM16.0012 14.0277C16.0012 12.9376 15.1177 12.054 14.0276 12.054C12.9375 12.0541 12.054 12.9376 12.054 14.0277C12.054 15.1178 12.9375 16.0012 14.0276 16.0013C15.1177 16.0013 16.0012 15.1178 16.0012 14.0277ZM7.94556 5.97201C7.94544 4.88196 7.062 3.99837 5.97192 3.99837C4.88195 3.99849 3.99841 4.88203 3.99829 5.97201C3.99829 7.06208 4.88187 7.94552 5.97192 7.94564C7.06207 7.94564 7.94556 7.06216 7.94556 5.97201ZM16.0012 5.97201C16.0011 4.88196 15.1177 3.99837 14.0276 3.99837C12.9376 3.99843 12.0541 4.882 12.054 5.97201C12.054 7.06212 12.9375 7.94558 14.0276 7.94564C15.1177 7.94564 16.0012 7.06216 16.0012 5.97201ZM9.27563 14.0277C9.27563 15.8524 7.79661 17.3314 5.97192 17.3314C4.14734 17.3313 2.66821 15.8523 2.66821 14.0277C2.66827 12.2031 4.14737 10.7241 5.97192 10.724C7.79657 10.724 9.27558 12.203 9.27563 14.0277ZM17.3313 14.0277C17.3313 15.8524 15.8523 17.3314 14.0276 17.3314C12.203 17.3313 10.7239 15.8523 10.7239 14.0277C10.7239 12.2031 12.203 10.724 14.0276 10.724C15.8522 10.724 17.3312 12.203 17.3313 14.0277ZM9.27563 5.97201C9.27563 7.7967 7.79661 9.27572 5.97192 9.27572C4.14734 9.2756 2.66821 7.79662 2.66821 5.97201C2.66833 4.14749 4.14741 2.66841 5.97192 2.6683C7.79654 2.6683 9.27552 4.14742 9.27563 5.97201ZM17.3313 5.97201C17.3313 7.79669 15.8523 9.27572 14.0276 9.27572C12.203 9.27566 10.7239 7.79666 10.7239 5.97201C10.724 4.14746 12.203 2.66836 14.0276 2.6683C15.8522 2.6683 17.3312 4.14742 17.3313 5.97201Z"></path>
    </svg>
  );
}

// 自定义Bolt图标
function BoltIcon({ className }: { className?: string }) {
  return (
    <img 
      className={`bg-token-tertiary h-full w-full ${className || ''}`}
      alt="Bolt"
      width="20"
      height="20"
      src="https://chatgpt.com/backend-api/estuary/content?id=file-mxcVrc7YdDJ7PnTm4xjpQvKf&gizmo_id=g-tozliiBeO&ts=487593&p=gpp&cid=1&sig=43a5d384c25db5c85726c1cb2e64dba41b87a943215fc55d4558b11b508054c1"
    />
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
          icon={<GPTIcon className="h-6 w-6" />} 
          label="GPT" 
          onClick={() => onAppSelect('GPT')}
        />
        <AppItem 
          icon={<BoltIcon className="h-6 w-6" />} 
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