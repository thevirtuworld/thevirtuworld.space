export interface AIResponse {
  action: string;
  reasoning?: string;
  confidence?: number;
}

export class AIService {
  private isEnabled: boolean = false;
  private provider: any = null;

  constructor() {
    // Simple fallback AI - no external dependencies
  }

  async generateEntityDecision(entity: any, worldContext: any): Promise<AIResponse> {
    // Simple rule-based AI fallback
    if (entity.health < 30) {
      return { action: 'gather', reasoning: 'Low health, need food', confidence: 0.9 };
    }
    if (entity.food < 20) {
      return { action: 'gather', reasoning: 'Low food reserves', confidence: 0.8 };
    }
    if (entity.wood >= 50 && entity.stone >= 30) {
      return { action: 'build', reasoning: 'Have enough resources to build', confidence: 0.7 };
    }
    if (worldContext.nearbyEntities > 0 && entity.aiPersonality?.cooperation > 0.6) {
      return { action: 'communicate', reasoning: 'Social entity with nearby companions', confidence: 0.6 };
    }
    return { action: 'explore', reasoning: 'Default exploration behavior', confidence: 0.6 };
  }

  isAIEnabled(): boolean {
    return this.isEnabled;
  }

  getProviderName(): string {
    return 'Fallback';
  }

  updateProvider(providerName: string, apiKey?: string, model?: string, baseURL?: string): void {
    // Store settings if needed
    this.isEnabled = !!apiKey && providerName !== 'local';
  }

  getCurrentSettings(): any {
    return { provider: 'local' };
  }
}

// Export singleton instance
export const aiService = new AIService();
