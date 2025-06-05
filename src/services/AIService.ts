interface AIResponse {
  action: string;
  reasoning?: string;
  confidence: number;
  metadata?: Record<string, any>;
}

interface AIProvider {
  name: string;
  generateDecision(context: string, prompt: string): Promise<AIResponse>;
  isAvailable(): Promise<boolean>;
}

class OpenAIProvider implements AIProvider {
  name = 'OpenAI';
  private apiKey: string;
  private model: string;
  private baseURL: string;

  constructor(apiKey: string, model: string = 'gpt-4', baseURL?: string) {
    this.apiKey = apiKey;
    this.model = model;
    this.baseURL = baseURL || 'https://api.openai.com/v1';
  }

  async isAvailable(): Promise<boolean> {
    if (!this.apiKey) return false;
    try {
      const response = await fetch(`${this.baseURL}/models`, {
        headers: { 'Authorization': `Bearer ${this.apiKey}` }
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async generateDecision(context: string, prompt: string): Promise<AIResponse> {
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: context },
          { role: 'user', content: prompt }
        ],
        temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
        max_tokens: parseInt(process.env.AI_MAX_TOKENS || '512')
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    
    return this.parseAIResponse(content);
  }

  private parseAIResponse(content: string): AIResponse {
    try {
      // Try to parse JSON response
      const parsed = JSON.parse(content);
      return {
        action: parsed.action || 'explore',
        reasoning: parsed.reasoning,
        confidence: parsed.confidence || 0.5,
        metadata: parsed.metadata
      };
    } catch {
      // Fallback to text parsing
      const action = this.extractAction(content);
      return {
        action,
        reasoning: content,
        confidence: 0.6
      };
    }
  }

  private extractAction(content: string): string {
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes('gather') || lowerContent.includes('collect')) return 'gather';
    if (lowerContent.includes('build') || lowerContent.includes('construct')) return 'build';
    if (lowerContent.includes('explore') || lowerContent.includes('search')) return 'explore';
    if (lowerContent.includes('communicate') || lowerContent.includes('talk')) return 'communicate';
    if (lowerContent.includes('attack') || lowerContent.includes('fight')) return 'defend';
    return 'explore';
  }
}

class OllamaProvider implements AIProvider {
  name = 'Ollama';
  private host: string;
  private model: string;

  constructor(host: string = 'http://localhost:11434', model: string = 'llama2') {
    this.host = host;
    this.model = model;
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.host}/api/tags`);
      return response.ok;
    } catch {
      return false;
    }
  }

  async generateDecision(context: string, prompt: string): Promise<AIResponse> {
    const response = await fetch(`${this.host}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        prompt: `${context}\n\n${prompt}`,
        stream: false,
        options: {
          temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
          num_predict: parseInt(process.env.AI_MAX_TOKENS || '512')
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.response || '';
    
    return this.parseResponse(content);
  }

  private parseResponse(content: string): AIResponse {
    // Similar parsing logic as OpenAI
    const action = this.extractAction(content);
    return {
      action,
      reasoning: content,
      confidence: 0.7
    };
  }

  private extractAction(content: string): string {
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes('gather') || lowerContent.includes('collect')) return 'gather';
    if (lowerContent.includes('build') || lowerContent.includes('construct')) return 'build';
    if (lowerContent.includes('explore') || lowerContent.includes('search')) return 'explore';
    if (lowerContent.includes('communicate') || lowerContent.includes('talk')) return 'communicate';
    if (lowerContent.includes('attack') || lowerContent.includes('fight')) return 'defend';
    return 'explore';
  }
}

class CustomProvider implements AIProvider {
  name = 'Custom';
  private apiUrl: string;
  private apiKey?: string;

  constructor(apiUrl: string, apiKey?: string) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
  }

  async isAvailable(): Promise<boolean> {
    try {
      const headers: Record<string, string> = {};
      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }
      
      const response = await fetch(`${this.apiUrl}/health`, { headers });
      return response.ok;
    } catch {
      return false;
    }
  }

  async generateDecision(context: string, prompt: string): Promise<AIResponse> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const response = await fetch(`${this.apiUrl}/generate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ context, prompt })
    });

    if (!response.ok) {
      throw new Error(`Custom API error: ${response.statusText}`);
    }

    return await response.json();
  }
}

export class AIService {
  private provider?: AIProvider;
  private isEnabled: boolean = false;
  private fallbackEnabled: boolean = true;

  constructor() {
    this.initializeProvider();
  }

  private async initializeProvider(): Promise<void> {
    const providerType = process.env.AI_PROVIDER;
    if (!providerType) {
      console.log('🤖 AI Service: No provider configured, using fallback AI');
      return;
    }

    try {
      switch (providerType.toLowerCase()) {
        case 'openai':
          if (process.env.AI_API_KEY) {
            this.provider = new OpenAIProvider(
              process.env.AI_API_KEY,
              process.env.AI_MODEL,
              process.env.AI_API_BASE_URL
            );
          }
          break;

        case 'ollama':
          this.provider = new OllamaProvider(
            process.env.OLLAMA_HOST,
            process.env.OLLAMA_MODEL
          );
          break;

        case 'custom':
          if (process.env.CUSTOM_AI_API_URL) {
            this.provider = new CustomProvider(
              process.env.CUSTOM_AI_API_URL,
              process.env.CUSTOM_AI_API_KEY
            );
          }
          break;

        case 'azure':
          if (process.env.AZURE_OPENAI_ENDPOINT && process.env.AZURE_OPENAI_KEY) {
            this.provider = new OpenAIProvider(
              process.env.AZURE_OPENAI_KEY,
              process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4',
              `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}`
            );
          }
          break;
      }

      if (this.provider) {
        this.isEnabled = await this.provider.isAvailable();
        console.log(`🤖 AI Service: ${this.provider.name} ${this.isEnabled ? 'connected' : 'unavailable'}`);
      }
    } catch (error) {
      console.warn('🤖 AI Service: Failed to initialize provider:', error);
      this.isEnabled = false;
    }
  }

  async generateEntityDecision(entityState: any, worldContext: any): Promise<AIResponse | null> {
    if (!this.isEnabled || !this.provider) {
      return null; // Graceful fallback
    }

    try {
      const context = this.buildSystemContext();
      const prompt = this.buildEntityPrompt(entityState, worldContext);
      
      return await this.provider.generateDecision(context, prompt);
    } catch (error) {
      console.warn('🤖 AI Service: Decision generation failed:', error);
      return null; // Graceful fallback
    }
  }

  private buildSystemContext(): string {
    return `You are an AI controlling an entity in a 2D survival simulation game. 
Your role is to make intelligent decisions for this entity based on its current state and environment.

Available actions: gather, build, explore, communicate, defend
Response format: {"action": "action_name", "reasoning": "why you chose this", "confidence": 0.8}

Entity behavior guidelines:
- Prioritize survival (food, health, safety)
- Build relationships with other entities when beneficial
- Explore to discover new resources and opportunities
- Build structures when you have sufficient resources
- Defend when threatened

Consider the entity's personality traits when making decisions.`;
  }

  private buildEntityPrompt(entityState: any, worldContext: any): string {
    return `Current Entity State:
- Health: ${entityState.health}/100
- Food: ${entityState.food}/100  
- Resources: Wood(${entityState.wood}), Stone(${entityState.stone})
- Level: ${entityState.level}, Age: ${Math.round(entityState.age)}
- Personality: Aggression(${Math.round(entityState.aiPersonality.aggression * 100)}%), Cooperation(${Math.round(entityState.aiPersonality.cooperation * 100)}%), Exploration(${Math.round(entityState.aiPersonality.exploration * 100)}%), Efficiency(${Math.round(entityState.aiPersonality.efficiency * 100)}%)

World Context:
- Weather: ${worldContext.weather}
- Season: ${worldContext.season}
- Nearby entities: ${worldContext.nearbyEntities}
- Available resources: ${worldContext.availableResources}
- Time of day: ${worldContext.timeOfDay}

What action should this entity take next? Consider its current needs, personality, and the world state.`;
  }

  isAIEnabled(): boolean {
    return this.isEnabled;
  }

  getProviderName(): string {
    return this.provider?.name || 'Fallback';
  }
}

// Singleton instance
export const aiService = new AIService();
