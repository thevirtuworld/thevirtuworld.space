import * as THREE from 'three';

export function createBuilding(height: number, width: number, depth: number): THREE.Group {
  const building = new THREE.Group();
  
  // Main building structure
  const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
  
  // Create procedural texture for building
  const buildingTexture = createBuildingTexture(width, depth, height);
  
  const buildingMaterial = new THREE.MeshStandardMaterial({
    map: buildingTexture,
    roughness: 0.7,
    metalness: 0.2
  });
  
  const buildingMesh = new THREE.Mesh(buildingGeometry, buildingMaterial);
  buildingMesh.position.y = height / 2;
  buildingMesh.castShadow = true;
  buildingMesh.receiveShadow = true;
  building.add(buildingMesh);
  
  // Add a roof
  if (Math.random() > 0.5) {
    const roofGeometry = new THREE.ConeGeometry(Math.max(width, depth) / 1.5, height / 4, 4);
    const roofMaterial = new THREE.MeshStandardMaterial({ 
      color: Math.random() > 0.5 ? 0x8B4513 : 0x708090,
      roughness: 0.8 
    });
    
    const roofMesh = new THREE.Mesh(roofGeometry, roofMaterial);
    roofMesh.position.y = height + height / 8;
    roofMesh.rotation.y = Math.PI / 4;
    roofMesh.castShadow = true;
    building.add(roofMesh);
  } else {
    // Flat roof with possible water tanks, AC units, etc.
    const roofDetails = new THREE.Group();
    
    // AC units or water tanks
    for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
      const size = Math.random() * 1.5 + 0.8;
      const boxGeometry = new THREE.BoxGeometry(size, size, size);
      const boxMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x888888,
        roughness: 0.9 
      });
      
      const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
      boxMesh.position.set(
        (Math.random() - 0.5) * (width - size) * 0.7, 
        height + size / 2,
        (Math.random() - 0.5) * (depth - size) * 0.7
      );
      boxMesh.castShadow = true;
      roofDetails.add(boxMesh);
    }
    
    building.add(roofDetails);
  }
  
  // Add doors and windows
  addDoorsAndWindows(building, width, depth, height);
  
  return building;
}

// Add doors and windows to the building
function addDoorsAndWindows(building: THREE.Group, width: number, depth: number, height: number) {
  // Window material - slightly reflective blue glass
  const windowMaterial = new THREE.MeshStandardMaterial({
    color: 0x88ccff,
    metalness: 0.9,
    roughness: 0.1,
    transparent: true,
    opacity: 0.7
  });
  
  // Door material
  const doorMaterial = new THREE.MeshStandardMaterial({
    color: 0x8B4513,
    roughness: 0.8
  });
  
  // Front door
  const doorWidth = Math.min(2, width / 3);
  const doorHeight = Math.min(2.2, height / 2);
  const doorGeometry = new THREE.BoxGeometry(doorWidth, doorHeight, 0.1);
  const door = new THREE.Mesh(doorGeometry, doorMaterial);
  
  door.position.set(0, doorHeight / 2, depth / 2 + 0.05);
  building.add(door);
  
  // Windows - distribute on each side
  const floors = Math.max(1, Math.floor(height / 3));
  const windowsPerFloor = Math.max(1, Math.floor(width / 2));
  
  for (let floor = 0; floor < floors; floor++) {
    const floorHeight = 2.5;
    const baseHeight = floor * floorHeight + floorHeight;
    
    // Skip window generation on ground floor where the door is
    if (floor === 0) continue;
    
    // Front and back windows
    for (let w = 0; w < windowsPerFloor; w++) {
      const windowWidth = 1.2;
      const windowHeight = 1.5;
      const windowGeometry = new THREE.BoxGeometry(windowWidth, windowHeight, 0.05);
      
      // Position windows evenly across the front
      const xPos = ((w / (windowsPerFloor - 1)) - 0.5) * (width - windowWidth);
      
      // Front windows
      const frontWindow = new THREE.Mesh(windowGeometry, windowMaterial);
      frontWindow.position.set(xPos, baseHeight, depth / 2 + 0.05);
      building.add(frontWindow);
      
      // Back windows
      const backWindow = new THREE.Mesh(windowGeometry, windowMaterial);
      backWindow.position.set(xPos, baseHeight, -depth / 2 - 0.05);
      backWindow.rotation.y = Math.PI;
      building.add(backWindow);
    }
    
    // Side windows
    const sideWindowsPerFloor = Math.max(1, Math.floor(depth / 2));
    for (let w = 0; w < sideWindowsPerFloor; w++) {
      const windowWidth = 1.2;
      const windowHeight = 1.5;
      const windowGeometry = new THREE.BoxGeometry(windowWidth, windowHeight, 0.05);
      
      // Position windows evenly across the sides
      const zPos = ((w / (sideWindowsPerFloor - 1)) - 0.5) * (depth - windowWidth);
      
      // Left side windows
      const leftWindow = new THREE.Mesh(windowGeometry, windowMaterial);
      leftWindow.position.set(-width / 2 - 0.05, baseHeight, zPos);
      leftWindow.rotation.y = -Math.PI / 2;
      building.add(leftWindow);
      
      // Right side windows
      const rightWindow = new THREE.Mesh(windowGeometry, windowMaterial);
      rightWindow.position.set(width / 2 + 0.05, baseHeight, zPos);
      rightWindow.rotation.y = Math.PI / 2;
      building.add(rightWindow);
    }
  }
}

// Create a procedural texture for buildings
function createBuildingTexture(width: number, depth: number, height: number): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error("Could not create canvas context");
  }
  
  // Pick a base color for the building
  const colorOptions = [
    '#d9c8b9', // Beige
    '#a88c7d', // Brown
    '#d9d0c9', // Light gray
    '#8f8f8f', // Medium gray
    '#bf9169', // Terracotta
    '#cf9f7f', // Sandstone
    '#a3bec4', // Light blue gray
  ];
  
  const baseColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];
  
  // Fill with base color
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 512, 512);
  
  // Add some texture/noise
  for (let i = 0; i < 50000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const size = Math.random() * 2 + 0.5;
    ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.07})`;
    ctx.fillRect(x, y, size, size);
  }
  
  // Add some brick or panel patterns
  if (Math.random() > 0.5) {
    // Brick pattern
    const brickHeight = 15;
    const brickWidth = 30;
    
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 1;
    
    // Horizontal lines
    for (let y = 0; y < 512; y += brickHeight) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();
    }
    
    // Vertical lines - offset for each row
    for (let y = 0; y < 512; y += brickHeight) {
      const offset = (y / brickHeight % 2) * (brickWidth / 2);
      
      for (let x = offset; x < 512; x += brickWidth) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + brickHeight);
        ctx.stroke();
      }
    }
  } else {
    // Panel pattern
    const panelSize = Math.random() * 40 + 40;
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 2;
    
    // Horizontal lines
    for (let y = 0; y < 512; y += panelSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();
    }
    
    // Vertical lines
    for (let x = 0; x < 512; x += panelSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 512);
      ctx.stroke();
    }
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(width / 5, height / 10);
  
  return texture;
}
