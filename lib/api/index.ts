// API 模块入口文件

export { ApiClient, apiClient } from './client';
export { ChatService, chatService } from './chat';
export { API_CONFIG, validateApiConfig, getApiKey } from './config';
export type {
  ApiError,
  ApiResponse,
  ChatCompletionMessage,
  ChatCompletionRequest,
  ChatCompletionResponse,
  ChatCompletionChunk,
} from './types';

// 便捷导出
export { chatService as chat } from './chat';