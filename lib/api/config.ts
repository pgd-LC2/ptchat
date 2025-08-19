// API 配置文件

export const API_CONFIG = {
  // OpenAI API 配置
  OPENAI: {
    BASE_URL: 'https://api.openai.com/v1',
    MODEL: 'gpt-3.5-turbo',
    MAX_TOKENS: 1000,
    TEMPERATURE: 0.7,
  },

  // 自定义 API 配置
  CUSTOM: {
    BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
    TIMEOUT: 30000, // 30秒超时
  },

  // 请求配置
  REQUEST: {
    TIMEOUT: 30000,
    RETRY_COUNT: 3,
    RETRY_DELAY: 1000,
  },
} as const;

// 环境变量验证
export function validateApiConfig() {
  const requiredEnvVars = [
    'OPENAI_API_KEY',
    // 添加其他必需的环境变量
  ];

  const missing = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missing.length > 0) {
    console.warn(
      `Missing environment variables: ${missing.join(', ')}`
    );
  }

  return missing.length === 0;
}

// 获取 API Key
export function getApiKey(provider: 'openai' | 'custom' = 'openai'): string {
  switch (provider) {
    case 'openai':
      return process.env.OPENAI_API_KEY || '';
    case 'custom':
      return process.env.CUSTOM_API_KEY || '';
    default:
      return '';
  }
}