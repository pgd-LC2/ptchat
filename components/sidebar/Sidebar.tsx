import NewChatButton from './NewChatButton';
import ChatHistoryItem from './ChatHistoryItem';
import UserProfileMenu from '@/components/header/UserProfileMenu';

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-[260px] flex-col border-r border-zinc-200 bg-white">
      <div className="px-2 py-3">
        <NewChatButton className="w-full justify-center" />
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        <ChatHistoryItem title="GitLab SSH 错误快" active />
        <ChatHistoryItem title="shelter自动分析" />
        <ChatHistoryItem title="组合内容探索" />
        <ChatHistoryItem title="数字艺术提示" />
        <ChatHistoryItem title="TIM会议择" />
        <ChatHistoryItem title="设计图标方案" />
      </div>
      <div className="px-2 py-3">
        <UserProfileMenu />
      </div>
    </aside>
  );
}
