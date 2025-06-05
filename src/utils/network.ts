import { v4 as uuidv4 } from 'uuid';
import * as THREE from 'three';
import { PlayerManager } from './players';

// Mock implementation of a networking layer
// In a real app, this would use WebSockets, WebRTC, or a similar technology
export class NetworkManager {
  playerId: string;
  playerManager: PlayerManager | null;
  mockPlayers: Map<string, {position: THREE.Vector3, rotation: THREE.Euler}>;
  connected: boolean;
  updateInterval: NodeJS.Timeout | null;
  
  constructor() {
    this.playerId = uuidv4();
    this.playerManager = null;
    this.mockPlayers = new Map();
    this.connected = false;
    this.updateInterval = null;
    
    // Create some mock players at fixed positions
    this.createMockPlayers();
  }
  
  connect(playerManager: PlayerManager) {
    this.playerManager = playerManager;
    this.connected = true;
    
    // Add mock players to the scene
    this.mockPlayers.forEach((data, id) => {
      this.playerManager?.addPlayer(id, data.position);
    });
    
    // Start updating mock players
    this.startMockUpdates();
    
    console.log(`Connected with player ID: ${this.playerId}`);
    return this.playerId;
  }
  
  disconnect() {
    this.connected = false;
    
    // Stop mock player updates
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    
    // Remove mock players
    if (this.playerManager) {
      this.mockPlayers.forEach((_, id) => {
        this.playerManager?.removePlayer(id);
      });
    }
    
    console.log('Disconnected from network');
  }
  
  updatePlayerPosition(position: THREE.Vector3, rotation: THREE.Euler) {
    // In a real implementation, this would send the data to a server
    // Here we just update local state
    if (!this.connected) return;
    
    // console.log(`Updated position: ${position.x}, ${position.y}, ${position.z}`);
  }
  
  private createMockPlayers() {
    // Create 5 mock players at various positions
    const positions = [
      new THREE.Vector3(10, 0, 10),
      new THREE.Vector3(-15, 0, 20),
      new THREE.Vector3(25, 0, -15),
      new THREE.Vector3(-20, 0, -25),
      new THREE.Vector3(5, 0, -30)
    ];
    
    positions.forEach((pos) => {
      const id = uuidv4();
      this.mockPlayers.set(id, {
        position: pos,
        rotation: new THREE.Euler(0, Math.random() * Math.PI * 2, 0, 'YXZ')
      });
    });
  }
  
  private startMockUpdates() {
    // Make mock players move around randomly
    this.updateInterval = setInterval(() => {
      if (!this.playerManager) return;
      
      this.mockPlayers.forEach((data, id) => {
        // Random movement
        data.position.x += (Math.random() - 0.5) * 0.1;
        data.position.z += (Math.random() - 0.5) * 0.1;
        
        // Random rotation
        if (Math.random() > 0.95) {
          data.rotation.y = Math.random() * Math.PI * 2;
        }
        
        // Update player in scene
        this.playerManager?.updatePlayer(id, data.position, data.rotation);
      });
    }, 100);
  }
}
