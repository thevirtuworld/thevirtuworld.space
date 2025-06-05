import { WorldState, Entity, Building, Resource, Particle, GameEvent } from './GameTypes';
import { AIEngine } from './AIEngine';

export class SimulationEngine {
  private aiEngine: AIEngine;
  private lastUpdateTime = 0;
  private entityIdCounter = 0;
  private resourceIdCounter = 0;
  private eventIdCounter = 0;
  private particleIdCounter = 0;

  constructor(aiEngine: AIEngine) {
    this.aiEngine = aiEngine;
  }

  generateInitialWorld(worldState: WorldState, width: number, height: number): void {
    // Generate initial entities
    this.generateEntities(worldState, 15);
    
    // Generate resources
    this.generateResources(worldState, width, height, 40);
    
    // Add initial event
    this.addEvent(worldState, {
      type: 'discovery',
      message: 'A new world begins to evolve...',
      entities: Array.from(worldState.entities.keys()),
      impact: { positive: 100, negative: 0 }
    });
  }

  update(worldState: WorldState, deltaTime: number): void {
    worldState.time += deltaTime;
    
    // Update entities with AI
    for (const entity of worldState.entities.values()) {
      this.aiEngine.updateEntity(entity, worldState, deltaTime);
      this.updateEntityPhysics(entity, deltaTime);
    }
    
    // Update buildings
    this.updateBuildings(worldState, deltaTime);
    
    // Update resources
    this.updateResources(worldState, deltaTime);
    
    // Update particles
    this.updateParticles(worldState, deltaTime);
    
    // Spawn new entities occasionally
    if (Math.random() < 0.001 * deltaTime && worldState.entities.size < 30) {
      this.spawnNewEntity(worldState);
    }
    
    // Remove dead entities
    this.removeDeadEntities(worldState);
    
    // Update world conditions
    this.updateWorldConditions(worldState, deltaTime);
    
    // Process random events
    this.processRandomEvents(worldState, deltaTime);
  }

  private generateEntities(worldState: WorldState, count: number): void {
    for (let i = 0; i < count; i++) {
      const entity = this.createRandomEntity();
      worldState.entities.set(entity.id, entity);
    }
  }

  private createRandomEntity(): Entity {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    
    return {
      id: `entity_${this.entityIdCounter++}`,
      x: (Math.random() - 0.5) * 400,
      y: (Math.random() - 0.5) * 400,
      targetX: 0,
      targetY: 0,
      health: 100,
      food: Math.random() * 80 + 20,
      wood: Math.random() * 20,
      stone: Math.random() * 20,
      level: 1,
      experience: 0,
      age: Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 8 + Math.random() * 4,
      speed: 0.5 + Math.random() * 0.5,
      isMoving: false,
      buildings: [],
      relationships: new Map(),
      exploredAreas: new Set(),
      aiPersonality: {
        aggression: Math.random(),
        cooperation: Math.random(),
        exploration: Math.random(),
        efficiency: Math.random()
      }
    };
  }

  private generateResources(worldState: WorldState, width: number, height: number, count: number): void {
    const resourceTypes: Array<'food' | 'wood' | 'stone' | 'water' | 'gold'> = 
      ['food', 'wood', 'stone', 'water', 'gold'];
    
    for (let i = 0; i < count; i++) {
      const type = resourceTypes[Math.floor(Math.random() * resourceTypes.length)];
      const amount = this.getResourceAmount(type);
      
      const resource: Resource = {
        id: `resource_${this.resourceIdCounter++}`,
        type,
        x: (Math.random() - 0.5) * width * 0.8,
        y: (Math.random() - 0.5) * height * 0.8,
        amount,
        maxAmount: amount,
        respawnRate: this.getRespawnRate(type)
      };
      
      worldState.resources.set(resource.id, resource);
    }
  }

  private getResourceAmount(type: string): number {
    const amounts = {
      food: 50 + Math.random() * 100,
      wood: 80 + Math.random() * 120,
      stone: 60 + Math.random() * 90,
      water: 200 + Math.random() * 300,
      gold: 20 + Math.random() * 50
    };
    return amounts[type as keyof typeof amounts] || 50;
  }

  private getRespawnRate(type: string): number {
    const rates = {
      food: 2.0,
      wood: 1.0,
      stone: 0.5,
      water: 5.0,
      gold: 0.1
    };
    return rates[type as keyof typeof rates] || 1.0;
  }

  private updateEntityPhysics(entity: Entity, deltaTime: number): void {
    // Simple physics for smooth movement
    if (entity.isMoving) {
      const dx = entity.targetX - entity.x;
      const dy = entity.targetY - entity.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 1) {
        const moveX = (dx / distance) * entity.speed * deltaTime;
        const moveY = (dy / distance) * entity.speed * deltaTime;
        
        entity.x += moveX;
        entity.y += moveY;
      } else {
        entity.x = entity.targetX;
        entity.y = entity.targetY;
        entity.isMoving = false;
      }
    }
  }

  private updateBuildings(worldState: WorldState, deltaTime: number): void {
    for (const building of worldState.buildings.values()) {
      // Building production
      if (building.production) {
        building.production.amount += building.production.rate * deltaTime;
        
        // Transfer to owner
        const owner = worldState.entities.get(building.owner);
        if (owner && building.production.amount >= 10) {
          switch (building.production.resource) {
            case 'food':
              owner.food += 10;
              break;
            case 'wood':
              owner.wood += 10;
              break;
            case 'stone':
              owner.stone += 10;
              break;
          }
          building.production.amount -= 10;
        }
      }
      
      // Building maintenance
      if (Math.random() < 0.0001 * deltaTime) {
        building.health = Math.max(0, building.health - 1);
      }
    }
  }

  private updateResources(worldState: WorldState, deltaTime: number): void {
    for (const resource of worldState.resources.values()) {
      // Resource respawn
      if (resource.amount < resource.maxAmount) {
        resource.amount = Math.min(
          resource.maxAmount,
          resource.amount + resource.respawnRate * deltaTime
        );
      }
    }
  }

  private updateParticles(worldState: WorldState, deltaTime: number): void {
    worldState.particles = worldState.particles.filter(particle => {
      // Update particle physics
      particle.x += particle.vx * deltaTime;
      particle.y += particle.vy * deltaTime;
      particle.life -= deltaTime;
      
      // Apply gravity for some particle types
      if (particle.type === 'spark' || particle.type === 'smoke') {
        particle.vy += 0.1 * deltaTime;
      }
      
      return particle.life > 0;
    });
    
    // Add random ambient particles
    if (Math.random() < 0.01 * deltaTime) {
      this.addRandomParticle(worldState);
    }
  }

  private spawnNewEntity(worldState: WorldState): void {
    // Find a parent entity with good stats
    const potentialParents = Array.from(worldState.entities.values())
      .filter(e => e.health > 80 && e.food > 60 && e.level >= 2);
    
    if (potentialParents.length > 0) {
      const parent = potentialParents[Math.floor(Math.random() * potentialParents.length)];
      const newEntity = this.createOffspring(parent);
      worldState.entities.set(newEntity.id, newEntity);
      
      this.addEvent(worldState, {
        type: 'evolution',
        message: `${parent.id} has created offspring!`,
        entities: [parent.id, newEntity.id],
        impact: { positive: 50, negative: 0 }
      });
      
      // Add birth particles
      this.addParticle(worldState, {
        x: newEntity.x,
        y: newEntity.y,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: 60,
        color: '#FFD700',
        size: 3,
        type: 'spark'
      });
    }
  }

  private createOffspring(parent: Entity): Entity {
    const child = this.createRandomEntity();
    
    // Inherit some traits from parent
    child.x = parent.x + (Math.random() - 0.5) * 20;
    child.y = parent.y + (Math.random() - 0.5) * 20;
    child.targetX = child.x;
    child.targetY = child.y;
    
    // Inherit personality with some mutation
    child.aiPersonality = {
      aggression: Math.max(0, Math.min(1, parent.aiPersonality.aggression + (Math.random() - 0.5) * 0.2)),
      cooperation: Math.max(0, Math.min(1, parent.aiPersonality.cooperation + (Math.random() - 0.5) * 0.2)),
      exploration: Math.max(0, Math.min(1, parent.aiPersonality.exploration + (Math.random() - 0.5) * 0.2)),
      efficiency: Math.max(0, Math.min(1, parent.aiPersonality.efficiency + (Math.random() - 0.5) * 0.2))
    };
    
    // Slightly better stats than random
    child.speed = Math.min(1.5, parent.speed + (Math.random() - 0.5) * 0.1);
    
    return child;
  }

  private removeDeadEntities(worldState: WorldState): void {
    const toRemove: string[] = [];
    
    for (const [id, entity] of worldState.entities.entries()) {
      if (entity.health <= 0 || entity.age > 1000) {
        toRemove.push(id);
        
        // Death particles
        this.addParticle(worldState, {
          x: entity.x,
          y: entity.y,
          vx: 0,
          vy: -1,
          life: 30,
          color: '#666666',
          size: 2,
          type: 'smoke'
        });
      }
    }
    
    for (const id of toRemove) {
      worldState.entities.delete(id);
    }
    
    // Check for generation advancement
    if (worldState.entities.size === 0) {
      worldState.generation++;
      this.generateEntities(worldState, 10);
      
      this.addEvent(worldState, {
        type: 'evolution',
        message: `Generation ${worldState.generation} begins!`,
        entities: [],
        impact: { positive: 100, negative: 0 }
      });
    }
  }

  private updateWorldConditions(worldState: WorldState, deltaTime: number): void {
    // Seasonal changes
    const seasonDuration = 1000; // time units per season
    const seasonProgress = (worldState.time % (seasonDuration * 4)) / seasonDuration;
    
    if (seasonProgress < 1) worldState.season = 'spring';
    else if (seasonProgress < 2) worldState.season = 'summer';
    else if (seasonProgress < 3) worldState.season = 'autumn';
    else worldState.season = 'winter';
    
    // Weather changes
    if (Math.random() < 0.001 * deltaTime) {
      const weathers: Array<'sunny' | 'rainy' | 'storm' | 'snow'> = ['sunny', 'rainy', 'storm', 'snow'];
      worldState.weather = weathers[Math.floor(Math.random() * weathers.length)];
    }
  }

  private processRandomEvents(worldState: WorldState, deltaTime: number): void {
    if (Math.random() < 0.0005 * deltaTime) {
      const eventTypes: Array<'discovery' | 'conflict' | 'cooperation' | 'disaster'> = 
        ['discovery', 'conflict', 'cooperation', 'disaster'];
      
      const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      
      switch (type) {
        case 'discovery':
          this.processDiscoveryEvent(worldState);
          break;
        case 'conflict':
          this.processConflictEvent(worldState);
          break;
        case 'cooperation':
          this.processCooperationEvent(worldState);
          break;
        case 'disaster':
          this.processDisasterEvent(worldState);
          break;
      }
    }
  }

  private processDiscoveryEvent(worldState: WorldState): void {
    // Add new resources
    const newResource: Resource = {
      id: `resource_${this.resourceIdCounter++}`,
      type: 'gold',
      x: (Math.random() - 0.5) * 800,
      y: (Math.random() - 0.5) * 800,
      amount: 100 + Math.random() * 200,
      maxAmount: 300,
      respawnRate: 0.1
    };
    
    worldState.resources.set(newResource.id, newResource);
    
    this.addEvent(worldState, {
      type: 'discovery',
      message: 'A rich gold deposit has been discovered!',
      entities: [],
      impact: { positive: 75, negative: 0 }
    });
  }

  private processConflictEvent(worldState: WorldState): void {
    const entities = Array.from(worldState.entities.values());
    if (entities.length < 2) return;
    
    const entity1 = entities[Math.floor(Math.random() * entities.length)];
    const entity2 = entities[Math.floor(Math.random() * entities.length)];
    
    if (entity1.id !== entity2.id) {
      const damage = 10 + Math.random() * 20;
      entity1.health = Math.max(0, entity1.health - damage);
      entity2.health = Math.max(0, entity2.health - damage);
      
      this.addEvent(worldState, {
        type: 'conflict',
        message: 'A territorial dispute has broken out!',
        entities: [entity1.id, entity2.id],
        impact: { positive: 0, negative: 50 }
      });
    }
  }

  private processCooperationEvent(worldState: WorldState): void {
    const entities = Array.from(worldState.entities.values());
    if (entities.length < 2) return;
    
    const cooperators = entities.slice(0, Math.min(3, entities.length));
    
    for (const entity of cooperators) {
      entity.food = Math.min(100, entity.food + 20);
      entity.experience += 15;
    }
    
    this.addEvent(worldState, {
      type: 'cooperation',
      message: 'Entities have formed an alliance and shared resources!',
      entities: cooperators.map(e => e.id),
      impact: { positive: 60, negative: 0 }
    });
  }

  private processDisasterEvent(worldState: WorldState): void {
    const affectedEntities = Array.from(worldState.entities.values())
      .filter(() => Math.random() < 0.3);
    
    for (const entity of affectedEntities) {
      entity.health = Math.max(10, entity.health - 30);
      entity.food = Math.max(0, entity.food - 20);
    }
    
    this.addEvent(worldState, {
      type: 'disaster',
      message: 'A natural disaster has struck the world!',
      entities: affectedEntities.map(e => e.id),
      impact: { positive: 0, negative: 80 }
    });
  }

  private addEvent(worldState: WorldState, eventData: Omit<GameEvent, 'id' | 'timestamp'>): void {
    const event: GameEvent = {
      id: `event_${this.eventIdCounter++}`,
      timestamp: worldState.time,
      ...eventData
    };
    
    worldState.events.push(event);
    
    // Keep only recent events
    if (worldState.events.length > 50) {
      worldState.events = worldState.events.slice(-50);
    }
  }

  private addParticle(worldState: WorldState, particleData: Omit<Particle, 'id' | 'maxLife'>): void {
    const particle: Particle = {
      id: `particle_${this.particleIdCounter++}`,
      maxLife: particleData.life,
      ...particleData
    };
    
    worldState.particles.push(particle);
  }

  private addRandomParticle(worldState: WorldState): void {
    this.addParticle(worldState, {
      x: (Math.random() - 0.5) * 800,
      y: (Math.random() - 0.5) * 800,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      life: 120 + Math.random() * 180,
      color: '#4ECDC4',
      size: 1 + Math.random() * 2,
      type: 'magic'
    });
  }
}
