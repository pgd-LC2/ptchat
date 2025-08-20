import { NextRequest, NextResponse } from 'next/server';
import { ZhipuAI } from 'zhipuai-sdk-nodejs-v4';

// 在模块顶级定义API密钥
const apiKey = '336f0e6cb8eb4ed581c3461b7a2e5c85.E73mfNB2xr2kZWcu';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
};

// 智谱AI客户端配置
const getZhipuAIClient = () => {
  return new ZhipuAI({
    apiKey: apiKey,
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    timeout: 30000,
  });
};

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();
    
    console.log('使用API Key:', apiKey.substring(0, 10) + '...');
    
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
          
          // 解析并显示详细的错误信息
          let errorMessage = '抱歉，连接AI服务时出现错误，请稍后重试。';
          
          if (error && typeof error === 'object') {
            console.error('完整错误对象:', error);
            
            // 尝试解析错误响应
            if ('response' in error && error.response) {
              console.error('API响应错误:', error.response);
              if (error.response.data) {
                console.error('错误数据:', error.response.data);
                if (error.response.data.error && error.response.data.error.message) {
                  errorMessage = `API错误: ${error.response.data.error.message}`;
                }
              }
            }
            
            if ('message' in error) {
              console.error('错误消息:', error.message);
              if (error.message.includes('1002')) {
                errorMessage = 'API密钥无效或已过期，请检查您的智谱AI API密钥是否正确。';
              }
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