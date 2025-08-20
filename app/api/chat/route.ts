import { NextRequest, NextResponse } from 'next/server';
import { ZhipuAI } from 'zhipuai-sdk-nodejs-v4';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
};

// 从环境变量获取API密钥 - 不要提供默认值
const apiKey = process.env.ZHIPU_AI_API_KEY;

export async function POST(request: NextRequest) {
  try {
    // 检查API密钥是否存在
    if (!apiKey) {
      console.error('ZHIPU_AI_API_KEY 环境变量未设置');
      return NextResponse.json(
        { error: '服务器配置错误：API密钥未设置' }, 
        { status: 500 }
      );
    }

    const { messages } = await request.json();
    
    console.log('创建智谱AI客户端，API Key:', apiKey.substring(0, 10) + '...');
    
    // 正确的实例化方式
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
          // 正确的流式响应处理方式
          for await (const chunk of stream) {
            try {
              // 使用toString()方法获取内容
              const content = chunk.toString();
              console.log('收到chunk:', content);
              
              if (content) {
                fullContent += content;
                // 发送累积的完整内容
                const data = JSON.stringify({ content: fullContent });
                controller.enqueue(new TextEncoder().encode(`data: ${data}\n\n`));
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