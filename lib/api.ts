// lib/api.ts  
// 客户端API类型定义（无实际功能）

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export type StreamCallback = (chunk: string) => void;

/**
 * 模拟聊天消息发送（无实际AI功能）
 * @param messages - 消息历史
 * @param onStream - 流式响应回调
 * @returns Promise<void>
 */
export async function sendChatMessage(
  messages: ChatMessage[], 
  onStream: StreamCallback
): Promise<void> {
  // 模拟延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 模拟响应
  const response = "这是一个演示界面，没有连接真实的AI服务。";
  
  // 模拟逐字输出效果
  for (let i = 0; i < response.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 50));
    onStream(response.slice(0, i + 1));
  }
};