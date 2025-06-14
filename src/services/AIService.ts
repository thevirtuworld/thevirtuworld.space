export interface AIResponse {
  action: string;
  reasoning?: string;
  confidence?: number;
}

export class AIService {
  private provider: string = 'local';
  private apiKey: string = '';
  private model: string = 'gpt-3.5-turbo';
  private baseURL: string = 'https://api.openai.com/v1';

  constructor() {
    this.loadSettings();
  }

  loadSettings() {
    if (typeof window !== "undefined") {
      const settings = localStorage.getItem('aiSettings');
      if (settings) {
        try {
          const parsed = JSON.parse(settings);
          this.provider = parsed.provider || 'local';
          this.apiKey = parsed.apiKey || '';
          this.model = parsed.model || 'gpt-3.5-turbo';
          this.baseURL = parsed.baseURL || 'https://api.openai.com/v1';
        } catch {}
      }
    }
  }

  updateProvider(provider: string, apiKey?: string, model?: string, baseURL?: string) {
    this.provider = provider || 'local';
    this.apiKey = apiKey || '';
    this.model = model || 'gpt-3.5-turbo';
    this.baseURL = baseURL || 'https://api.openai.com/v1';
    if (typeof window !== "undefined") {
      localStorage.setItem('aiSettings', JSON.stringify({
        provider: this.provider,
        apiKey: this.apiKey,
        model: this.model,
        baseURL: this.baseURL,
      }));
    }
  }

  isAIEnabled(): boolean {
    return this.provider !== 'local' && !!this.apiKey;
  }

  getProviderName(): string {
    return this.provider === 'local' ? 'Local AI' : this.provider;
  }

  getCurrentSettings() {
    return {
      provider: this.provider,
      apiKey: this.apiKey,
      model: this.model,
      baseURL: this.baseURL,
    };
  }

  async generateEntityDecision(entityState: any, worldContext: any): Promise<AIResponse | null> {
    if (!this.isAIEnabled()) {
      // Fallback: local rule-based AI
      return this.localDecision(entityState, worldContext);
    }
    if (this.provider === 'openai') {
      try {
        const prompt = this.buildPrompt(entityState, worldContext);
        const response = await fetch(`${this.baseURL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: this.model,
            messages: [
              {
                role: 'system',
                content: 'You are an AI controlling entities in a 2D life simulation. Respond with JSON containing action, reasoning, and confidence (0-1).'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 150
          })
        });
        if (!response.ok) throw new Error('OpenAI API error');
        const data = await response.json();
        const content = data.choices[0]?.message?.content;
        if (content) {
          return JSON.parse(content);
        }
      } catch (e) {
        // Fallback to local AI on error
        return this.localDecision(entityState, worldContext);
      }
    }
    // Add more providers here as needed
    return this.localDecision(entityState, worldContext);
  }

  private buildPrompt(entity: any, context: any): string {
    return `Entity Status:
- Health: ${entity.health}/100
- Food: ${entity.food}/100
- Resources: Wood(${entity.wood}), Stone(${entity.stone})
- Level: ${entity.level}
- Personality: Aggression(${(entity.aiPersonality.aggression * 100).toFixed(0)}%), Cooperation(${(entity.aiPersonality.cooperation * 100).toFixed(0)}%), Exploration(${(entity.aiPersonality.exploration * 100).toFixed(0)}%), Efficiency(${(entity.aiPersonality.efficiency * 100).toFixed(0)}%)

World Context:
- Weather: ${context.weather}
- Season: ${context.season}
- Time: ${context.timeOfDay}
- Nearby entities: ${context.nearbyEntities}
- Available resources: ${context.availableResources}

Choose the best action: gather, build, explore, communicate, or defend.
Respond with JSON: {"action": "action_name", "reasoning": "why this action", "confidence": 0.8}`;
  }

  private localDecision(entity: any, context: any): AIResponse {
    // Simple rule-based fallback
    if (entity.health < 30) {
      return { action: 'gather', reasoning: 'Low health, need food', confidence: 0.9 };
    }
    if (entity.food < 20) {
      return { action: 'gather', reasoning: 'Low food reserves', confidence: 0.8 };
    }
    if (entity.wood >= 50 && entity.stone >= 30) {
      return { action: 'build', reasoning: 'Have enough resources to build', confidence: 0.7 };
    }
    if (context.nearbyEntities > 0 && entity.aiPersonality.cooperation > 0.6) {
      return { action: 'communicate', reasoning: 'Social entity with nearby companions', confidence: 0.6 };
    }
    return { action: 'explore', reasoning: 'Default exploration behavior', confidence: 0.6 };
  }
}

// Export singleton instance
export const aiService = new AIService();
      if (settings) {
        const { provider, apiKey, model, baseURL } = JSON.parse(settings);
        this.updateProvider(provider, apiKey, model, baseURL);
      }
    } catch (error) {
      console.warn('Failed to load AI settings:', error);
    }
  }

  updateProvider(providerName: string, apiKey?: string, model?: string, baseURL?: string): void {
    switch (providerName.toLowerCase()) {
      case 'openai':
        if (apiKey) {
          this.currentProvider = new OpenAIProvider(apiKey, model, baseURL);
        }
        break;
      case 'local':
      default:
        this.currentProvider = this.fallbackProvider;
        break;
    }

    // Save settings to localStorage
    try {
      localStorage.setItem('aiSettings', JSON.stringify({
        provider: providerName,
        apiKey,
        model,
        baseURL
      }));
    } catch (error) {
      console.warn('Failed to save AI settings:', error);
    }
  }

  async generateEntityDecision(entity: any, context: any): Promise<any> {
    try {
      const result = await this.currentProvider.generateEntityDecision(entity, context);
      if (result && result.confidence > 0.3) {
        return result;
      }
    } catch (error) {
      console.warn('Primary AI provider failed, using fallback:', error);
    }

    // Always fall back to local AI
    return this.fallbackProvider.generateEntityDecision(entity, context);
  }

  isAIEnabled(): boolean {
    return this.currentProvider.isEnabled();
  }

  getProviderName(): string {
    return this.currentProvider.name;
  }

  getCurrentSettings(): any {
    try {
      const settings = localStorage.getItem('aiSettings');
      return settings ? JSON.parse(settings) : { provider: 'local' };
    } catch {
      return { provider: 'local' };
    }
  }
}

// Export singleton instance
export const aiService = new AIService();
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
