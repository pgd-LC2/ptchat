// lib/api.ts  
// 客户端API调用

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export type StreamCallback = (chunk: string) => void;

/**
 * 发送聊天消息到BigModel API
 * @param messages - 消息历史
 * @param onStream - 流式响应回调
 * @returns Promise<void>
 */
export async function sendChatMessage(
  messages: ChatMessage[], 
  onStream: StreamCallback
): Promise<void> {
  try {
    console.log('📤 发送聊天请求，消息数量:', messages.length);

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API请求失败: ${response.status} - ${errorData.error || 'Unknown error'}`);
    }

    if (!response.body) {
      throw new Error('响应体为空');
    }

    // 处理流式响应
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulatedContent = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          console.log('✅ 流式响应接收完成');
          break;
        }

        // 解码接收到的数据块
        const chunk = decoder.decode(value, { stream: true });
        accumulatedContent += chunk;
        
        // 调用回调函数，传递累积的完整内容
        onStream(accumulatedContent);
      }
    } finally {
      reader.releaseLock();
    }

  } catch (error) {
    console.error('❌ API请求错误:', error);
    
    // 提供错误反馈给用户
    const errorMessage = error instanceof Error 
      ? `请求失败: ${error.message}` 
      : '发生未知错误，请稍后重试';
      
    onStream(errorMessage);
    throw error;
  }
}