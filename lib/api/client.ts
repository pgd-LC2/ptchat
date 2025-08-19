// API 客户端配置
export class ApiClient {
  private baseUrl: string;
  private apiKey?: string;

  constructor(baseUrl: string = '/api', apiKey?: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      defaultHeaders['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get(endpoint: string, options?: RequestInit) {
    return this.makeRequest(endpoint, { method: 'GET', ...options });
  }

  async post(endpoint: string, data?: any, options?: RequestInit) {
    return this.makeRequest(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  async put(endpoint: string, data?: any, options?: RequestInit) {
    return this.makeRequest(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  async delete(endpoint: string, options?: RequestInit) {
    return this.makeRequest(endpoint, { method: 'DELETE', ...options });
  }
}

// 默认API客户端实例
export const apiClient = new ApiClient();