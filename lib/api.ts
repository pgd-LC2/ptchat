export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export type StreamCallback = (chunk: string) => void;

/**
 * 发送聊天消息到服务器API路由（支持流式输出）
 * @param messages - 消息历史
 * @param onStream - 流式响应回调
 * @returns Promise<void>
 */
export async function sendChatMessage(
  messages: ChatMessage[], 
  onStream: StreamCallback
): Promise<void> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('无法获取响应流');
    }

    const decoder = new TextDecoder();
    
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            return;
          }
          
          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              onStream(parsed.content);
            }
          } catch (parseError) {
            console.warn('解析流式数据时出错:', parseError);
          }
        }
      }
    }
  } catch (error) {
    console.error('调用聊天API时出错:', error);
    
    let errorMessage = '抱歉，连接AI服务时出现错误，请稍后重试。';
    
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        errorMessage = '网络连接错误，请检查网络后重试。';
      }
    }
    
    onStream(errorMessage);
    throw error;
  }
}

export async function sendChatMessage2(
  messages: ChatMessage[], 
  onStream: StreamCallback
): Promise<void> {
  let fullContent = '';
  
  try {
    for (const chunk of []) {
      try {
        // SDK 已经解析了 JSON，直接使用 chunk 对象
        if (chunk.choices && chunk.choices[0] && chunk.choices[0].delta) {
          const deltaContent = chunk.choices[0].delta.content;
          if (deltaContent) {
            fullContent += deltaContent;
            // 调用回调函数，传递累积的完整内容
            onStream(fullContent);
          }
        }
      } catch (parseError) {
        console.warn('处理流式数据时出错:', parseError);
      }
    }
  } catch (error) {
    console.error('调用智谱AI API时出错:', error);
    
    // 根据错误类型提供更具体的错误提示
    let errorMessage = '抱歉，连接AI服务时出现错误，请稍后重试。';
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        errorMessage = 'API密钥无效，请检查配置。';
      } else if (error.message.includes('timeout')) {
        errorMessage = '请求超时，请检查网络连接后重试。';
      } else if (error.message.includes('rate limit')) {
        errorMessage = 'API调用频率过高，请稍后重试。';
      }
    }
    
    onStream(errorMessage);
    throw error;
  }
}