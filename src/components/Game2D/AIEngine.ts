import { Entity, Resource, Building, Task } from './GameTypes';

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
