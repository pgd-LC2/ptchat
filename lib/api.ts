// API 请求处理模块
// TODO: 在这里实现真实的 LLM API 调用

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export type StreamCallback = (chunk: string) => void;

/**
 * 发送聊天消息到 LLM API
 * @param messages - 消息历史
 * @param onStream - 流式响应回调
 * @returns Promise<void>
 */
export async function sendChatMessage(
  messages: ChatMessage[], 
  onStream: StreamCallback
): Promise<void> {
  // TODO: 实现真实的 API 调用
  // 例如：OpenAI、Anthropic、或其他 LLM 提供商
  
  // 临时的模拟实现
  const userMessage = messages[messages.length - 1];
  const mockResponse = `这是一个来自 API 模块的模拟响应。你刚才说："${userMessage.content}"。请在这个文件中实现真实的 LLM API 调用。`;
  
  // 模拟流式响应
  for (let i = 0; i <= mockResponse.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 20));
    onStream(mockResponse.slice(0, i));
  }
}

/**
 * 配置 API 相关设置
 */
export const API_CONFIG = {
  // TODO: 添加 API 配置
  // baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  // apiKey: process.env.NEXT_PUBLIC_API_KEY,
  // model: 'gpt-4',
  // temperature: 0.7,
  // maxTokens: 2000,
};