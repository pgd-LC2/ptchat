// 聊天相关的 React Hook

import { useState, useCallback, useRef } from 'react';
import { chatService } from '../api';
import { ChatMessage } from '../../components/chat/ChatView';

export interface UseChatOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

export function useChat(options: UseChatOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (content: string, useStream = true) => {
      if (isLoading) return;

      const userMessage: ChatMessage = {
        id: `user_${Date.now()}`,
        role: 'user',
        content,
      };

      const assistantMessage: ChatMessage = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        content: '',
      };

      // 添加用户消息和空的助手消息
      setMessages(prev => [...prev, userMessage, assistantMessage]);
      setIsLoading(true);
      setError(null);

      // 创建新的 AbortController
      abortControllerRef.current = new AbortController();

      try {
        if (useStream) {
          // 流式响应
          await chatService.sendMessageStream(
            {
              messages: [...messages, userMessage],
              model: options.model,
              temperature: options.temperature,
              max_tokens: options.max_tokens,
              stream: true,
            },
            // onChunk
            (chunk: string) => {
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === assistantMessage.id
                    ? { ...msg, content: msg.content + chunk }
                    : msg
                )
              );
            },
            // onComplete
            () => {
              setIsLoading(false);
            },
            // onError
            (error: Error) => {
              setError(error.message);
              setIsLoading(false);
              // 移除空的助手消息
              setMessages(prev => prev.filter(msg => msg.id !== assistantMessage.id));
            }
          );
        } else {
          // 非流式响应
          const response = await chatService.sendMessage({
            messages: [...messages, userMessage],
            model: options.model,
            temperature: options.temperature,
            max_tokens: options.max_tokens,
            stream: false,
          });

          const assistantContent = response.choices[0]?.message?.content || '抱歉，我无法理解您的请求。';

          setMessages(prev =>
            prev.map(msg =>
              msg.id === assistantMessage.id
                ? { ...msg, content: assistantContent }
                : msg
            )
          );
          setIsLoading(false);
        }
      } catch (error) {
        console.error('发送消息失败:', error);
        setError(error instanceof Error ? error.message : '发送消息失败');
        setIsLoading(false);
        // 移除空的助手消息
        setMessages(prev => prev.filter(msg => msg.id !== assistantMessage.id));
      }
    },
    [messages, isLoading, options]
  );

  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    stopGeneration,
    clearMessages,
  };
}