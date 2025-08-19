import { NextRequest, NextResponse } from 'next/server';

const API_CONFIG = {
  baseUrl: process.env.BIGMODEL_API_BASE_URL || 'https://open.bigmodel.cn/api',
  apiKey: process.env.BIGMODEL_API_KEY,
};

export async function POST(request: NextRequest) {
  console.log('=== BigModel API 路由启动 ===');

  try {
    // 环境变量检查
    if (!API_CONFIG.apiKey) {
      console.error('❌ BIGMODEL_API_KEY 未设置');
      console.log('请在 .env.local 文件中设置: BIGMODEL_API_KEY=你的密钥');
      return NextResponse.json(
        { error: 'API密钥未配置' },
        { status: 500 }
      );
    }

    const { messages } = await request.json();
    console.log('📤 接收到消息:', messages?.length, '条');

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: '消息格式错误' },
        { status: 400 }
      );
    }

    const apiUrl = `${API_CONFIG.baseUrl}/paas/v4/chat/completions`;
    console.log('🌐 API地址:', apiUrl);

    const requestBody = {
      model: 'glm-4.5',
      messages: messages,
      stream: true,
      temperature: 0.7,
      top_p: 0.95,
      max_tokens: 2000,
      do_sample: true
    };

    console.log('📤 发送请求体:', JSON.stringify(requestBody, null, 2));

    // 创建AbortController用于超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('⏰ 请求超时，取消请求');
      controller.abort();
    }, 10000); // 10秒超时

    let apiResponse;
    try {
      apiResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_CONFIG.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        console.log('⏰ 请求已超时');
        // 返回超时错误的流式响应
        const stream = new ReadableStream({
          start(controller) {
            const encoder = new TextEncoder();
            const timeoutMessage = "data: " + JSON.stringify({
              choices: [{
                delta: { content: "并发数过多请稍后再试" },
                finish_reason: "stop"
              }]
            }) + "\n\n";
            
            controller.enqueue(encoder.encode(timeoutMessage));
            controller.close();
          }
        });

        return new NextResponse(stream, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
        });
      }
      
      throw error;
    }

    clearTimeout(timeoutId);

    console.log('📡 API响应状态:', apiResponse.status);

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('❌ API响应错误:', errorText);
      
      // 返回错误信息的流式响应
      const stream = new ReadableStream({
        start(controller) {
          const encoder = new TextEncoder();
          let errorMessage = "请求失败，请稍后重试";
          
          if (apiResponse.status === 429) {
            errorMessage = "并发数过多请稍后再试";
          } else if (apiResponse.status === 401) {
            errorMessage = "API密钥无效，请检查配置";
          } else if (apiResponse.status >= 500) {
            errorMessage = "服务暂时不可用，请稍后重试";
          }
          
          const errorData = "data: " + JSON.stringify({
            choices: [{
              delta: { content: errorMessage },
              finish_reason: "stop"
            }]
          }) + "\n\n";
          
          controller.enqueue(encoder.encode(errorData));
          controller.close();
        }
      });

      return new NextResponse(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    console.log('✅ 开始处理流式响应');

    // 处理流式响应
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        const reader = apiResponse.body?.getReader();

        if (!reader) {
          console.error('❌ 无法获取响应流');
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              console.log('✅ 流式响应结束');
              break;
            }

            const chunk = new TextDecoder().decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const jsonStr = line.slice(6);
                if (jsonStr.trim() === '[DONE]') {
                  console.log('✅ 收到结束标记');
                  controller.close();
                  return;
                }

                try {
                  const data = JSON.parse(jsonStr);
                  // 转换BigModel格式到前端期望格式
                  const transformedData = {
                    choices: [{
                      delta: {
                        content: data.choices?.[0]?.delta?.content || ''
                      },
                      finish_reason: data.choices?.[0]?.finish_reason || null
                    }]
                  };
                  
                  const transformedLine = `data: ${JSON.stringify(transformedData)}\n\n`;
                  controller.enqueue(encoder.encode(transformedLine));
                  
                } catch (parseError) {
                  console.warn('⚠️ 解析JSON失败:', parseError);
                }
              }
            }
          }
        } catch (streamError) {
          console.error('❌ 流处理错误:', streamError);
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: any) {
    console.error('❌ API路由错误:', error.message);

    // 返回错误的流式响应
    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        const errorData = "data: " + JSON.stringify({
          choices: [{
            delta: { content: "服务暂时不可用，请稍后重试" },
            finish_reason: "stop"
          }]
        }) + "\n\n";
        
        controller.enqueue(encoder.encode(errorData));
        controller.close();
      }
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  }
}