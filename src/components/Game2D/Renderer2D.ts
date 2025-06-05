import { WorldState, Entity, Building, Resource, Particle } from './GameTypes';

export class Renderer2D {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private width: number;
  private height: number;
  private camera = { x: 0, y: 0, zoom: 1 };
  private lastRenderTime = 0;

  constructor(canvas: HTMLCanvasElement, width: number, height: number) {
    this.canvas = canvas;
    this.width = width;
    this.height = height;
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get 2D rendering context');
    }
    this.ctx = ctx;
    
    // Set up canvas styles
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
  }

  render(worldState: WorldState, selectedEntityId?: string | null): void {
    this.clear();
    this.updateCamera(worldState);
    
    // Save context for camera transforms
    this.ctx.save();
    this.applyCameraTransform();
    
    // Render world elements in order
    this.renderBackground();
    this.renderResources(worldState);
    this.renderBuildings(worldState);
    this.renderEntities(worldState, selectedEntityId);
    this.renderParticles(worldState);
    
    // Restore context
    this.ctx.restore();
    
    // Render UI elements (not affected by camera)
    this.renderUI(worldState);
  }

  private clear(): void {
    this.ctx.fillStyle = '#1a1a2e';
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  private updateCamera(worldState: WorldState): void {
    // Follow the center of all entities
    if (worldState.entities.size > 0) {
      let totalX = 0;
      let totalY = 0;
      
      for (const entity of worldState.entities.values()) {
        totalX += entity.x;
        totalY += entity.y;
      }
      
      const centerX = totalX / worldState.entities.size;
      const centerY = totalY / worldState.entities.size;
      
      // Smooth camera movement
      this.camera.x += (centerX - this.camera.x) * 0.02;
      this.camera.y += (centerY - this.camera.y) * 0.02;
    }
  }

  private applyCameraTransform(): void {
    this.ctx.translate(this.width / 2, this.height / 2);
    this.ctx.scale(this.camera.zoom, this.camera.zoom);
    this.ctx.translate(-this.camera.x, -this.camera.y);
  }

  private renderBackground(): void {
    // Grid pattern
    this.ctx.strokeStyle = '#2a2a3e';
    this.ctx.lineWidth = 0.5;
    
    const gridSize = 50;
    const startX = Math.floor((this.camera.x - this.width / 2) / gridSize) * gridSize;
    const endX = Math.ceil((this.camera.x + this.width / 2) / gridSize) * gridSize;
    const startY = Math.floor((this.camera.y - this.height / 2) / gridSize) * gridSize;
    const endY = Math.ceil((this.camera.y + this.height / 2) / gridSize) * gridSize;
    
    this.ctx.beginPath();
    for (let x = startX; x <= endX; x += gridSize) {
      this.ctx.moveTo(x, startY);
      this.ctx.lineTo(x, endY);
    }
    for (let y = startY; y <= endY; y += gridSize) {
      this.ctx.moveTo(startX, y);
      this.ctx.lineTo(endX, y);
    }
    this.ctx.stroke();
  }

  private renderResources(worldState: WorldState): void {
    for (const resource of worldState.resources.values()) {
      this.renderResource(resource);
    }
  }

  private renderResource(resource: Resource): void {
    const colors = {
      food: '#90EE90',
      wood: '#8B4513',
      stone: '#696969',
      water: '#87CEEB',
      gold: '#FFD700'
    };
    
    const size = Math.max(3, Math.min(15, resource.amount / 5));
    
    this.ctx.fillStyle = colors[resource.type] || '#888888';
    this.ctx.beginPath();
    this.ctx.arc(resource.x, resource.y, size, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Resource amount indicator
    if (resource.amount > 10) {
      this.ctx.fillStyle = 'white';
      this.ctx.font = '10px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(Math.round(resource.amount).toString(), resource.x, resource.y + size + 12);
    }
  }

  private renderBuildings(worldState: WorldState): void {
    for (const building of worldState.buildings.values()) {
      this.renderBuilding(building);
    }
  }

  private renderBuilding(building: Building): void {
    const colors = {
      house: '#8B4513',
      farm: '#228B22',
      workshop: '#4682B4',
      wall: '#696969',
      tower: '#2F4F4F'
    };
    
    const size = 20 + building.level * 5;
    
    this.ctx.fillStyle = colors[building.type] || '#888888';
    this.ctx.fillRect(
      building.x - size / 2,
      building.y - size / 2,
      size,
      size
    );
    
    // Building health bar
    if (building.health < 100) {
      const barWidth = size;
      const barHeight = 4;
      
      this.ctx.fillStyle = '#333333';
      this.ctx.fillRect(
        building.x - barWidth / 2,
        building.y - size / 2 - 8,
        barWidth,
        barHeight
      );
      
      this.ctx.fillStyle = building.health > 50 ? '#00FF00' : building.health > 25 ? '#FFFF00' : '#FF0000';
      this.ctx.fillRect(
        building.x - barWidth / 2,
        building.y - size / 2 - 8,
        (barWidth * building.health) / 100,
        barHeight
      );
    }
    
    // Building level indicator
    this.ctx.fillStyle = 'white';
    this.ctx.font = '8px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(building.level.toString(), building.x, building.y + 3);
  }

  private renderEntities(worldState: WorldState, selectedEntityId?: string | null): void {
    for (const entity of worldState.entities.values()) {
      this.renderEntity(entity, entity.id === selectedEntityId);
    }
  }

  private renderEntity(entity: Entity, isSelected: boolean): void {
    const size = 5 + entity.level * 2;
    
    // Entity body
    this.ctx.fillStyle = entity.color;
    this.ctx.beginPath();
    this.ctx.arc(entity.x, entity.y, size, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Selection indicator
    if (isSelected) {
      this.ctx.strokeStyle = '#FFD700';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.arc(entity.x, entity.y, size + 3, 0, Math.PI * 2);
      this.ctx.stroke();
    }
    
    // Health bar
    const barWidth = size * 2;
    const barHeight = 3;
    
    this.ctx.fillStyle = '#333333';
    this.ctx.fillRect(
      entity.x - barWidth / 2,
      entity.y - size - 8,
      barWidth,
      barHeight
    );
    
    this.ctx.fillStyle = entity.health > 70 ? '#00FF00' : entity.health > 30 ? '#FFFF00' : '#FF0000';
    this.ctx.fillRect(
      entity.x - barWidth / 2,
      entity.y - size - 8,
      (barWidth * entity.health) / 100,
      barHeight
    );
    
    // Movement trail
    if (entity.isMoving) {
      this.ctx.strokeStyle = entity.color + '40';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(entity.x, entity.y);
      this.ctx.lineTo(entity.targetX, entity.targetY);
      this.ctx.stroke();
    }
    
    // Task indicator
    if (entity.currentTask) {
      const taskIcons = {
        gather: '🌾',
        build: '🏗️',
        explore: '🔍',
        communicate: '💬',
        defend: '⚔️'
      };
      
      this.ctx.fillStyle = 'white';
      this.ctx.font = '12px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(
        taskIcons[entity.currentTask.type] || '❓',
        entity.x,
        entity.y + size + 15
      );
    }
    
    // Level indicator
    this.ctx.fillStyle = 'white';
    this.ctx.font = '8px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(entity.level.toString(), entity.x, entity.y + 2);
  }

  private renderParticles(worldState: WorldState): void {
    for (const particle of worldState.particles) {
      this.renderParticle(particle);
    }
  }

  private renderParticle(particle: Particle): void {
    const alpha = particle.life / particle.maxLife;
    
    this.ctx.save();
    this.ctx.globalAlpha = alpha;
    
    switch (particle.type) {
      case 'spark':
        this.ctx.fillStyle = particle.color;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
        break;
        
      case 'smoke':
        this.ctx.fillStyle = `rgba(200, 200, 200, ${alpha * 0.5})`;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
        break;
        
      case 'text':
        this.ctx.fillStyle = particle.color;
        this.ctx.font = `${particle.size}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText('✨', particle.x, particle.y);
        break;
        
      default:
        this.ctx.fillStyle = particle.color;
        this.ctx.fillRect(
          particle.x - particle.size / 2,
          particle.y - particle.size / 2,
          particle.size,
          particle.size
        );
    }
    
    this.ctx.restore();
  }

  private renderUI(worldState: WorldState): void {
    // Mini-map
    this.renderMinimap(worldState);
    
    // Time and weather
    this.renderTimeInfo(worldState);
  }

  private renderMinimap(worldState: WorldState): void {
    const mapSize = 150;
    const mapX = this.width - mapSize - 10;
    const mapY = 10;
    
    // Map background
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(mapX, mapY, mapSize, mapSize);
    
    this.ctx.strokeStyle = '#444444';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(mapX, mapY, mapSize, mapSize);
    
    // Map scale
    const worldBounds = this.getWorldBounds(worldState);
    const scaleX = mapSize / (worldBounds.maxX - worldBounds.minX || 1);
    const scaleY = mapSize / (worldBounds.maxY - worldBounds.minY || 1);
    const scale = Math.min(scaleX, scaleY) * 0.8;
    
    // Render entities on minimap
    for (const entity of worldState.entities.values()) {
      const x = mapX + mapSize / 2 + (entity.x - this.camera.x) * scale;
      const y = mapY + mapSize / 2 + (entity.y - this.camera.y) * scale;
      
      if (x >= mapX && x <= mapX + mapSize && y >= mapY && y <= mapY + mapSize) {
        this.ctx.fillStyle = entity.color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, 2, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
    
    // Camera position indicator
    this.ctx.strokeStyle = '#FFD700';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(mapX + mapSize / 2 - 2, mapY + mapSize / 2 - 2, 4, 4);
  }

  private renderTimeInfo(worldState: WorldState): void {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(10, 10, 200, 80);
    
    this.ctx.fillStyle = 'white';
    this.ctx.font = '14px Arial';
    this.ctx.textAlign = 'left';
    
    const timeText = `Time: ${Math.floor(worldState.time / 60)}:${(worldState.time % 60).toString().padStart(2, '0')}`;
    this.ctx.fillText(timeText, 20, 30);
    
    this.ctx.fillText(`Generation: ${worldState.generation}`, 20, 50);
    this.ctx.fillText(`Weather: ${worldState.weather}`, 20, 70);
  }

  private getWorldBounds(worldState: WorldState): { minX: number; maxX: number; minY: number; maxY: number } {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    
    for (const entity of worldState.entities.values()) {
      minX = Math.min(minX, entity.x);
      maxX = Math.max(maxX, entity.x);
      minY = Math.min(minY, entity.y);
      maxY = Math.max(maxY, entity.y);
    }
    
    for (const building of worldState.buildings.values()) {
      minX = Math.min(minX, building.x);
      maxX = Math.max(maxX, building.x);
      minY = Math.min(minY, building.y);
      maxY = Math.max(maxY, building.y);
    }
    
    return { minX, maxX, minY, maxY };
  }

  getEntityAtPosition(x: number, y: number, worldState: WorldState): Entity | null {
    // Convert screen coordinates to world coordinates
    const worldX = this.camera.x + (x - this.width / 2) / this.camera.zoom;
    const worldY = this.camera.y + (y - this.height / 2) / this.camera.zoom;
    
    for (const entity of worldState.entities.values()) {
      const distance = Math.sqrt(
        Math.pow(worldX - entity.x, 2) + Math.pow(worldY - entity.y, 2)
      );
      
      const entitySize = 5 + entity.level * 2;
      if (distance <= entitySize) {
        return entity;
      }
    }
    
    return null;
  }

  setZoom(zoom: number): void {
    this.camera.zoom = Math.max(0.1, Math.min(3, zoom));
  }

  setCameraPosition(x: number, y: number): void {
    this.camera.x = x;
    this.camera.y = y;
  }
}
