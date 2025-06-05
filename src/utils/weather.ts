import * as THREE from 'three';

// Enum for different weather states
export enum WeatherType {
  CLEAR,
  CLOUDY,
  RAINY,
  FOGGY
}

export class WeatherSystem {
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private currentWeather: WeatherType;
  private rainDrops: THREE.Points | null = null;
  private fog: THREE.FogExp2 | null = null;
  private originalFog: THREE.FogExp2 | null = null;
  
  constructor(scene: THREE.Scene, camera: THREE.Camera) {
    this.scene = scene;
    this.camera = camera;
    this.currentWeather = WeatherType.CLEAR;
    this.originalFog = scene.fog as THREE.FogExp2;
  }
  
  setWeather(weather: WeatherType) {
    // Clear previous weather effects
    this.clearWeatherEffects();
    
    // Set new weather
    this.currentWeather = weather;
    
    switch (weather) {
      case WeatherType.CLEAR:
        this.setClearWeather();
        break;
      case WeatherType.CLOUDY:
        this.setCloudyWeather();
        break;
      case WeatherType.RAINY:
        this.setRainyWeather();
        break;
      case WeatherType.FOGGY:
        this.setFoggyWeather();
        break;
    }
  }
  
  update(deltaTime: number) {
    if (this.currentWeather === WeatherType.RAINY && this.rainDrops) {
      // Update rain animation
      const positions = (this.rainDrops.geometry as THREE.BufferGeometry).attributes.position.array;
      
      for (let i = 0; i < positions.length; i += 3) {
        // Move rain downward
        positions[i + 1] -= (Math.random() * 3 + 5) * deltaTime;
        
        // If rain drop is too low, reset it to the top
        if (positions[i + 1] < 0) {
          positions[i] = (Math.random() - 0.5) * 100; // Random x
          positions[i + 1] = 50; // Reset to top
          positions[i + 2] = (Math.random() - 0.5) * 100; // Random z
        }
      }
      
      (this.rainDrops.geometry as THREE.BufferGeometry).attributes.position.needsUpdate = true;
    }
  }
  
  private clearWeatherEffects() {
    // Remove rain
    if (this.rainDrops) {
      this.scene.remove(this.rainDrops);
      this.rainDrops = null;
    }
    
    // Reset fog
    if (this.originalFog) {
      this.scene.fog = this.originalFog.clone();
    }
  }
  
  private setClearWeather() {
    // Just reset to default settings
    if (this.originalFog) {
      this.scene.fog = this.originalFog.clone();
    } else {
      this.scene.fog = new THREE.FogExp2(0x87ceeb, 0.002);
    }
    
    // Maybe enhance sky brightness
  }
  
  private setCloudyWeather() {
    // Darken the fog a bit for cloudy appearance
    this.scene.fog = new THREE.FogExp2(0x9ca3af, 0.003); // Greyish fog
  }
  
  private setRainyWeather() {
    // Add darker fog
    this.scene.fog = new THREE.FogExp2(0x7a8591, 0.004);
    
    // Create rain particles
    const rainCount = 5000;
    const rainGeometry = new THREE.BufferGeometry();
    const rainPositions = [];
    
    for (let i = 0; i < rainCount; i++) {
      // Random positions around the camera
      rainPositions.push(
        (Math.random() - 0.5) * 100, // x
        Math.random() * 50,         // y
        (Math.random() - 0.5) * 100  // z
      );
    }
    
    rainGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(rainPositions, 3)
    );
    
    // Simple rain drops as points
    const rainMaterial = new THREE.PointsMaterial({
      color: 0xccccff,
      size: 0.2,
      transparent: true,
      opacity: 0.6
    });
    
    this.rainDrops = new THREE.Points(rainGeometry, rainMaterial);
    this.scene.add(this.rainDrops);
  }
  
  private setFoggyWeather() {
    // Heavy fog
    this.scene.fog = new THREE.FogExp2(0xd0d0d8, 0.013); // Dense white-ish fog
  }
  
  // Cycle to next weather
  cycleWeather() {
    const nextWeather = (this.currentWeather + 1) % 4;
    this.setWeather(nextWeather);
    return this.getWeatherName(nextWeather);
  }
  
  getWeatherName(weather: WeatherType = this.currentWeather): string {
    switch (weather) {
      case WeatherType.CLEAR: return "Clear";
      case WeatherType.CLOUDY: return "Cloudy";
      case WeatherType.RAINY: return "Rainy";
      case WeatherType.FOGGY: return "Foggy";
      default: return "Unknown";
    }
  }
}
