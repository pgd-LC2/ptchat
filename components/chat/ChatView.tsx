import WelcomeScreen from './WelcomeScreen';
import { AssistantMessage, UserMessage } from './ChatMessage';
import ChatInput from './ChatInput';

export default function ChatView() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[768px] px-6 py-6 space-y-4">
          <WelcomeScreen />
          <UserMessage content={'你好'} />
          <AssistantMessage content={'我是助手，这里是回复示例。'} />
          <UserMessage content={'再来一条消息，确认间距与样式。'} />
          <AssistantMessage content={'这是一段更长的回复文本，用于检查换行与容器宽度表现。'} />
        </div>
      </div>
      <div className="sticky bottom-0 border-t border-zinc-200 bg-[#F7F7F8]/80 backdrop-blur supports-[backdrop-filter]:bg-[#F7F7F8]/60">
        <ChatInput />
      </div>
    </div>
  );
}
