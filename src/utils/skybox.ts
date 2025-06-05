import * as THREE from 'three';

export function createProceduralSkybox(): THREE.Mesh {
  // Create a large sphere to serve as our sky
  const geometry = new THREE.SphereGeometry(500, 60, 40);
  // Invert the geometry so that the texture is displayed on the inside of the sphere
  geometry.scale(-1, 1, 1);
  
  // Create a canvas for the sky texture
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error("Could not create canvas context");
  }
  
  // Create a gradient for the sky
  const gradient = ctx.createLinearGradient(0, 0, 0, 512);
  gradient.addColorStop(0, '#0077FF'); // Deep blue at the top
  gradient.addColorStop(0.4, '#87CEEB'); // Sky blue in the middle
  gradient.addColorStop(0.7, '#B0E0E6'); // Light blue near horizon
  gradient.addColorStop(1, '#FFFFFF'); // White at horizon
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1024, 512);
  
  // Add some clouds
  drawClouds(ctx, 1024, 512);
  
  // Create the texture and material
  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.BackSide, // Render on the inside
  });
  
  return new THREE.Mesh(geometry, material);
}

function drawClouds(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const cloudCount = 30;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  
  for (let i = 0; i < cloudCount; i++) {
    // Position clouds mostly in the middle part of the sky
    const x = Math.random() * width;
    const y = Math.random() * height * 0.5 + height * 0.2;
    const cloudWidth = Math.random() * 150 + 100;
    const cloudHeight = Math.random() * 40 + 20;
    
    // Draw a cloud as a collection of overlapping circles
    const circles = Math.floor(Math.random() * 5) + 5;
    for (let j = 0; j < circles; j++) {
      const circleX = x + (Math.random() - 0.5) * cloudWidth;
      const circleY = y + (Math.random() - 0.5) * cloudHeight;
      const radius = Math.random() * 30 + 20;
      
      ctx.beginPath();
      ctx.arc(circleX, circleY, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

export function createSunAndMoon(): THREE.Group {
  const group = new THREE.Group();
  
  // Create the sun
  const sunGeometry = new THREE.CircleGeometry(15, 32);
  const sunMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xffff00,
    transparent: true,
    opacity: 0.8
  });
  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  sun.position.set(100, 100, -200);
  sun.lookAt(0, 0, 0);
  group.add(sun);
  
  // Create a sun halo
  const haloGeometry = new THREE.RingGeometry(15, 30, 32);
  const haloMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide
  });
  const halo = new THREE.Mesh(haloGeometry, haloMaterial);
  halo.position.copy(sun.position);
  halo.lookAt(0, 0, 0);
  group.add(halo);
  
  // Create the moon
  const moonGeometry = new THREE.CircleGeometry(10, 32);
  const moonMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xffffff,
    transparent: true,
    opacity: 0.8
  });
  const moon = new THREE.Mesh(moonGeometry, moonMaterial);
  moon.position.set(-100, 100, -200);
  moon.lookAt(0, 0, 0);
  group.add(moon);
  
  return group;
}

export function animateSky(sky: THREE.Group, time: number): void {
  // Rotate the sun and moon around the scene
  const radius = 400;
  const speed = 0.05;
  
  // Sun and moon are the first two children of the sky group
  if (sky.children.length >= 2) {
    const sun = sky.children[0];
    const moon = sky.children[1];
    
    // Position the sun and moon opposite each other in the sky
    sun.position.x = Math.cos(time * speed) * radius;
    sun.position.y = Math.sin(time * speed) * radius;
    sun.position.z = 0;
    sun.lookAt(0, 0, 0);
    
    // Moon is opposite to sun
    moon.position.x = -sun.position.x;
    moon.position.y = -sun.position.y;
    moon.position.z = 0;
    moon.lookAt(0, 0, 0);
  }
}
