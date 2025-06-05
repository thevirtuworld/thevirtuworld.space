export interface Entity {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  health: number;
  food: number;
  wood: number;
  stone: number;
  level: number;
  experience: number;
  age: number;
  color: string;
  size: number;
  speed: number;
  isMoving: boolean;
  currentTask?: Task;
  buildings: Building[];
  relationships: Map<string, number>;
  exploredAreas: Set<string>;
  aiPersonality: {
    aggression: number;
    cooperation: number;
    exploration: number;
    efficiency: number;
  };
}

export interface Task {
  type: 'gather' | 'build' | 'explore' | 'communicate' | 'defend';
  resource?: string;
  structure?: string;
  target?: {x: number; y: number};
  progress: number;
  duration: number;
}

export interface Building {
  id: string;
  type: 'house' | 'farm' | 'workshop' | 'wall' | 'tower';
  x: number;
  y: number;
  health: number;
  level: number;
  owner: string;
  production?: {
    resource: string;
    rate: number;
    amount: number;
  };
}

export interface Resource {
  id: string;
  type: 'food' | 'wood' | 'stone' | 'water' | 'gold';
  x: number;
  y: number;
  amount: number;
  maxAmount: number;
  respawnRate: number;
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  type: 'spark' | 'smoke' | 'magic' | 'text';
}

export interface GameEvent {
  id: string;
  type: 'discovery' | 'conflict' | 'cooperation' | 'evolution' | 'disaster';
  timestamp: number;
  entities: string[];
  message: string;
  impact: {
    positive: number;
    negative: number;
  };
}

export interface WorldState {
  entities: Map<string, Entity>;
  buildings: Map<string, Building>;
  resources: Map<string, Resource>;
  particles: Particle[];
  events: GameEvent[];
  generation: number;
  time: number;
  weather: 'sunny' | 'rainy' | 'storm' | 'snow';
  season: 'spring' | 'summer' | 'autumn' | 'winter';
}
