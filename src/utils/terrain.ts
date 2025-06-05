import * as THREE from 'three';
import { createNoise2D } from 'simplex-noise';

// Generate procedural terrain using Simplex noise
export function createTerrain() {
  const noise2D = createNoise2D();
  
  // Create a large ground plane
  const geometry = new THREE.PlaneGeometry(1000, 1000, 128, 128);
  
  // Apply height modifications based on noise
  const vertices = geometry.attributes.position.array;
  for (let i = 0; i < vertices.length; i += 3) {
    const x = vertices[i];
    const z = vertices[i + 2];
    
    // Skip areas near the center (keep center flat for city)
    const distFromCenter = Math.sqrt(x * x + z * z);
    
    if (distFromCenter > 50) {
      // Apply multiple frequencies of noise for natural-looking terrain
      const scale1 = 0.01;
      const scale2 = 0.05;
      const scale3 = 0.2;
      
      const noise1 = noise2D(x * scale1, z * scale1);
      const noise2 = noise2D(x * scale2, z * scale2) * 0.5;
      const noise3 = noise2D(x * scale3, z * scale3) * 0.25;
      
      const combinedNoise = noise1 + noise2 + noise3;
      
      // Smooth transition from flat city center to hilly terrain
      const terrainHeightFactor = Math.min(1, (distFromCenter - 50) / 50);
      vertices[i + 1] = combinedNoise * 15 * terrainHeightFactor;
    }
  }
  
  // Update normals for proper lighting
  geometry.computeVertexNormals();
  
  // Create materials for the terrain
  const grassTexture = createGrassTexture();
  const material = new THREE.MeshStandardMaterial({
    map: grassTexture,
    roughness: 0.8,
    metalness: 0.1,
  });
  
  // Create the mesh
  const terrain = new THREE.Mesh(geometry, material);
  terrain.rotation.x = -Math.PI / 2; // Rotate to be horizontal
  terrain.receiveShadow = true;
  
  return terrain;
}

// Create a procedural grass texture
function createGrassTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error("Could not create canvas context");
  }
  
  // Draw base grass color
  ctx.fillStyle = '#4a7c59';
  ctx.fillRect(0, 0, 256, 256);
  
  // Add texture/noise to grass
  for (let i = 0; i < 50000; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const size = Math.random() * 2 + 0.5;
    
    // Randomly vary the grass shades
    const colorVariation = Math.floor(Math.random() * 20 - 10);
    ctx.fillStyle = `rgb(${74 + colorVariation}, ${124 + colorVariation}, ${89 + colorVariation})`;
    ctx.fillRect(x, y, size, size);
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(32, 32);
  
  return texture;
}
