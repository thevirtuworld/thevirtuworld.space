import { Entity, Resource, Building, Task, WorldState } from './GameTypes';
import { aiService } from '../../services/AIService';

interface NeuralNode {
  id: string;
  inputs: number[];
  weights: number[];
  bias: number;
  activation: number;
  type: 'input' | 'hidden' | 'output';
}

interface NeuralNetwork {
  nodes: Map<string, NeuralNode>;
  connections: Array<{from: string; to: string; weight: number}>;
  fitness: number;
}

export class AIBrain {
  private network: NeuralNetwork;
  private memory: Map<string, any>;
  private personality: {
    aggression: number;
    cooperation: number;
    exploration: number;
    efficiency: number;
  };
  
  constructor(dna?: number[]) {
    this.memory = new Map();
    this.personality = this.generatePersonality(dna);
    this.network = this.createNeuralNetwork(dna);
  }
  
  private generatePersonality(dna?: number[]) {
    const base = dna || Array(4).fill(0).map(() => Math.random());
    return {
      aggression: Math.max(0, Math.min(1, base[0] + (Math.random() - 0.5) * 0.2)),
      cooperation: Math.max(0, Math.min(1, base[1] + (Math.random() - 0.5) * 0.2)),
      exploration: Math.max(0, Math.min(1, base[2] + (Math.random() - 0.5) * 0.2)),
      efficiency: Math.max(0, Math.min(1, base[3] + (Math.random() - 0.5) * 0.2))
    };
  }
  
  private createNeuralNetwork(dna?: number[]): NeuralNetwork {
    const nodes = new Map<string, NeuralNode>();
    const connections: Array<{from: string; to: string; weight: number}> = [];
    
    // Input nodes
    ['hunger', 'safety', 'resources', 'social', 'exploration'].forEach((type, i) => {
      nodes.set(`input_${type}`, {
        id: `input_${type}`,
        inputs: [],
        weights: [],
        bias: 0,
        activation: 0,
        type: 'input'
      });
    });
    
    // Hidden layer
    for (let i = 0; i < 8; i++) {
      nodes.set(`hidden_${i}`, {
        id: `hidden_${i}`,
        inputs: [],
        weights: Array(5).fill(0).map(() => (Math.random() - 0.5) * 2),
        bias: (Math.random() - 0.5) * 2,
        activation: 0,
        type: 'hidden'
      });
    }
    
    // Output nodes
    ['move', 'gather', 'build', 'communicate', 'attack', 'defend'].forEach((action, i) => {
      nodes.set(`output_${action}`, {
        id: `output_${action}`,
        inputs: [],
        weights: Array(8).fill(0).map(() => (Math.random() - 0.5) * 2),
        bias: (Math.random() - 0.5) * 2,
        activation: 0,
        type: 'output'
      });
    });
    
    return { nodes, connections, fitness: 0 };
  }
  
  makeDecision(inputs: {
    hunger: number;
    safety: number;
    resources: number;
    social: number;
    exploration: number;
  }): {action: string; intensity: number; target?: any} {
    // Forward propagation through neural network
    const inputNodes = ['hunger', 'safety', 'resources', 'social', 'exploration'];
    const hiddenNodes = Array(8).fill(0).map((_, i) => `hidden_${i}`);
    const outputNodes = ['move', 'gather', 'build', 'communicate', 'attack', 'defend'];
    
    // Set input activations
    inputNodes.forEach((nodeType) => {
      const node = this.network.nodes.get(`input_${nodeType}`);
      if (node) {
        node.activation = inputs[nodeType as keyof typeof inputs];
      }
    });
    
    // Process hidden layer
    hiddenNodes.forEach((nodeId) => {
      const node = this.network.nodes.get(nodeId);
      if (node) {
        let sum = node.bias;
        inputNodes.forEach((inputType, i) => {
          const inputNode = this.network.nodes.get(`input_${inputType}`);
          if (inputNode) {
            sum += inputNode.activation * node.weights[i];
          }
        });
        node.activation = this.sigmoid(sum);
      }
    });
    
    // Process output layer
    const decisions: {action: string; activation: number}[] = [];
    outputNodes.forEach((actionType) => {
      const node = this.network.nodes.get(`output_${actionType}`);
      if (node) {
        let sum = node.bias;
        hiddenNodes.forEach((hiddenId, i) => {
          const hiddenNode = this.network.nodes.get(hiddenId);
          if (hiddenNode) {
            sum += hiddenNode.activation * node.weights[i];
          }
        });
        node.activation = this.sigmoid(sum);
        decisions.push({ action: actionType, activation: node.activation });
      }
    });
    
    // Apply personality modifiers
    decisions.forEach(decision => {
      switch (decision.action) {
        case 'attack':
          decision.activation *= this.personality.aggression;
          break;
        case 'communicate':
          decision.activation *= this.personality.cooperation;
          break;
        case 'move':
          decision.activation *= this.personality.exploration;
          break;
        case 'gather':
        case 'build':
          decision.activation *= this.personality.efficiency;
          break;
      }
    });
    
    // Select highest activation
    const bestDecision = decisions.reduce((prev, current) => 
      current.activation > prev.activation ? current : prev
    );
    
    // Store in memory for learning
    this.memory.set('lastDecision', {
      inputs,
      action: bestDecision.action,
      intensity: bestDecision.activation,
      timestamp: Date.now()
    });
    
    return {
      action: bestDecision.action,
      intensity: bestDecision.activation,
      target: this.selectTarget(bestDecision.action, inputs)
    };
  }
  
  private sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x));
  }
  
  private selectTarget(action: string, inputs: any): any {
    // AI target selection based on action and current state
    switch (action) {
      case 'move':
        return this.selectMoveTarget(inputs);
      case 'gather':
        return this.selectResourceTarget();
      case 'build':
        return this.selectBuildTarget();
      default:
        return null;
    }
  }
  
  private selectMoveTarget(inputs: any): {x: number; y: number} {
    // Intelligent movement based on needs
    if (inputs.hunger > 0.7) {
      // Move towards food sources
      return { x: Math.random() * 800, y: Math.random() * 600 };
    }
    if (inputs.safety < 0.3) {
      // Move to safer areas
      return { x: 400 + (Math.random() - 0.5) * 100, y: 300 + (Math.random() - 0.5) * 100 };
    }
    // Exploration
    return { x: Math.random() * 800, y: Math.random() * 600 };
  }
  
  private selectResourceTarget(): string {
    return ['food', 'wood', 'stone', 'water'][Math.floor(Math.random() * 4)];
  }
  
  private selectBuildTarget(): string {
    return ['house', 'farm', 'wall', 'workshop'][Math.floor(Math.random() * 4)];
  }
  
  learn(reward: number, punishment: number = 0) {
    // Simple reinforcement learning
    const lastDecision = this.memory.get('lastDecision');
    if (!lastDecision) return;
    
    const learningRate = 0.1;
    const netReward = reward - punishment;
    
    // Adjust weights based on outcome
    this.network.nodes.forEach(node => {
      if (node.type === 'output') {
        node.weights = node.weights.map(weight => 
          weight + learningRate * netReward * (Math.random() - 0.5) * 0.1
        );
        node.bias += learningRate * netReward * (Math.random() - 0.5) * 0.1;
      }
    });
    
    // Update fitness
    this.network.fitness += netReward;
  }
  
  mutate(rate: number = 0.1): AIBrain {
    // Genetic algorithm mutation
    const newDNA = [
      this.personality.aggression,
      this.personality.cooperation,
      this.personality.exploration,
      this.personality.efficiency
    ].map(trait => {
      if (Math.random() < rate) {
        return Math.max(0, Math.min(1, trait + (Math.random() - 0.5) * 0.4));
      }
      return trait;
    });
    
    return new AIBrain(newDNA);
  }
  
  getPersonality() {
    return { ...this.personality };
  }
  
  getFitness(): number {
    return this.network.fitness;
  }
}

export class AIColonyManager {
  private entities: Map<string, Entity>;
  private brains: Map<string, AIBrain>;
  private generation: number;
  private evolutionTimer: number;
  
  constructor() {
    this.entities = new Map();
    this.brains = new Map();
    this.generation = 1;
    this.evolutionTimer = 0;
  }
  
  addEntity(entity: Entity): void {
    this.entities.set(entity.id, entity);
    this.brains.set(entity.id, new AIBrain());
  }
  
  updateAI(deltaTime: number): void {
    this.evolutionTimer += deltaTime;
    
    // Update each entity's AI
    this.entities.forEach((entity, id) => {
      const brain = this.brains.get(id);
      if (!brain) return;
      
      // Calculate inputs for AI decision making
      const inputs = this.calculateInputs(entity);
      
      // Get AI decision
      const decision = brain.makeDecision(inputs);
      
      // Execute decision
      this.executeDecision(entity, decision);
      
      // Provide feedback for learning
      const reward = this.calculateReward(entity);
      const punishment = this.calculatePunishment(entity);
      brain.learn(reward, punishment);
    });
    
    // Evolution every 30 seconds
    if (this.evolutionTimer > 30000) {
      this.evolvePopulation();
      this.evolutionTimer = 0;
    }
  }
  
  private calculateInputs(entity: Entity): any {
    return {
      hunger: Math.max(0, 1 - entity.food / 100),
      safety: entity.health / 100,
      resources: Math.min(1, (entity.wood + entity.stone) / 200),
      social: Math.min(1, entity.relationships.size / 10),
      exploration: Math.min(1, entity.exploredAreas.size / 50)
    };
  }
  
  private executeDecision(entity: Entity, decision: any): void {
    // Execute AI decisions in the game world
    switch (decision.action) {
      case 'move':
        if (decision.target) {
          entity.targetX = decision.target.x;
          entity.targetY = decision.target.y;
          entity.isMoving = true;
        }
        break;
      case 'gather':
        entity.currentTask = { type: 'gather', resource: decision.target };
        break;
      case 'build':
        entity.currentTask = { type: 'build', structure: decision.target };
        break;
      case 'communicate':
        this.handleCommunication(entity);
        break;
    }
  }
  
  private handleCommunication(entity: Entity): void {
    // AI entities can share information and coordinate
    const nearbyEntities = Array.from(this.entities.values()).filter(other => 
      other.id !== entity.id && 
      Math.abs(other.x - entity.x) < 100 && 
      Math.abs(other.y - entity.y) < 100
    );
    
    nearbyEntities.forEach(other => {
      // Share knowledge
      entity.exploredAreas.forEach(area => other.exploredAreas.add(area));
      
      // Build relationships
      if (!entity.relationships.has(other.id)) {
        entity.relationships.set(other.id, 0.1);
      } else {
        const current = entity.relationships.get(other.id) || 0;
        entity.relationships.set(other.id, Math.min(1, current + 0.1));
      }
    });
  }
  
  private calculateReward(entity: Entity): number {
    let reward = 0;
    
    // Survival rewards
    if (entity.health > 80) reward += 0.2;
    if (entity.food > 80) reward += 0.2;
    
    // Progress rewards
    reward += entity.buildings.length * 0.1;
    reward += (entity.wood + entity.stone) * 0.001;
    
    // Social rewards
    reward += entity.relationships.size * 0.05;
    
    return reward;
  }
  
  private calculatePunishment(entity: Entity): number {
    let punishment = 0;
    
    // Survival penalties
    if (entity.health < 20) punishment += 0.5;
    if (entity.food < 20) punishment += 0.5;
    
    // Stagnation penalty
    if (entity.buildings.length === 0 && entity.age > 100) punishment += 0.2;
    
    return punishment;
  }
  
  private evolvePopulation(): void {
    const brainArray = Array.from(this.brains.entries());
    
    // Sort by fitness
    brainArray.sort((a, b) => b[1].getFitness() - a[1].getFitness());
    
    // Keep top 50% and evolve the rest
    const keepCount = Math.floor(brainArray.length / 2);
    
    for (let i = keepCount; i < brainArray.length; i++) {
      const parentIndex = Math.floor(Math.random() * keepCount);
      const parent = brainArray[parentIndex][1];
      const newBrain = parent.mutate(0.2);
      this.brains.set(brainArray[i][0], newBrain);
    }
    
    this.generation++;
    console.log(`Evolution complete. Generation: ${this.generation}`);
  }
  
  getGeneration(): number {
    return this.generation;
  }
  
  getTopPerformers(): Array<{id: string; fitness: number; personality: any}> {
    return Array.from(this.brains.entries())
      .map(([id, brain]) => ({
        id,
        fitness: brain.getFitness(),
        personality: brain.getPersonality()
      }))
      .sort((a, b) => b.fitness - a.fitness)
      .slice(0, 5);
  }
}

export class AIEngine {
  private decisionCooldowns: Map<string, number> = new Map();
  private readonly DECISION_INTERVAL = 30; // frames between decisions
  private aiEnhancedEntities: Set<string> = new Set();

  updateEntity(entity: Entity, worldState: WorldState, deltaTime: number): void {
    // Update cooldown
    const cooldown = this.decisionCooldowns.get(entity.id) || 0;
    this.decisionCooldowns.set(entity.id, Math.max(0, cooldown - 1));

    // Update current task
    if (entity.currentTask) {
      this.updateTask(entity, worldState, deltaTime);
    }

    // Make new decisions if cooldown is over
    if (cooldown <= 0) {
      this.makeDecision(entity, worldState);
      this.decisionCooldowns.set(entity.id, this.DECISION_INTERVAL);
    }

    // Update entity state
    this.updateEntityState(entity, worldState, deltaTime);
  }

  private makeDecision(entity: Entity, worldState: WorldState): void {
    // Skip if already has a task
    if (entity.currentTask && entity.currentTask.progress < 1) {
      return;
    }

    // Try AI-enhanced decision making (async, non-blocking)
    this.tryAIDecision(entity, worldState);

    // Always make a local decision as fallback
    const decisions = this.evaluateOptions(entity, worldState);
    const bestDecision = this.selectBestDecision(decisions, entity);

    if (bestDecision) {
      entity.currentTask = bestDecision;
    }
  }

  private async tryAIDecision(entity: Entity, worldState: WorldState): Promise<void> {
    try {
      const worldContext = this.buildWorldContext(entity, worldState);
      const aiResponse = await aiService.generateEntityDecision(entity, worldContext);
      
      if (aiResponse && aiResponse.confidence > 0.5) {
        const task = this.convertAIResponseToTask(aiResponse, entity, worldState);
        if (task) {
          entity.currentTask = task;
          this.aiEnhancedEntities.add(entity.id);
        }
      }
    } catch (error) {
      // Silently fail - local AI will handle it
    }
  }

  private evaluateOptions(entity: Entity, worldState: WorldState): Task[] {
    const options: Task[] = [];

    // Gather food if hungry
    if (entity.food < 30) {
      const foodResource = this.findNearestResource(entity, worldState, 'food');
      if (foodResource) {
        options.push({
          type: 'gather',
          resource: 'food',
          target: { x: foodResource.x, y: foodResource.y },
          progress: 0,
          duration: 60
        });
      }
    }

    // Gather wood if needed
    if (entity.wood < 20) {
      const woodResource = this.findNearestResource(entity, worldState, 'wood');
      if (woodResource) {
        options.push({
          type: 'gather',
          resource: 'wood',
          target: { x: woodResource.x, y: woodResource.y },
          progress: 0,
          duration: 80
        });
      }
    }

    // Build house if homeless and has resources
    if (entity.buildings.length === 0 && entity.wood >= 50 && entity.stone >= 30) {
      const buildSite = this.findBuildingSite(entity, worldState);
      options.push({
        type: 'build',
        structure: 'house',
        target: buildSite,
        progress: 0,
        duration: 120
      });
    }

    // Explore if exploration personality is high
    if (entity.aiPersonality.exploration > 0.6) {
      const unexploredArea = this.findUnexploredArea(entity, worldState);
      if (unexploredArea) {
        options.push({
          type: 'explore',
          target: unexploredArea,
          progress: 0,
          duration: 100
        });
      }
    }

    // Communicate with nearby entities
    const nearbyEntities = this.findNearbyEntities(entity, worldState, 50);
    if (nearbyEntities.length > 0 && entity.aiPersonality.cooperation > 0.5) {
      const target = nearbyEntities[0];
      options.push({
        type: 'communicate',
        target: { x: target.x, y: target.y },
        progress: 0,
        duration: 40
      });
    }

    return options;
  }

  private selectBestDecision(options: Task[], entity: Entity): Task | null {
    if (options.length === 0) return null;

    const scoredOptions = options.map(option => ({
      task: option,
      score: this.scoreTask(option, entity)
    }));

    scoredOptions.sort((a, b) => b.score - a.score);
    return scoredOptions[0].task;
  }

  private scoreTask(task: Task, entity: Entity): number {
    let score = 0;

    switch (task.type) {
      case 'gather':
        if (task.resource === 'food' && entity.food < 50) {
          score = 100 - entity.food;
        } else if (task.resource === 'wood' && entity.wood < 30) {
          score = 50 - entity.wood;
        } else if (task.resource === 'stone' && entity.stone < 30) {
          score = 40 - entity.stone;
        }
        break;

      case 'build':
        if (entity.buildings.length === 0) {
          score = 80;
        } else {
          score = 30;
        }
        break;

      case 'explore':
        score = entity.aiPersonality.exploration * 60;
        break;

      case 'communicate':
        score = entity.aiPersonality.cooperation * 40;
        break;

      case 'defend':
        score = entity.aiPersonality.aggression * 70;
        break;
    }

    score += (Math.random() - 0.5) * 10;
    return score;
  }

  private buildWorldContext(entity: Entity, worldState: WorldState): any {
    const nearbyEntities = this.findNearbyEntities(entity, worldState, 100).length;
    const nearbyResources = Array.from(worldState.resources.values())
      .filter(resource => this.getDistance(entity, resource) < 100)
      .map(resource => `${resource.type}(${Math.round(resource.amount)})`);

    const timeOfDay = this.calculateTimeOfDay(worldState.time);

    return {
      weather: worldState.weather,
      season: worldState.season,
      nearbyEntities,
      availableResources: nearbyResources.join(', '),
      timeOfDay,
      generation: worldState.generation,
      totalEntities: worldState.entities.size
    };
  }

  private calculateTimeOfDay(gameTime: number): string {
    const hour = (gameTime / 10) % 24;
    if (hour < 6) return 'night';
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  }

  private convertAIResponseToTask(aiResponse: any, entity: Entity, worldState: WorldState): Task | null {
    const action = aiResponse.action.toLowerCase();

    switch (action) {
      case 'gather':
        return this.createGatherTask(entity, worldState, aiResponse);
      case 'build':
        return this.createBuildTask(entity, worldState, aiResponse);
      case 'explore':
        return this.createExploreTask(entity, worldState, aiResponse);
      case 'communicate':
        return this.createCommunicateTask(entity, worldState, aiResponse);
      case 'defend':
        return this.createDefendTask(entity, worldState, aiResponse);
      default:
        return null;
    }
  }

  private createGatherTask(entity: Entity, worldState: WorldState, aiResponse: any): Task | null {
    let resourceType = 'food';
    
    if (aiResponse.reasoning) {
      const reasoning = aiResponse.reasoning.toLowerCase();
      if (reasoning.includes('wood')) resourceType = 'wood';
      else if (reasoning.includes('stone')) resourceType = 'stone';
      else if (reasoning.includes('water')) resourceType = 'water';
      else if (reasoning.includes('gold')) resourceType = 'gold';
    }

    const resource = this.findNearestResource(entity, worldState, resourceType);
    if (!resource) return null;

    return {
      type: 'gather',
      resource: resourceType,
      target: { x: resource.x, y: resource.y },
      progress: 0,
      duration: 60
    };
  }

  private createBuildTask(entity: Entity, worldState: WorldState, aiResponse: any): Task | null {
    let structureType = 'house';
    
    if (aiResponse.reasoning) {
      const reasoning = aiResponse.reasoning.toLowerCase();
      if (reasoning.includes('farm')) structureType = 'farm';
      else if (reasoning.includes('workshop')) structureType = 'workshop';
      else if (reasoning.includes('wall')) structureType = 'wall';
      else if (reasoning.includes('tower')) structureType = 'tower';
    }

    const requiredResources = this.getBuildingRequirements(structureType);
    if (!this.hasRequiredResources(entity, requiredResources)) {
      return null;
    }

    const buildSite = this.findBuildingSite(entity, worldState);
    return {
      type: 'build',
      structure: structureType,
      target: buildSite,
      progress: 0,
      duration: 120
    };
  }

  private createExploreTask(entity: Entity, worldState: WorldState, aiResponse: any): Task | null {
    let unexploredArea = this.findUnexploredArea(entity, worldState);
    if (!unexploredArea) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 100 + Math.random() * 100;
      unexploredArea = {
        x: entity.x + Math.cos(angle) * distance,
        y: entity.y + Math.sin(angle) * distance
      };
    }

    return {
      type: 'explore',
      target: unexploredArea,
      progress: 0,
      duration: 100
    };
  }

  private createCommunicateTask(entity: Entity, worldState: WorldState, aiResponse: any): Task | null {
    const nearbyEntities = this.findNearbyEntities(entity, worldState, 50);
    if (nearbyEntities.length === 0) return null;

    const target = nearbyEntities[0];
    return {
      type: 'communicate',
      target: { x: target.x, y: target.y },
      progress: 0,
      duration: 40
    };
  }

  private createDefendTask(entity: Entity, worldState: WorldState, aiResponse: any): Task | null {
    const nearbyEntities = this.findNearbyEntities(entity, worldState, 30);
    const hostileEntities = nearbyEntities.filter(other => 
      other.aiPersonality.aggression > 0.7
    );

    if (hostileEntities.length > 0) {
      const threat = hostileEntities[0];
      return {
        type: 'defend',
        target: { x: threat.x, y: threat.y },
        progress: 0,
        duration: 60
      };
    }

    return null;
  }

  private getBuildingRequirements(structureType: string): {wood: number, stone: number} {
    const requirements = {
      house: { wood: 50, stone: 30 },
      farm: { wood: 30, stone: 20 },
      workshop: { wood: 70, stone: 50 },
      wall: { wood: 20, stone: 40 },
      tower: { wood: 80, stone: 100 }
    };
    return requirements[structureType as keyof typeof requirements] || { wood: 50, stone: 30 };
  }

  private hasRequiredResources(entity: Entity, requirements: {wood: number, stone: number}): boolean {
    return entity.wood >= requirements.wood && entity.stone >= requirements.stone;
  }

  getAIStats(): {enhancedEntities: number, provider: string, enabled: boolean} {
    return {
      enhancedEntities: this.aiEnhancedEntities.size,
      provider: aiService.getProviderName(),
      enabled: aiService.isAIEnabled()
    };
  }

  private updateTask(entity: Entity, worldState: WorldState, deltaTime: number): void {
    if (!entity.currentTask) return;

    const task = entity.currentTask;
    const progressRate = this.getTaskProgressRate(entity, task);
    
    task.progress += progressRate * deltaTime;

    if (task.target) {
      this.moveTowardsTarget(entity, task.target);
    }

    if (task.progress >= 1) {
      this.completeTask(entity, task, worldState);
      entity.currentTask = undefined;
    }
  }

  private getTaskProgressRate(entity: Entity, task: Task): number {
    const baseRate = 1 / task.duration;
    const efficiencyMultiplier = 0.5 + entity.aiPersonality.efficiency;
    return baseRate * efficiencyMultiplier;
  }

  private moveTowardsTarget(entity: Entity, target: { x: number; y: number }): void {
    const dx = target.x - entity.x;
    const dy = target.y - entity.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 2) {
      const moveDistance = entity.speed;
      entity.targetX = entity.x + (dx / distance) * moveDistance;
      entity.targetY = entity.y + (dy / distance) * moveDistance;
      entity.isMoving = true;
    } else {
      entity.isMoving = false;
    }
  }

  private completeTask(entity: Entity, task: Task, worldState: WorldState): void {
    switch (task.type) {
      case 'gather':
        this.completeGatherTask(entity, task, worldState);
        break;
      case 'build':
        this.completeBuildTask(entity, task, worldState);
        break;
      case 'explore':
        this.completeExploreTask(entity, task);
        break;
      case 'communicate':
        this.completeCommunicateTask(entity, task, worldState);
        break;
    }

    entity.experience += 10;
    if (entity.experience >= entity.level * 100) {
      entity.level++;
      entity.experience = 0;
    }
  }

  private completeGatherTask(entity: Entity, task: Task, worldState: WorldState): void {
    if (!task.resource || !task.target) return;

    const resource = this.findResourceAt(task.target, worldState);
    if (resource && resource.amount > 0) {
      const gathered = Math.min(resource.amount, 10 + entity.level * 2);
      resource.amount -= gathered;

      switch (task.resource) {
        case 'food':
          entity.food = Math.min(100, entity.food + gathered);
          break;
        case 'wood':
          entity.wood += gathered;
          break;
        case 'stone':
          entity.stone += gathered;
          break;
      }
    }
  }

  private completeBuildTask(entity: Entity, task: Task, worldState: WorldState): void {
    if (!task.structure || !task.target) return;

    const requirements = this.getBuildingRequirements(task.structure);
    if (entity.wood >= requirements.wood && entity.stone >= requirements.stone) {
      entity.wood -= requirements.wood;
      entity.stone -= requirements.stone;

      const building: Building = {
        id: `building_${Date.now()}_${Math.random()}`,
        type: task.structure as any,
        x: task.target.x,
        y: task.target.y,
        health: 100,
        level: 1,
        owner: entity.id
      };

      entity.buildings.push(building);
      worldState.buildings.set(building.id, building);
    }
  }

  private completeExploreTask(entity: Entity, task: Task): void {
    if (!task.target) return;
    
    const areaKey = `${Math.floor(task.target.x / 50)}_${Math.floor(task.target.y / 50)}`;
    entity.exploredAreas.add(areaKey);
  }

  private completeCommunicateTask(entity: Entity, task: Task, worldState: WorldState): void {
    if (!task.target) return;

    const nearbyEntity = this.findEntityAt(task.target, worldState);
    if (nearbyEntity) {
      const currentRelation = entity.relationships.get(nearbyEntity.id) || 0;
      entity.relationships.set(nearbyEntity.id, Math.min(100, currentRelation + 10));
      
      const otherRelation = nearbyEntity.relationships.get(entity.id) || 0;
      nearbyEntity.relationships.set(entity.id, Math.min(100, otherRelation + 10));
    }
  }

  private updateEntityState(entity: Entity, worldState: WorldState, deltaTime: number): void {
    if (entity.isMoving) {
      const dx = entity.targetX - entity.x;
      const dy = entity.targetY - entity.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0.5) {
        entity.x += (dx / distance) * entity.speed;
        entity.y += (dy / distance) * entity.speed;
      } else {
        entity.x = entity.targetX;
        entity.y = entity.targetY;
        entity.isMoving = false;
      }
    }

    entity.food = Math.max(0, entity.food - 0.1 * deltaTime);
    
    if (entity.food <= 0) {
      entity.health = Math.max(0, entity.health - 0.5 * deltaTime);
    } else if (entity.health < 100) {
      entity.health = Math.min(100, entity.health + 0.2 * deltaTime);
    }

    entity.age += 0.01 * deltaTime;
  }

  // Helper methods
  private findNearestResource(entity: Entity, worldState: WorldState, type: string): Resource | null {
    let nearest: Resource | null = null;
    let minDistance = Infinity;

    for (const resource of worldState.resources.values()) {
      if (resource.type === type && resource.amount > 0) {
        const distance = this.getDistance(entity, resource);
        if (distance < minDistance) {
          minDistance = distance;
          nearest = resource;
        }
      }
    }

    return nearest;
  }

  private findBuildingSite(entity: Entity, worldState: WorldState): { x: number; y: number } {
    const attempts = 10;
    for (let i = 0; i < attempts; i++) {
      const x = entity.x + (Math.random() - 0.5) * 100;
      const y = entity.y + (Math.random() - 0.5) * 100;
      
      const isClear = !Array.from(worldState.buildings.values()).some(building =>
        this.getDistance({ x, y }, building) < 30
      );
      
      if (isClear) {
        return { x, y };
      }
    }
    
    return { x: entity.x + 50, y: entity.y + 50 };
  }

  private findUnexploredArea(entity: Entity, worldState: WorldState): { x: number; y: number } | null {
    for (let i = 0; i < 5; i++) {
      const x = entity.x + (Math.random() - 0.5) * 200;
      const y = entity.y + (Math.random() - 0.5) * 200;
      const areaKey = `${Math.floor(x / 50)}_${Math.floor(y / 50)}`;
      
      if (!entity.exploredAreas.has(areaKey)) {
        return { x, y };
      }
    }
    return null;
  }

  private findNearbyEntities(entity: Entity, worldState: WorldState, radius: number): Entity[] {
    return Array.from(worldState.entities.values()).filter(other => 
      other.id !== entity.id && this.getDistance(entity, other) <= radius
    );
  }

  private findResourceAt(target: { x: number; y: number }, worldState: WorldState): Resource | null {
    for (const resource of worldState.resources.values()) {
      if (this.getDistance(target, resource) < 10) {
        return resource;
      }
    }
    return null;
  }

  private findEntityAt(target: { x: number; y: number }, worldState: WorldState): Entity | null {
    for (const entity of worldState.entities.values()) {
      if (this.getDistance(target, entity) < 20) {
        return entity;
      }
    }
    return null;
  }

  private getDistance(a: { x: number; y: number }, b: { x: number; y: number }): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
