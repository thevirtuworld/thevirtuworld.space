import { Entity, Building, Resource, Particle, WorldState } from './GameTypes';

export class Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private camera: {x: number; y: number; zoom: number};
  private particles: Particle[];
  private animationTime: number;
  
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.camera = {x: 0, y: 0, zoom: 1};
    this.particles = [];
    this.animationTime = 0;
    
    // Set up high DPI rendering
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
  }
  
  render(worldState: WorldState, deltaTime: number): void {
    this.animationTime += deltaTime;
    
    // Clear canvas with dynamic background
    this.renderBackground(worldState);
    
    // Apply camera transformation
    this.ctx.save();
    this.ctx.translate(-this.camera.x, -this.camera.y);
    this.ctx.scale(this.camera.zoom, this.camera.zoom);
    
    // Render world elements
    this.renderTerrain();
    this.renderResources(worldState.resources);
    this.renderBuildings(worldState.buildings);
    this.renderEntities(worldState.entities);
    this.renderParticles(deltaTime);
    this.renderEffects(worldState);
    
    this.ctx.restore();
    
    // Render UI elements
    this.renderUI(worldState);
    this.renderMinimap(worldState);
  }
  
  private renderBackground(worldState: WorldState): void {
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    
    // Dynamic sky based on time and weather
    const timeOfDay = (worldState.time % 86400) / 86400; // 0-1
    
    if (timeOfDay < 0.25 || timeOfDay > 0.75) {
      // Night
      gradient.addColorStop(0, '#0a0a2e');
      gradient.addColorStop(1, '#16213e');
    } else if (timeOfDay < 0.5) {
      // Day
      gradient.addColorStop(0, '#87ceeb');
      gradient.addColorStop(1, '#98fb98');
    } else {
      // Evening
      gradient.addColorStop(0, '#ff6b6b');
      gradient.addColorStop(1, '#4ecdc4');
    }
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Weather effects
    if (worldState.weather === 'rainy') {
      this.renderRain();
    } else if (worldState.weather === 'snow') {
      this.renderSnow();
    }
  }
  
  private renderTerrain(): void {
    // Procedural terrain with noise
    this.ctx.fillStyle = '#2d5016';
    this.ctx.fillRect(-1000, -1000, 3000, 3000);
    
    // Add texture
    for (let x = -1000; x < 2000; x += 20) {
      for (let y = -1000; y < 2000; y += 20) {
        const noise = Math.sin(x * 0.01) * Math.cos(y * 0.01);
        const alpha = Math.abs(noise) * 0.1;
        this.ctx.fillStyle = `rgba(45, 80, 22, ${alpha})`;
        this.ctx.fillRect(x, y, 20, 20);
      }
    }
  }
  
  private renderResources(resources: Map<string, Resource>): void {
    resources.forEach(resource => {
      this.ctx.save();
      this.ctx.translate(resource.x, resource.y);
      
      // Pulsing effect based on amount
      const scale = 1 + Math.sin(this.animationTime * 0.005) * 0.1 * (resource.amount / resource.maxAmount);
      this.ctx.scale(scale, scale);
      
      switch (resource.type) {
        case 'food':
          this.drawFood(resource);
          break;
        case 'wood':
          this.drawTree(resource);
          break;
        case 'stone':
          this.drawStone(resource);
          break;
        case 'water':
          this.drawWater(resource);
          break;
        case 'gold':
          this.drawGold(resource);
          break;
      }
      
      this.ctx.restore();
    });
  }
  
  private drawFood(resource: Resource): void {
    // Berry bush
    this.ctx.fillStyle = '#228b22';
    this.ctx.beginPath();
    this.ctx.arc(0, 0, 15, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Berries
    const berryCount = Math.floor(resource.amount / 10);
    for (let i = 0; i < berryCount; i++) {
      const angle = (i / berryCount) * Math.PI * 2;
      const x = Math.cos(angle) * 10;
      const y = Math.sin(angle) * 10;
      
      this.ctx.fillStyle = '#ff4500';
      this.ctx.beginPath();
      this.ctx.arc(x, y, 3, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }
  
  private drawTree(resource: Resource): void {
    // Trunk
    this.ctx.fillStyle = '#8b4513';
    this.ctx.fillRect(-3, -5, 6, 25);
    
    // Leaves
    this.ctx.fillStyle = '#32cd32';
    this.ctx.beginPath();
    this.ctx.arc(0, -15, 20, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Animation - swaying
    const sway = Math.sin(this.animationTime * 0.002) * 2;
    this.ctx.save();
    this.ctx.translate(sway, 0);
    this.ctx.fillStyle = '#228b22';
    this.ctx.beginPath();
    this.ctx.arc(0, -15, 15, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }
  
  private drawStone(resource: Resource): void {
    this.ctx.fillStyle = '#696969';
    this.ctx.save();
    this.ctx.rotate(Math.PI / 4);
    this.ctx.fillRect(-10, -10, 20, 20);
    this.ctx.restore();
    
    // Sparkle effect for valuable stones
    if (resource.amount > 50) {
      const sparkles = 3;
      for (let i = 0; i < sparkles; i++) {
        const angle = (this.animationTime * 0.01 + i * Math.PI * 2 / sparkles) % (Math.PI * 2);
        const x = Math.cos(angle) * 15;
        const y = Math.sin(angle) * 15;
        
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.beginPath();
        this.ctx.arc(x, y, 2, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
  }
  
  private drawWater(resource: Resource): void {
    // Animated water
    const waves = 3;
    this.ctx.fillStyle = '#4169e1';
    this.ctx.beginPath();
    
    for (let i = 0; i <= waves; i++) {
      const angle = (i / waves) * Math.PI * 2 + this.animationTime * 0.005;
      const x = Math.cos(angle) * 20;
      const y = Math.sin(angle) * 20;
      
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    
    this.ctx.closePath();
    this.ctx.fill();
    
    // Reflection effect
    this.ctx.fillStyle = 'rgba(135, 206, 235, 0.3)';
    this.ctx.fill();
  }
  
  private drawGold(resource: Resource): void {
    this.ctx.fillStyle = '#ffd700';
    this.ctx.save();
    this.ctx.rotate(this.animationTime * 0.001);
    
    // Draw star shape
    const spikes = 8;
    const outerRadius = 12;
    const innerRadius = 6;
    
    this.ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / spikes;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();
  }
  
  private renderBuildings(buildings: Map<string, Building>): void {
    buildings.forEach(building => {
      this.ctx.save();
      this.ctx.translate(building.x, building.y);
      
      // Building shadow
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      this.ctx.fillRect(2, 2, 40, 40);
      
      // Main building
      switch (building.type) {
        case 'house':
          this.drawHouse(building);
          break;
        case 'farm':
          this.drawFarm(building);
          break;
        case 'workshop':
          this.drawWorkshop(building);
          break;
        case 'wall':
          this.drawWall(building);
          break;
        case 'tower':
          this.drawTower(building);
          break;
      }
      
      // Health bar
      if (building.health < 100) {
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(-20, -30, 40 * (building.health / 100), 3);
        this.ctx.strokeStyle = 'white';
        this.ctx.strokeRect(-20, -30, 40, 3);
      }
      
      this.ctx.restore();
    });
  }
  
  private drawHouse(building: Building): void {
    // Base
    this.ctx.fillStyle = '#8b4513';
    this.ctx.fillRect(-20, -10, 40, 30);
    
    // Roof
    this.ctx.fillStyle = '#dc143c';
    this.ctx.beginPath();
    this.ctx.moveTo(-25, -10);
    this.ctx.lineTo(0, -35);
    this.ctx.lineTo(25, -10);
    this.ctx.closePath();
    this.ctx.fill();
    
    // Door
    this.ctx.fillStyle = '#654321';
    this.ctx.fillRect(-5, 0, 10, 20);
    
    // Windows
    this.ctx.fillStyle = '#87ceeb';
    this.ctx.fillRect(-15, -5, 8, 8);
    this.ctx.fillRect(7, -5, 8, 8);
    
    // Chimney smoke for level 2+
    if (building.level >= 2) {
      for (let i = 0; i < 5; i++) {
        const smokeY = -40 - i * 5;
        const smokeX = 15 + Math.sin(this.animationTime * 0.01 + i) * 3;
        
        this.ctx.fillStyle = `rgba(128, 128, 128, ${0.7 - i * 0.1})`;
        this.ctx.beginPath();
        this.ctx.arc(smokeX, smokeY, 3 - i * 0.3, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
  }
  
  private drawFarm(building: Building): void {
    // Field
    this.ctx.fillStyle = '#8fbc8f';
    this.ctx.fillRect(-25, -25, 50, 50);
    
    // Crops
    const cropRows = 4;
    const cropsPerRow = 4;
    
    for (let row = 0; row < cropRows; row++) {
      for (let col = 0; col < cropsPerRow; col++) {
        const x = -20 + col * 10;
        const y = -20 + row * 10;
        
        // Growing animation
        const growthPhase = (this.animationTime * 0.001 + row + col) % 4;
        const height = 2 + growthPhase * 2;
        
        this.ctx.fillStyle = '#32cd32';
        this.ctx.fillRect(x, y, 2, height);
      }
    }
    
    // Barn
    this.ctx.fillStyle = '#dc143c';
    this.ctx.fillRect(15, 15, 20, 15);
  }
  
  private drawWorkshop(building: Building): void {
    // Main building
    this.ctx.fillStyle = '#708090';
    this.ctx.fillRect(-20, -20, 40, 40);
    
    // Gear decoration
    this.ctx.save();
    this.ctx.translate(0, 0);
    this.ctx.rotate(this.animationTime * 0.002);
    
    this.ctx.fillStyle = '#ffd700';
    this.ctx.beginPath();
    
    const teeth = 8;
    for (let i = 0; i < teeth; i++) {
      const angle = (i / teeth) * Math.PI * 2;
      const x = Math.cos(angle) * 15;
      const y = Math.sin(angle) * 15;
      
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    this.ctx.closePath();
    this.ctx.fill();
    
    this.ctx.restore();
    
    // Sparks for active workshop
    if (building.production) {
      this.addParticle({
        id: Math.random().toString(),
        x: building.x + (Math.random() - 0.5) * 40,
        y: building.y + (Math.random() - 0.5) * 40,
        vx: (Math.random() - 0.5) * 50,
        vy: (Math.random() - 0.5) * 50,
        life: 1000,
        maxLife: 1000,
        color: '#ff6b35',
        size: 2,
        type: 'spark'
      });
    }
  }
  
  private drawWall(building: Building): void {
    this.ctx.fillStyle = '#696969';
    this.ctx.fillRect(-5, -25, 10, 50);
    
    // Defensive spikes
    const spikes = 5;
    this.ctx.fillStyle = '#2f4f4f';
    for (let i = 0; i < spikes; i++) {
      const y = -20 + i * 8;
      this.ctx.beginPath();
      this.ctx.moveTo(-5, y);
      this.ctx.lineTo(-10, y + 2);
      this.ctx.lineTo(-5, y + 4);
      this.ctx.closePath();
      this.ctx.fill();
      
      this.ctx.beginPath();
      this.ctx.moveTo(5, y);
      this.ctx.lineTo(10, y + 2);
      this.ctx.lineTo(5, y + 4);
      this.ctx.closePath();
      this.ctx.fill();
    }
  }
  
  private drawTower(building: Building): void {
    // Base
    this.ctx.fillStyle = '#2f4f4f';
    this.ctx.fillRect(-15, -10, 30, 40);
    
    // Tower
    this.ctx.fillStyle = '#696969';
    this.ctx.fillRect(-10, -40, 20, 30);
    
    // Flag
    this.ctx.fillStyle = building.owner ? '#ff4500' : '#4169e1';
    this.ctx.fillRect(5, -45, 15, 10);
    
    // Flag animation
    const wave = Math.sin(this.animationTime * 0.01) * 2;
    this.ctx.fillRect(20, -45 + wave, 5, 10 - Math.abs(wave));
    
    // Watch light
    const lightIntensity = 0.5 + Math.sin(this.animationTime * 0.005) * 0.3;
    this.ctx.fillStyle = `rgba(255, 255, 0, ${lightIntensity})`;
    this.ctx.beginPath();
    this.ctx.arc(0, -35, 8, 0, Math.PI * 2);
    this.ctx.fill();
  }
  
  private renderEntities(entities: Map<string, Entity>): void {
    entities.forEach(entity => {
      this.ctx.save();
      this.ctx.translate(entity.x, entity.y);
      
      // Entity shadow
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      this.ctx.beginPath();
      this.ctx.ellipse(0, entity.size + 2, entity.size, entity.size * 0.5, 0, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Health/energy aura
      const auraSize = entity.size + 5;
      const auraAlpha = entity.health / 100 * 0.3;
      const gradient = this.ctx.createRadialGradient(0, 0, entity.size, 0, 0, auraSize);
      gradient.addColorStop(0, `rgba(${entity.color.replace('#', '').match(/.{2}/g)?.map(hex => parseInt(hex, 16)).join(',')}, 0)`);
      gradient.addColorStop(1, `rgba(${entity.color.replace('#', '').match(/.{2}/g)?.map(hex => parseInt(hex, 16)).join(',')}, ${auraAlpha})`);
      
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, auraSize, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Main entity body
      this.ctx.fillStyle = entity.color;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, entity.size, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Eyes (showing AI state)
      this.ctx.fillStyle = 'white';
      this.ctx.beginPath();
      this.ctx.arc(-entity.size * 0.3, -entity.size * 0.3, entity.size * 0.2, 0, Math.PI * 2);
      this.ctx.arc(entity.size * 0.3, -entity.size * 0.3, entity.size * 0.2, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Pupils (indicating AI decision state)
      this.ctx.fillStyle = 'black';
      const pupilOffset = entity.isMoving ? entity.size * 0.1 : 0;
      this.ctx.beginPath();
      this.ctx.arc(-entity.size * 0.3 + pupilOffset, -entity.size * 0.3, entity.size * 0.1, 0, Math.PI * 2);
      this.ctx.arc(entity.size * 0.3 + pupilOffset, -entity.size * 0.3, entity.size * 0.1, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Level indicator
      if (entity.level > 1) {
        this.ctx.fillStyle = '#ffd700';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`${entity.level}`, 0, -entity.size - 5);
      }
      
      // Current task indicator
      if (entity.currentTask) {
        this.drawTaskIndicator(entity.currentTask);
      }
      
      // Movement trail
      if (entity.isMoving) {
        this.addParticle({
          id: Math.random().toString(),
          x: entity.x + (Math.random() - 0.5) * entity.size,
          y: entity.y + entity.size,
          vx: (Math.random() - 0.5) * 20,
          vy: (Math.random() - 0.5) * 20,
          life: 500,
          maxLife: 500,
          color: entity.color,
          size: 1,
          type: 'spark'
        });
      }
      
      this.ctx.restore();
      
      // Draw relationships
      this.drawRelationships(entity, entities);
    });
  }
  
  private drawTaskIndicator(task: any): void {
    let icon = '';
    let color = '#ffffff';
    
    switch (task.type) {
      case 'gather':
        icon = '⛏️';
        color = '#32cd32';
        break;
      case 'build':
        icon = '🔨';
        color = '#8b4513';
        break;
      case 'explore':
        icon = '🔍';
        color = '#4169e1';
        break;
      case 'communicate':
        icon = '💬';
        color = '#ff69b4';
        break;
      case 'defend':
        icon = '⚔️';
        color = '#dc143c';
        break;
    }
    
    // Task progress circle
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(0, -25, 8, 0, Math.PI * 2 * (task.progress / 100));
    this.ctx.stroke();
    
    // Icon
    this.ctx.fillStyle = color;
    this.ctx.font = '12px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(icon, 0, -20);
  }
  
  private drawRelationships(entity: Entity, entities: Map<string, Entity>): void {
    entity.relationships.forEach((strength, otherId) => {
      const other = entities.get(otherId);
      if (!other || strength < 0.3) return;
      
      const distance = Math.sqrt((other.x - entity.x) ** 2 + (other.y - entity.y) ** 2);
      if (distance > 150) return;
      
      // Draw relationship line
      this.ctx.strokeStyle = `rgba(255, 105, 180, ${strength * 0.5})`;
      this.ctx.lineWidth = strength * 3;
      this.ctx.beginPath();
      this.ctx.moveTo(entity.x, entity.y);
      this.ctx.lineTo(other.x, other.y);
      this.ctx.stroke();
      
      // Floating hearts for strong relationships
      if (strength > 0.8) {
        const heartX = (entity.x + other.x) / 2;
        const heartY = (entity.y + other.y) / 2;
        
        this.addParticle({
          id: Math.random().toString(),
          x: heartX,
          y: heartY,
          vx: 0,
          vy: -20,
          life: 2000,
          maxLife: 2000,
          color: '#ff69b4',
          size: 8,
          type: 'text'
        });
      }
    });
  }
  
  private renderParticles(deltaTime: number): void {
    this.particles = this.particles.filter(particle => {
      particle.life -= deltaTime;
      
      if (particle.life <= 0) return false;
      
      // Update particle physics
      particle.x += particle.vx * deltaTime * 0.001;
      particle.y += particle.vy * deltaTime * 0.001;
      particle.vy += 20 * deltaTime * 0.001; // Gravity
      
      // Render particle
      const alpha = particle.life / particle.maxLife;
      this.ctx.save();
      
      switch (particle.type) {
        case 'spark':
          this.ctx.fillStyle = particle.color;
          this.ctx.globalAlpha = alpha;
          this.ctx.beginPath();
          this.ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
          this.ctx.fill();
          break;
          
        case 'smoke':
          this.ctx.fillStyle = 'gray';
          this.ctx.globalAlpha = alpha * 0.5;
          this.ctx.beginPath();
          this.ctx.arc(particle.x, particle.y, particle.size * (2 - alpha), 0, Math.PI * 2);
          this.ctx.fill();
          break;
          
        case 'magic':
          this.ctx.strokeStyle = particle.color;
          this.ctx.globalAlpha = alpha;
          this.ctx.lineWidth = 2;
          this.ctx.beginPath();
          const spikes = 5;
          for (let i = 0; i < spikes; i++) {
            const angle = (i / spikes) * Math.PI * 2 + this.animationTime * 0.01;
            const radius = particle.size * alpha;
            const x = particle.x + Math.cos(angle) * radius;
            const y = particle.y + Math.sin(angle) * radius;
            
            if (i === 0) {
              this.ctx.moveTo(x, y);
            } else {
              this.ctx.lineTo(x, y);
            }
          }
          this.ctx.closePath();
          this.ctx.stroke();
          break;
          
        case 'text':
          this.ctx.fillStyle = particle.color;
          this.ctx.globalAlpha = alpha;
          this.ctx.font = `${particle.size}px Arial`;
          this.ctx.textAlign = 'center';
          this.ctx.fillText('❤️', particle.x, particle.y);
          break;
      }
      
      this.ctx.restore();
      return true;
    });
  }
  
  private renderEffects(worldState: WorldState): void {
    // Season effects
    if (worldState.season === 'autumn') {
      this.renderFallingLeaves();
    } else if (worldState.season === 'winter') {
      this.renderSnow();
    } else if (worldState.season === 'spring') {
      this.renderPollen();
    }
    
    // Time of day effects
    const timeOfDay = (worldState.time % 86400) / 86400;
    if (timeOfDay < 0.25 || timeOfDay > 0.75) {
      this.renderStars();
    }
  }
  
  private renderRain(): void {
    const raindrops = 100;
    this.ctx.strokeStyle = 'rgba(173, 216, 230, 0.6)';
    this.ctx.lineWidth = 1;
    
    for (let i = 0; i < raindrops; i++) {
      const x = (this.animationTime * 0.1 + i * 100) % this.canvas.width;
      const y = (this.animationTime * 0.5 + i * 37) % this.canvas.height;
      
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(x - 5, y + 20);
      this.ctx.stroke();
    }
  }
  
  private renderSnow(): void {
    const snowflakes = 50;
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    
    for (let i = 0; i < snowflakes; i++) {
      const x = (this.animationTime * 0.05 + i * 157) % this.canvas.width;
      const y = (this.animationTime * 0.1 + i * 73) % this.canvas.height;
      
      this.ctx.beginPath();
      this.ctx.arc(x, y, 2, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }
  
  private renderFallingLeaves(): void {
    const leaves = 20;
    
    for (let i = 0; i < leaves; i++) {
      const x = (this.animationTime * 0.02 + i * 200) % this.canvas.width;
      const y = (this.animationTime * 0.08 + i * 113) % this.canvas.height;
      const rotation = this.animationTime * 0.001 + i;
      
      this.ctx.save();
      this.ctx.translate(x, y);
      this.ctx.rotate(rotation);
      
      const colors = ['#ff6b35', '#f7931e', '#ffcc02', '#8b4513'];
      this.ctx.fillStyle = colors[i % colors.length];
      
      // Simple leaf shape
      this.ctx.beginPath();
      this.ctx.ellipse(0, 0, 3, 6, 0, 0, Math.PI * 2);
      this.ctx.fill();
      
      this.ctx.restore();
    }
  }
  
  private renderPollen(): void {
    const pollenCount = 30;
    
    for (let i = 0; i < pollenCount; i++) {
      const x = (this.animationTime * 0.03 + i * 123) % this.canvas.width;
      const y = (this.animationTime * 0.02 + i * 89) % this.canvas.height;
      
      this.ctx.fillStyle = 'rgba(255, 255, 0, 0.4)';
      this.ctx.beginPath();
      this.ctx.arc(x, y, 1, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }
  
  private renderStars(): void {
    const stars = 100;
    
    for (let i = 0; i < stars; i++) {
      const x = (i * 157) % this.canvas.width;
      const y = (i * 73) % (this.canvas.height * 0.6);
      const twinkle = Math.sin(this.animationTime * 0.005 + i) * 0.5 + 0.5;
      
      this.ctx.fillStyle = `rgba(255, 255, 255, ${twinkle * 0.8})`;
      this.ctx.beginPath();
      this.ctx.arc(x, y, 1, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }
  
  private renderUI(worldState: WorldState): void {
    // AI Status Panel
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(10, 10, 250, 150);
    
    this.ctx.fillStyle = 'white';
    this.ctx.font = '16px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('AI Colony Simulation', 20, 30);
    
    this.ctx.font = '12px Arial';
    this.ctx.fillText(`Generation: ${worldState.generation}`, 20, 50);
    this.ctx.fillText(`Population: ${worldState.entities.size}`, 20, 65);
    this.ctx.fillText(`Buildings: ${worldState.buildings.size}`, 20, 80);
    this.ctx.fillText(`Time: ${Math.floor(worldState.time / 1000)}s`, 20, 95);
    this.ctx.fillText(`Season: ${worldState.season}`, 20, 110);
    this.ctx.fillText(`Weather: ${worldState.weather}`, 20, 125);
    
    // Performance indicators
    this.ctx.fillText(`Particles: ${this.particles.length}`, 20, 145);
    
    // Recent events
    if (worldState.events.length > 0) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      this.ctx.fillRect(10, this.canvas.height - 100, 400, 80);
      
      this.ctx.fillStyle = 'white';
      this.ctx.font = '12px Arial';
      this.ctx.fillText('Recent Events:', 20, this.canvas.height - 80);
      
      const recentEvents = worldState.events.slice(-3);
      recentEvents.forEach((event, i) => {
        const age = Date.now() - event.timestamp;
        const alpha = Math.max(0, 1 - age / 10000);
        this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        this.ctx.fillText(event.message, 20, this.canvas.height - 60 + i * 15);
      });
    }
  }
  
  private renderMinimap(worldState: WorldState): void {
    const mapSize = 150;
    const mapX = this.canvas.width - mapSize - 10;
    const mapY = 10;
    
    // Minimap background
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(mapX, mapY, mapSize, mapSize);
    
    this.ctx.strokeStyle = 'white';
    this.ctx.strokeRect(mapX, mapY, mapSize, mapSize);
    
    // Scale factor
    const scale = mapSize / 1000;
    
    // Render entities on minimap
    worldState.entities.forEach(entity => {
      const x = mapX + (entity.x + 500) * scale;
      const y = mapY + (entity.y + 500) * scale;
      
      this.ctx.fillStyle = entity.color;
      this.ctx.beginPath();
      this.ctx.arc(x, y, 2, 0, Math.PI * 2);
      this.ctx.fill();
    });
    
    // Render buildings on minimap
    worldState.buildings.forEach(building => {
      const x = mapX + (building.x + 500) * scale;
      const y = mapY + (building.y + 500) * scale;
      
      this.ctx.fillStyle = '#8b4513';
      this.ctx.fillRect(x - 1, y - 1, 2, 2);
    });
    
    // Camera position
    const camX = mapX + (this.camera.x + 500) * scale;
    const camY = mapY + (this.camera.y + 500) * scale;
    
    this.ctx.strokeStyle = 'red';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(camX - 10, camY - 10, 20, 20);
  }
  
  addParticle(particle: Particle): void {
    this.particles.push(particle);
    
    // Limit particle count for performance
    if (this.particles.length > 500) {
      this.particles = this.particles.slice(-400);
    }
  }
  
  setCamera(x: number, y: number, zoom: number): void {
    this.camera.x = x;
    this.camera.y = y;
    this.camera.zoom = zoom;
  }
  
  getCamera(): {x: number; y: number; zoom: number} {
    return { ...this.camera };
  }
}
