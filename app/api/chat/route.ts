import { NextRequest, NextResponse } from 'next/server';
import { ZhipuAI } from 'zhipuai-sdk-nodejs-v4';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
};

// 使用固定的API密钥
const apiKey = '336f0e6cb8eb4ed581c3461b7a2e5c85.E73mfNB2xr2kZWcu';

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();
    
    console.log('创建智谱AI客户端，API Key:', apiKey.substring(0, 10) + '...');
    
    // 根据官方文档创建客户端
    const ai = new ZhipuAI({
      apiKey: apiKey
    });
    
    // 转换消息格式以符合API要求
    const apiMessages = messages.map((msg: ChatMessage) => ({
      role: msg.role,
      content: msg.content
    }));

    console.log('发送请求到智谱AI API...');
    console.log('消息数量:', apiMessages.length);

    // 创建流式聊天完成请求
    const stream = await ai.createCompletions({
      model: 'glm-4',
      messages: apiMessages,
      stream: true,
      temperature: 0.7,
      top_p: 0.8,
      max_tokens: 2048
    });

    console.log('成功获取流式响应');

    // 创建可读流
    const readableStream = new ReadableStream({
      async start(controller) {
        let fullContent = '';
        
        try {
          // 根据官方文档处理流式响应
          for await (const chunk of stream) {
            try {
              // 直接输出chunk来看看结构
              console.log('收到chunk:', JSON.stringify(chunk, null, 2));
              
              // 检查chunk的结构并处理内容
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
          
          console.log('流式响应处理完成，总内容长度:', fullContent.length);
        } catch (error) {
          console.error('智谱AI API调用出错:', error);
          
          // 详细的错误信息
          let errorMessage = '抱歉，连接AI服务时出现错误，请稍后重试。';
          
          if (error && typeof error === 'object') {
            console.error('完整错误对象:', error);
            
            if ('response' in error && error.response) {
              console.error('API响应错误:', error.response);
              if (error.response.data) {
                console.error('错误数据:', error.response.data);
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

    return new NextResponse(readableStream, {
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