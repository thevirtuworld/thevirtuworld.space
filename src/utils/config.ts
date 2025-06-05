export interface AIConfig {
  provider: string;
  model: string;
  apiKey?: string;
  baseURL?: string;
  temperature: number;
  maxTokens: number;
  enabled: boolean;
}

export function getAIConfig(): AIConfig {
  return {
    provider: process.env.AI_PROVIDER || 'local',
    model: process.env.AI_MODEL || 'gpt-4',
    apiKey: process.env.AI_API_KEY,
    baseURL: process.env.AI_API_BASE_URL,
    temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
    maxTokens: parseInt(process.env.AI_MAX_TOKENS || '512'),
    enabled: Boolean(process.env.AI_PROVIDER && process.env.AI_API_KEY)
  };
}

export function validateAIConfig(config: AIConfig): boolean {
  if (!config.enabled) return false;
  
  switch (config.provider.toLowerCase()) {
    case 'openai':
    case 'azure':
      return Boolean(config.apiKey);
    case 'ollama':
      return true; // Local setup, no API key needed
    case 'custom':
      return Boolean(config.baseURL);
    default:
      return false;
  }
}
