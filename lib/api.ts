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
  // 推荐使用环境变量存储API Key
  const apiKey = process.env.ZHIPUAI_API_KEY || 'your_api_key_here';
  
  return new ZhipuAI({
    apiKey: apiKey,
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4', // 可选，默认值
    timeout: 30000, // 可选，请求超时时间
    cacheToken: true // 可选，是否缓存token
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
    const stream = await ai.createCompletions({
      model: 'glm-4', // 可以使用 'glm-4', 'glm-4-air', 'glm-4-flash' 等模型
      messages: apiMessages,
      stream: true, // 启用流式输出
      temperature: 0.7, // 可选，控制随机性
      top_p: 0.8, // 可选，控制采样范围
      max_tokens: 2048 // 可选，最大输出token数
    });

    // 处理流式响应
    for await (const chunk of stream) {
      try {
        // 解析SSE数据块
        const data = chunk.toString();
        if (data.startsWith('data: ')) {
          const jsonStr = data.slice(6); // 移除 'data: ' 前缀
          if (jsonStr === '[DONE]') {
            break; // 流结束
          }
          
          const parsed = JSON.parse(jsonStr);
          if (parsed.choices && parsed.choices[0] && parsed.choices[0].delta) {
            const content = parsed.choices[0].delta.content;
            if (content) {
              onStream(content);
            }
          }
        }
      } catch (parseError) {
        console.warn('解析流式数据时出错:', parseError);
      }
    }
  } catch (error) {
    console.error('调用智谱AI API时出错:', error);
    // 提供友好的错误提示
    onStream('抱歉，连接AI服务时出现错误，请稍后重试。');
    throw error;
  }
}

/**
 * 发送聊天消息到智谱AI大模型（非流式）
 * @param messages - 消息历史
 * @returns Promise<string> - 完整的响应内容
 */
export async function sendChatMessageSync(
  messages: ChatMessage[]
): Promise<string> {
  try {
    const ai = getZhipuAIClient();
    
    // 转换消息格式
    const apiMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // 创建同步聊天完成请求
    const result = await ai.createCompletions({
      model: 'glm-4',
      messages: apiMessages,
      stream: false,
      temperature: 0.7,
      top_p: 0.8,
      max_tokens: 2048
    });

    if (result.choices && result.choices[0] && result.choices[0].message) {
      return result.choices[0].message.content || '';
    }
    
    throw new Error('API返回格式异常');
  } catch (error) {
    console.error('调用智谱AI API时出错:', error);
    throw error;
  }
}