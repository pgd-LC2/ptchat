import { NextRequest, NextResponse } from 'next/server';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

/**
 * 心流API配置
 */
const API_CONFIG = {
  // 从服务端环境变量获取API密钥（安全）
  apiKey: process.env.IFLOW_API_KEY || '',
  // API基础URL
  baseUrl: 'https://apis.iflow.cn/v1',
  // 默认模型
  model: 'Qwen3-Coder',
  // 默认温度参数
  temperature: 0.7,
  // 默认最大token数
  maxTokens: 8192,
  // 默认top_p值
  topP: 0.7,
  // 默认top_k值
  topK: 50,
  // 默认频率惩罚
  frequencyPenalty: 0.5,
};

/**
 * 验证API配置
 */
function validateConfig(): void {
  if (!API_CONFIG.apiKey) {
    console.error('环境变量检查:', {
      IFLOW_API_KEY_EXISTS: !!process.env.IFLOW_API_KEY,
      NODE_ENV: process.env.NODE_ENV
    });
    throw new Error('API密钥未配置。请在.env.local文件中设置IFLOW_API_KEY环境变量');
  }
}

/**
 * 将ChatMessage转换为心流API消息格式
 */
function convertMessages(messages: ChatMessage[]): Array<{role: string; content: string}> {
  return messages.map(message => ({
    role: message.role,
    content: message.content,
  }));
}

export async function POST(request: NextRequest) {
  try {
    console.log('API路由开始处理请求');
    
    // 验证配置
    try {
      validateConfig();
    } catch (configError) {
      console.error('配置验证失败:', configError);
      return NextResponse.json(
        { error: '服务器配置错误。请检查环境变量设置。' },
        { status: 500 }
      );
    }
    
    console.log('API配置验证通过，API密钥长度:', API_CONFIG.apiKey.length);
    
    // 解析请求体 
    let messages;
    try {
      const body = await request.json();
      messages = body.messages;
    } catch (parseError) {
      console.error('请求体解析失败:', parseError);
      return NextResponse.json(
        { error: '无效的请求格式' },
        { status: 400 }
      );
    }
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: '无效的消息格式' },
        { status: 400 }
      );
    }
    
    // 转换消息格式
    const apiMessages = convertMessages(messages);
    
    // 构建请求体
    const requestBody = {
      model: API_CONFIG.model,
      messages: apiMessages,
      stream: true, // 启用流式响应
      max_tokens: API_CONFIG.maxTokens,
      temperature: API_CONFIG.temperature,
      top_p: API_CONFIG.topP,
      top_k: API_CONFIG.topK,
      frequency_penalty: API_CONFIG.frequencyPenalty,
      n: 1,
      response_format: {
        type: 'text'
      }
    };
    
    console.log('准备发送请求到心流API:', {
      url: `${API_CONFIG.baseUrl}/chat/completions`,
      model: requestBody.model,
      messagesCount: apiMessages.length
    });
    
    // 发送请求到心流API，增加超时和错误处理
    let response;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒超时
      
      response = await fetch(`${API_CONFIG.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_CONFIG.apiKey}`,
          'User-Agent': 'DevinPTChat/1.0',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
    } catch (fetchError: any) {
      console.error('API请求失败:', {
        error: fetchError.message,
        cause: fetchError.cause,
        stack: fetchError.stack
      });
      
      // 返回模拟响应以保持应用可用性
      return new Response(
        createSimulatedStream(),
        {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        }
      );
    }
    
    console.log('心流API响应状态:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('心流API请求失败:', response.status, errorData);
      
      // 如果外部API失败，返回模拟响应
      return new Response(
        createSimulatedStream(),
        {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        }
      );
    }
    
    // 创建流式响应
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        
        if (!reader) {
          controller.error(new Error('无法获取响应流'));
          return;
        }
        
        let buffer = '';
        
        try {
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
              controller.close();
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
                
                // 检查是否结束
                if (dataStr === '[DONE]') {
                  controller.close();
                  return;
                }
                
                try {
                  const data = JSON.parse(dataStr);
                  
                  // 提取内容
                  if (data.choices && data.choices[0] && data.choices[0].delta) {
                    const content = data.choices[0].delta.content;
                    
                    if (content) {
                      // 发送内容到客户端
                      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                    }
                  }
                } catch (e) {
                  console.error('解析流数据失败:', e);
                }
              }
            }
          }
        } catch (error) {
          console.error('流处理错误:', error);
          controller.error(error);
        }
      },
    });
    
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
    
  } catch (error) {
    console.error('API路由错误:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '服务器内部错误' },
      { status: 500 }
    );
  }
}

// 支持OPTIONS请求（CORS预检）
export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

// 创建模拟流式响应（用作后备方案）
function createSimulatedStream() {
  const encoder = new TextEncoder();
  let index = 0;
  const simulatedResponse = "抱歉，当前AI服务暂时不可用。这是一个模拟响应，用于演示聊天界面的功能。请稍后再试或检查网络连接。";
  
  return new ReadableStream({
    start(controller) {
      const interval = setInterval(() => {
        if (index < simulatedResponse.length) {
          const char = simulatedResponse[index];
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: char })}\n\n`));
          index++;
        } else {
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
          clearInterval(interval);
        }
      }, 50); // 50ms间隔模拟打字效果
    }
  });
}