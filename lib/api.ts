// lib/api.ts
// 心流API请求处理模块
// 实现真实的LLM API调用

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export type StreamCallback = (chunk: string) => void;

/**
 * 心流API配置
 */
export const API_CONFIG = {
  // 从环境变量获取API密钥
  apiKey: process.env.IFLOW_API_KEY || '',
  // API基础URL
  baseUrl: 'https://apis.iflow.cn/v1',
  // 默认模型
  model: 'deepseek-r1',
  // 默认温度参数
  temperature: 0.7,
  // 默认最大token数
  maxTokens: 2000,
  // 默认top_p值
  topP: 0.7,
  // 默认top_k值
  topK: 50,
  // 默认频率惩罚
  frequencyPenalty: 0.5,
  // 请求超时时间(毫秒)
  timeout: 30000,
};

/**
 * 验证API配置
 */
function validateConfig(): void {
  if (!API_CONFIG.apiKey) {
    throw new Error('API密钥未配置。请设置IFLOW_API_KEY环境变量');
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

/**
 * 发送聊天消息到心流API
 * @param messages - 消息历史
 * @param onStream - 流式响应回调
 * @returns Promise<void>
 */
export async function sendChatMessage(
  messages: ChatMessage[], 
  onStream: StreamCallback
): Promise<void> {
  try {
    // 验证配置
    validateConfig();
    
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
    };
    
    // 发送请求
    const response = await fetch(`${API_CONFIG.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API请求失败: ${response.status} - ${errorData.error?.message || '未知错误'}`);
    }
    
    // 处理流式响应
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    
    if (!reader) {
      throw new Error('无法获取响应流');
    }
    
    let buffer = '';
    
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
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
            return;
          }
          
          try {
            const data = JSON.parse(dataStr);
            
            // 提取内容
            if (data.choices && data.choices[0] && data.choices[0].delta) {
              const content = data.choices[0].delta.content;
              
              if (content) {
                onStream(content);
              }
            }
          } catch (e) {
            console.error('解析流数据失败:', e);
          }
        }
      }
    }
  } catch (error) {
    console.error('API请求错误:', error);
    throw error;
  }
}

/**
 * 非流式发送聊天消息到心流API
 * @param messages - 消息历史
 * @returns Promise<string> - 完整的响应内容
 */
export async function sendChatMessageNonStream(
  messages: ChatMessage[]
): Promise<string> {
  try {
    // 验证配置
    validateConfig();
    
    // 转换消息格式
    const apiMessages = convertMessages(messages);
    
    // 构建请求体
    const requestBody = {
      model: API_CONFIG.model,
      messages: apiMessages,
      stream: false, // 非流式响应
      max_tokens: API_CONFIG.maxTokens,
      temperature: API_CONFIG.temperature,
      top_p: API_CONFIG.topP,
      top_k: API_CONFIG.topK,
      frequency_penalty: API_CONFIG.frequencyPenalty,
    };
    
    // 发送请求
    const response = await fetch(`${API_CONFIG.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API请求失败: ${response.status} - ${errorData.error?.message || '未知错误'}`);
    }
    
    const data = await response.json();
    
    // 提取内容
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content;
    }
    
    throw new Error('API返回了无效的响应格式');
  } catch (error) {
    console.error('API请求错误:', error);
    throw error;
  }
}

/**
 * 带工具调用的聊天消息发送
 * @param messages - 消息历史
 * @param tools - 工具列表
 * @param onStream - 流式响应回调
 * @returns Promise<void>
 */
export async function sendChatMessageWithTools(
  messages: ChatMessage[],
  tools: any[],
  onStream: StreamCallback
): Promise<void> {
  try {
    // 验证配置
    validateConfig();
    
    // 转换消息格式
    const apiMessages = convertMessages(messages);
    
    // 构建请求体
    const requestBody = {
      model: API_CONFIG.model,
      messages: apiMessages,
      stream: true, // 启用流式响应
      tools,
      max_tokens: API_CONFIG.maxTokens,
      temperature: API_CONFIG.temperature,
      top_p: API_CONFIG.topP,
      top_k: API_CONFIG.topK,
      frequency_penalty: API_CONFIG.frequencyPenalty,
    };
    
    // 发送请求
    const response = await fetch(`${API_CONFIG.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API请求失败: ${response.status} - ${errorData.error?.message || '未知错误'}`);
    }
    
    // 处理流式响应
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    
    if (!reader) {
      throw new Error('无法获取响应流');
    }
    
    let buffer = '';
    let toolCalls: any[] = [];
    
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
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
            return;
          }
          
          try {
            const data = JSON.parse(dataStr);
            
            // 提取内容
            if (data.choices && data.choices[0] && data.choices[0].delta) {
              const content = data.choices[0].delta.content;
              
              if (content) {
                onStream(content);
              }
              
              // 处理工具调用
              if (data.choices[0].delta.tool_calls) {
                for (const toolCall of data.choices[0].delta.tool_calls) {
                  if (toolCall.function) {
                    // 累积工具调用信息
                    const index = toolCall.index || 0;
                    if (!toolCalls[index]) {
                      toolCalls[index] = {
                        id: toolCall.id || '',
                        type: 'function',
                        function: {
                          name: toolCall.function.name || '',
                          arguments: toolCall.function.arguments || ''
                        }
                      };
                    } else {
                      if (toolCall.function.name) {
                        toolCalls[index].function.name += toolCall.function.name;
                      }
                      if (toolCall.function.arguments) {
                        toolCalls[index].function.arguments += toolCall.function.arguments;
                      }
                    }
                  }
                }
              }
            }
          } catch (e) {
            console.error('解析流数据失败:', e);
          }
        }
      }
    }
    
    // 如果有工具调用，可以在这里处理
    if (toolCalls.length > 0) {
      console.log('工具调用:', toolCalls);
    }
  } catch (error) {
    console.error('API请求错误:', error);
    throw error;
  }
}