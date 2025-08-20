import { NextRequest, NextResponse } from 'next/server';
import { ZhipuAI } from 'zhipuai-sdk-nodejs-v4';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
};

// 智谱AI客户端配置
const getZhipuAIClient = () => {
  const apiKey = 'b6d6fad0d07a4232acd5c8bb5b325218.dpsLqgmR0FLhBKAz';

  return new ZhipuAI({
    apiKey: apiKey,
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    timeout: 30000,
  });
};

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();
    
    console.log('使用直接配置的API Key');
    
    const ai = getZhipuAIClient();
    
    // 转换消息格式以符合API要求
    const apiMessages = messages.map((msg: ChatMessage) => ({
      role: msg.role,
      content: msg.content
    }));

    // 创建流式聊天完成请求 
    const response = await ai.createCompletions({
      model: 'glm-4',
      messages: apiMessages,
      stream: true,
      temperature: 0.7,
      top_p: 0.8,
      max_tokens: 2048
    });

    // 创建可读流
    const stream = new ReadableStream({
      async start(controller) {
        let fullContent = '';
        
        try {
          // 处理流式响应 - 使用 SDK 的异步迭代器
          for await (const chunk of response) {
            try {
              // SDK 已经解析了 JSON，直接使用 chunk 对象
              if (chunk.choices && chunk.choices[0] && chunk.choices[0].delta) {
                const deltaContent = chunk.choices[0].delta.content;
                if (deltaContent) {
                  fullContent += deltaContent;
                  // 发送累积的完整内容
                  const data = JSON.stringify({ content: fullContent });
                  controller.enqueue(new TextEncoder().encode(`data: ${data}\n\n`));
                }
              }
            } catch (parseError) {
              console.warn('处理流式数据时出错:', parseError);
            }
          }
        } catch (error) {
          console.error('调用智谱AI API时出错:', error);
          
          // 详细的错误信息
          if (error && typeof error === 'object' && 'message' in error) {
            console.error('错误详情:', error.message);
          }
          
          let errorMessage = '抱歉，连接AI服务时出现错误，请稍后重试。';
          
          if (error instanceof Error) {
            if (error.message.includes('API key')) {
              errorMessage = 'API密钥无效，请检查配置。';
            } else if (error.message.includes('timeout')) {
              errorMessage = '请求超时，请检查网络连接后重试。';
            } else if (error.message.includes('rate limit')) {
              errorMessage = 'API调用频率过高，请稍后重试。';
            } else if (error.message.includes('Authorization') || error.message.includes('invalid')) {
              errorMessage = 'API密钥无效，请检查API密钥是否正确。';
            }
          }
          
          const data = JSON.stringify({ content: errorMessage });
          controller.enqueue(new TextEncoder().encode(`data: ${data}\n\n`));
        }
        
        controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
        controller.close();
      }
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
    
  } catch (error) {
    console.error('API路由错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' }, 
      { status: 500 }
    );
  }
}