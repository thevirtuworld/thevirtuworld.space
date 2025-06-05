import * as THREE from 'three';

export class Player {
  id: string;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  mesh: THREE.Group;
  
  constructor(id: string, position: THREE.Vector3, scene: THREE.Scene) {
    this.id = id;
    this.position = position;
    this.rotation = new THREE.Euler(0, 0, 0, 'YXZ');
    this.mesh = createPlayerAvatar();
    
    // Set initial position
    this.mesh.position.copy(position);
    
    scene.add(this.mesh);
  }
  
  update(position: THREE.Vector3, rotation: THREE.Euler) {
    this.position.copy(position);
    this.rotation.copy(rotation);
    this.mesh.position.copy(position);
    this.mesh.rotation.y = rotation.y;
  }
  
  remove(scene: THREE.Scene) {
    scene.remove(this.mesh);
  }
}

export class PlayerManager {
  players: Map<string, Player>;
  scene: THREE.Scene;
  
  constructor(scene: THREE.Scene) {
    this.players = new Map();
    this.scene = scene;
  }
  
  addPlayer(id: string, position: THREE.Vector3) {
    const player = new Player(id, position, this.scene);
    this.players.set(id, player);
    return player;
  }
  
  updatePlayer(id: string, position: THREE.Vector3, rotation: THREE.Euler) {
    const player = this.players.get(id);
    if (player) {
      player.update(position, rotation);
    }
  }
  
  removePlayer(id: string) {
    const player = this.players.get(id);
    if (player) {
      player.remove(this.scene);
      this.players.delete(id);
    }
  }
  
  getPlayers() {
    return Array.from(this.players.values());
  }
}

function createPlayerAvatar(): THREE.Group {
  const avatar = new THREE.Group();
  
  // Create a simple humanoid figure
  
  // Body
  const bodyGeometry = new THREE.CapsuleGeometry(0.3, 0.7, 4, 8);
  const bodyMaterial = new THREE.MeshStandardMaterial({ 
    color: Math.random() * 0xffffff,
    roughness: 0.7 
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.y = 1.1;
  body.castShadow = true;
  avatar.add(body);
  
  // Head
  const headGeometry = new THREE.SphereGeometry(0.25, 16, 16);
  const headMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xffdbac, // Skin tone
    roughness: 0.7 
  });
  const head = new THREE.Mesh(headGeometry, headMaterial);
  head.position.y = 1.85;
  head.castShadow = true;
  avatar.add(head);
  
  // Arms
  const armGeometry = new THREE.CapsuleGeometry(0.1, 0.6, 4, 8);
  const armMaterial = bodyMaterial;
  
  const leftArm = new THREE.Mesh(armGeometry, armMaterial);
  leftArm.position.set(-0.45, 1.2, 0);
  leftArm.rotation.z = Math.PI / 16;
  leftArm.castShadow = true;
  avatar.add(leftArm);
  
  const rightArm = new THREE.Mesh(armGeometry, armMaterial);
  rightArm.position.set(0.45, 1.2, 0);
  rightArm.rotation.z = -Math.PI / 16;
  rightArm.castShadow = true;
  avatar.add(rightArm);
  
  // Legs
  const legGeometry = new THREE.CapsuleGeometry(0.12, 0.7, 4, 8);
  const legMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x1a1a1a,  // Dark color for pants
    roughness: 0.7 
  });
  
  const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
  leftLeg.position.set(-0.2, 0.5, 0);
  leftLeg.castShadow = true;
  avatar.add(leftLeg);
  
  const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
  rightLeg.position.set(0.2, 0.5, 0);
  rightLeg.castShadow = true;
  avatar.add(rightLeg);
  
  // Add a nameplate above the player's head
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const context = canvas.getContext('2d');
  
  if (context) {
    context.font = '32px Arial';
    context.fillStyle = 'rgba(0, 0, 0, 0.8)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(`Player`, canvas.width / 2, canvas.height / 2);
  }
  
  const nameTexture = new THREE.CanvasTexture(canvas);
  const nameMaterial = new THREE.MeshBasicMaterial({
    map: nameTexture,
    transparent: true,
    side: THREE.DoubleSide
  });
  
  const nameGeometry = new THREE.PlaneGeometry(1, 0.25);
  const name = new THREE.Mesh(nameGeometry, nameMaterial);
  name.position.y = 2.3;
  name.rotation.x = -Math.PI / 6; // Tilt slightly for better visibility
  avatar.add(name);
  
  return avatar;
}
