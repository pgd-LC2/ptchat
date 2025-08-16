import SidebarHeader from './SidebarHeader';
import NewChatButton from './NewChatButton';
import SearchInput from './SearchInput';
import AppItem from './AppItem';
import ChatHistoryItem from './ChatHistoryItem';
import UserProfileMenu from '../header/UserProfileMenu';
import { PlayCircle, Zap, Sparkles, Book } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-[260px] flex-col border-r border-zinc-200 bg-white">
      {/* Header with logo and more button */}
      <SidebarHeader />
      
      {/* New Chat Button */}
      <div className="px-3 py-1">
        <NewChatButton />
      </div>
      
      {/* Search Input */}
      <SearchInput />
      
      {/* Library button */}
      <div className="px-3 py-1">
        <AppItem icon={<Book className="h-4 w-4" />} label="库" />
      </div>
      
      {/* App Items */}
      <div className="px-3 py-2 space-y-1">
        <AppItem icon={<PlayCircle className="h-4 w-4" />} label="Sora" />
        <AppItem icon={<Zap className="h-4 w-4" />} label="GPT" />
        <AppItem icon={<Sparkles className="h-4 w-4" />} label="Bolt Prompter" />
      </div>
      
      {/* Chat History Section */}
      <div className="px-3 py-2">
        <h3 className="text-xs font-medium text-black/60 mb-2">聊天</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto px-3 space-y-1">
        <ChatHistoryItem title="GitLab SSH 错误快" active />
        <ChatHistoryItem title="写一大段内容" />
        <ChatHistoryItem title="神经网络输出原理" />
        <ChatHistoryItem title="Bolt.new 页面解析" />
        <ChatHistoryItem title="自动光值设置解答" />
        <ChatHistoryItem title="处理跑行符" />
        <ChatHistoryItem title="GitLab SSH 错误解决" />
        <ChatHistoryItem title="shelter值分析" />
        <ChatHistoryItem title="组合内容探索" />
        <ChatHistoryItem title="数学运算步骤" />
        <ChatHistoryItem title="TIM会议解释" />
        <ChatHistoryItem title="设计图标请求" />
        <ChatHistoryItem title="SVG路径解析" />
        <ChatHistoryItem title="总结科技报告编写规则" />
        <ChatHistoryItem title="检查课题错误优化" />
        <ChatHistoryItem title="Factions world idea" />
        <ChatHistoryItem title="函数英文翻译" />
        <ChatHistoryItem title="LSTM模型介绍" />
        <ChatHistoryItem title="React Vite setup" />
        <ChatHistoryItem title="GitHub AI 提示词项目" />
        <ChatHistoryItem title="重复内容 中文" />
        <ChatHistoryItem title="确认对话内容" />
        <ChatHistoryItem title="设置域名邮箱后缀" />
        <ChatHistoryItem title="蒙古人口估算" />
        <ChatHistoryItem title="会吃蛇网页制作" />
        <ChatHistoryItem title="深度学习原理解析" />
      </div>
      
      <div className="px-3 py-3">
        <UserProfileMenu />
      </div>
    </aside>
  );
}
