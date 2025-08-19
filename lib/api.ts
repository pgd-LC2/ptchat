// lib/api.ts  
// BigModel API客户端

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export type StreamCallback = (chunk: string) => void;
export type StreamCallback = (content: string, isError?: boolean) => void;

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
  console.log('🚀 开始发送消息到BigModel API');
  
  // 已知的错误消息模式
  const errorPatterns = [
    '并发数过多请稍后再试',
    'API密钥无效',
    '服务暂时不可用',
    '请求失败',
    'too many requests',
    'rate limit',
    'invalid api key',
    'service unavailable',
    'internal server error',
  ];

  // 检查内容是否为错误消息
  const isErrorContent = (content: string): boolean => {
    const lowerContent = content.toLowerCase();
    return errorPatterns.some(pattern => 
      lowerContent.includes(pattern.toLowerCase())
    );
  };

  try {
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

    console.log('📡 API响应状态:', response.status);

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status} - ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error('响应体为空');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    console.log('📖 开始读取流式响应');

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        console.log('✅ 流式响应读取完成');
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonStr = line.slice(6);
          
          if (jsonStr.trim() === '[DONE]') {
            console.log('✅ 收到结束标记');
            return;
          }

          try {
            const data = JSON.parse(jsonStr);
            const content = data.choices?.[0]?.delta?.content;
            
            if (content !== undefined) {
              // 检查是否为错误内容
              const isError = isErrorContent(content);
              onStream(content, isError);
            }

            // 检查是否结束
            if (data.choices?.[0]?.finish_reason) {
              console.log('✅ 响应完成，原因:', data.choices[0].finish_reason);
              return;
            }
          } catch (parseError) {
            console.warn('⚠️ 解析响应数据失败:', parseError);
          }
        }
      }
    }
  } catch (error: any) {
    console.error('❌ API请求错误:', error.message);
    
    // 显示友好的错误消息
    let errorMessage = '';
    if (error.message.includes('Failed to fetch')) {
      errorMessage = '网络连接失败，请检查网络后重试';
    } else if (error.message.includes('timeout')) {
      errorMessage = '并发数过多请稍后再试';
    } else {
      errorMessage = '服务暂时不可用，请稍后重试';
    }
    
    // 将错误消息标记为错误
    onStream(errorMessage, true);
    
    throw new Error(`API请求失败: ${error.message}`);
  }
}