// lib/api.ts  
// 客户端API请求处理模块
// 通过Next.js API路由调用心流API（安全实现）

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export type StreamCallback = (chunk: string) => void;

/**
 * 通过Next.js API路由发送聊天消息
 * @param messages - 消息历史
 * @param onStream - 流式响应回调
 * @returns Promise<void>
 */
export async function sendChatMessage(
  messages: ChatMessage[], 
  onStream: StreamCallback
): Promise<void> {
  try {
    // 发送请求，增加错误处理
    let response;
    try {
      response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      });
    } catch (fetchError: any) {
      console.error('本地API请求失败:', fetchError);
      throw new Error(`网络连接失败: ${fetchError.message}`);
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API响应错误:', response.status, errorData);
      throw new Error(`服务器响应错误: ${response.status} - ${errorData.error || '未知错误'}`);
    }
    
    // 处理流式响应
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    
    if (!reader) {
      throw new Error('无法获取响应流');
    }
    
    let buffer = '';
    
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        break;
      }
      
      // 解码二进制数据
      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;
      
      // 按行分割数据
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // 保留最后一个不完整的行
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        
        if (trimmedLine.startsWith('data: ')) {
          const dataStr = trimmedLine.slice(6);
          
          try {
            const data = JSON.parse(dataStr);
            
            if (dataStr === '[DONE]') {
              break;
            }
            
            if (data.content) {
              onStream(data.content);
            }
          } catch (parseError) {
            console.error('解析流数据失败:', parseError, '原始数据:', dataStr);
          }
        }
      }
    }
  } catch (error: any) {
    console.error('API请求错误:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });
    throw error;
  }
}
