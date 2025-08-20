// lib/api.ts
import { ZhipuAI } from 'zhipuai-sdk-nodejs-v4';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export type StreamCallback = (chunk: string) => void;

// 智谱AI客户端配置
const getZhipuAIClient = () => {
  // 从环境变量读取API Key
  const apiKey = process.env.ZHIPUAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('ZHIPUAI_API_KEY 环境变量未设置，请在 .env.local 文件中配置');
  }

  return new ZhipuAI({
    apiKey: apiKey,
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4', // 可选，默认值
    timeout: 30000, // 可选，请求超时时间
  });
};

/**
 * 发送聊天消息到智谱AI大模型（支持流式输出）
 * @param messages - 消息历史
 * @param onStream - 流式响应回调
 * @returns Promise<void>
 */
export async function sendChatMessage(
  messages: ChatMessage[], 
  onStream: StreamCallback
): Promise<void> {
  try {
    const ai = getZhipuAIClient();
    
    // 转换消息格式以符合API要求
    const apiMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // 创建流式聊天完成请求 
    const response = await ai.createCompletions({
      model: 'glm-4', // 可以使用 'glm-4', 'glm-4-air', 'glm-4-flash' 等模型
      messages: apiMessages,
      stream: true, // 启用流式输出
      temperature: 0.7, // 可选，控制随机性
      top_p: 0.8, // 可选，控制采样范围
      max_tokens: 2048 // 可选，最大输出token数
    });

    let fullContent = '';
    
    // 处理流式响应 - 使用 SDK 的异步迭代器
    for await (const chunk of response) {
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
}