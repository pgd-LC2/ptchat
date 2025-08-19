import { NextRequest, NextResponse } from 'next/server';

// 可用的模型列表
const MODELS = ['glm-4.5', 'glm-4.5-air'];

// 随机选择模型
function getRandomModel(): string {
  return MODELS[Math.floor(Math.random() * MODELS.length)];
}

export async function POST(req: NextRequest) {
  try {
    // 检查API密钥
    const apiKey = process.env.BIGMODEL_API_KEY;
    if (!apiKey) {
      console.error('❌ API密钥未配置');
      return NextResponse.json(
        { error: 'API密钥未配置，请在.env.local中设置BIGMODEL_API_KEY' },
        { status: 500 }
      );
    }

    // 解析请求体
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: '无效的消息格式' },
        { status: 400 }
      );
    }

    // 随机选择模型
    const selectedModel = getRandomModel();
    console.log(`🤖 使用模型: ${selectedModel}`);

    // 构建请求体
    const requestBody = {
      model: selectedModel,
      messages: messages,
      stream: true,
      temperature: 0.7,
      top_p: 0.95,
      max_tokens: 4000,
      request_id: `req_${Date.now()}_${Math.random().toString(36).substring(2)}`
    };

    // 发送请求到BigModel API
    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ BigModel API错误:', response.status, errorData);
      return NextResponse.json(
        { error: `BigModel API错误: ${response.status}` },
        { status: response.status }
      );
    }

    // 创建可读流来处理SSE响应
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        try {
          let buffer = '';
          
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
              console.log('✅ 流式响应完成');
              break;
            }

            // 解码数据块
            buffer += decoder.decode(value, { stream: true });
            

            
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';
            
            for (const line of lines) {
              const trimmedLine = line.trim();
              if (!trimmedLine) continue;
              
              if (trimmedLine === 'data: [DONE]') {
                console.log('✅ 流结束');
                controller.close();
                return;
              }
              
              if (trimmedLine.startsWith('data: ')) {
                try {
                  const jsonStr = trimmedLine.slice(6);
                  if (jsonStr === '[DONE]') {
                    controller.close();
                    return;
                  }
                  
                  const data = JSON.parse(jsonStr);
                  const content = data.choices?.[0]?.delta?.content;
                  
                  if (content) {
                    console.log('📤 发送流式内容:', content);
                    controller.enqueue(encoder.encode(content));
                  }
                ;
                } catch (e) {
                  console.warn('⚠️ 解析失败:', e);
                }
              }
            }
          ;
          }
        } catch (error) {
          console.error('❌ 流处理错误:', error);
          controller.error(error);
        } finally {
          reader.releaseLock();
        }
      },
    });

    // 返回流式响应
    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no', // 禁用nginx缓冲
      },
    });

  } catch (error) {
    console.error('❌ 处理聊天请求时发生错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}