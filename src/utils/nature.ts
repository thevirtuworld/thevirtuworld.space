import * as THREE from 'three';

// Create a procedural tree using basic Three.js geometries
function createTree(): THREE.Group {
  const tree = new THREE.Group();
  
  // Create the trunk
  const trunkHeight = Math.random() * 2 + 3; // 3-5 units tall
  const trunkRadius = Math.random() * 0.2 + 0.2; // 0.2-0.4 units radius
  const trunkGeometry = new THREE.CylinderGeometry(
    trunkRadius * 0.7, // top radius slightly smaller than bottom
    trunkRadius,       // bottom radius
    trunkHeight,
    8                  // segments
  );
  const trunkMaterial = new THREE.MeshStandardMaterial({
    color: 0x8B4513,   // Brown color for trunk
    roughness: 0.9,
    metalness: 0.1,
  });
  const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
  trunk.position.y = trunkHeight / 2;
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  tree.add(trunk);
  
  // Create the foliage
  const foliageSize = Math.random() * 1.5 + 2; // 2-3.5 units
  const foliageHeight = trunkHeight - 0.5;
  const foliageGeometry = new THREE.ConeGeometry(
    foliageSize,
    foliageSize * 1.5,
    8
  );
  
  // Randomly choose between different green colors for foliage
  const colors = [
    0x2E8B57, // sea green
    0x228B22, // forest green
    0x006400, // dark green
    0x556B2F  // olive green
  ];
  const foliageColor = colors[Math.floor(Math.random() * colors.length)];
  
  const foliageMaterial = new THREE.MeshStandardMaterial({
    color: foliageColor,
    roughness: 0.8,
    metalness: 0.1
  });
  
  const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
  foliage.position.y = foliageHeight + foliageSize * 0.7;
  foliage.castShadow = true;
  foliage.receiveShadow = true;
  tree.add(foliage);
  
  // Sometimes add a second layer of foliage to create a fuller tree
  if (Math.random() > 0.5) {
    const foliage2 = new THREE.Mesh(
      new THREE.ConeGeometry(foliageSize * 0.8, foliageSize * 1.2, 8),
      foliageMaterial
    );
    foliage2.position.y = foliageHeight;
    foliage2.castShadow = true;
    foliage2.receiveShadow = true;
    tree.add(foliage2);
  }
  
  return tree;
}

function createBush(): THREE.Group {
  const bush = new THREE.Group();
  
  // Create various sized spheres clustered together to form a bush
  const bushSize = Math.random() * 0.5 + 0.6; // 0.6-1.1 units
  
  // Randomly choose between different green colors
  const colors = [
    0x2E8B57, // sea green
    0x228B22, // forest green
    0x006400, // dark green
    0x556B2F  // olive green
  ];
  const bushColor = colors[Math.floor(Math.random() * colors.length)];
  
  const bushMaterial = new THREE.MeshStandardMaterial({
    color: bushColor,
    roughness: 0.8,
    metalness: 0.1
  });
  
  // Main bush body
  const mainGeometry = new THREE.SphereGeometry(bushSize, 8, 6);
  const mainBush = new THREE.Mesh(mainGeometry, bushMaterial);
  mainBush.position.y = bushSize;
  mainBush.castShadow = true;
  mainBush.receiveShadow = true;
  bush.add(mainBush);
  
  // Add some smaller spheres to create a less uniform look
  const clusterCount = Math.floor(Math.random() * 4) + 2; // 2-5 clusters
  for (let i = 0; i < clusterCount; i++) {
    const clusterSize = bushSize * (Math.random() * 0.4 + 0.3); // 30%-70% of main size
    const clusterGeometry = new THREE.SphereGeometry(clusterSize, 8, 6);
    const cluster = new THREE.Mesh(clusterGeometry, bushMaterial);
    
    // Position cluster slightly offset from center and adjust height
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * bushSize * 0.5;
    cluster.position.set(
      Math.cos(angle) * distance,
      bushSize + (Math.random() - 0.5) * bushSize * 0.5,
      Math.sin(angle) * distance
    );
    
    cluster.castShadow = true;
    cluster.receiveShadow = true;
    bush.add(cluster);
  }
  
  return bush;
}

function createRock(): THREE.Group {
  const rock = new THREE.Group();
  
  // Use low-poly geometry for rocks
  const size = Math.random() * 1.5 + 0.5;
  // Create irregular rock shape using icosahedron and random vertex displacement
  const rockGeometry = new THREE.IcosahedronGeometry(size, 1);
  
  // Randomize the vertices to make it look more like a rock
  const positionAttribute = rockGeometry.attributes.position;
  const vertex = new THREE.Vector3();
  
  for (let i = 0; i < positionAttribute.count; i++) {
    vertex.fromBufferAttribute(positionAttribute, i);
    
    // Add some random displacement
    vertex.x += (Math.random() - 0.5) * 0.2 * size;
    vertex.y += (Math.random() - 0.5) * 0.2 * size;
    vertex.z += (Math.random() - 0.5) * 0.2 * size;
    
    // Update the position
    positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }
  
  // Update normals after modifying vertices
  rockGeometry.computeVertexNormals();
  
  // Rock material with slight color variation
  const grayValue = Math.random() * 40 + 100;
  const rockMaterial = new THREE.MeshStandardMaterial({ 
    color: new THREE.Color(`rgb(${grayValue}, ${grayValue}, ${grayValue})`),
    roughness: 0.8,
    flatShading: true
  });
  
  const rockMesh = new THREE.Mesh(rockGeometry, rockMaterial);
  rockMesh.position.y = size * 0.5;
  rockMesh.rotation.set(
    Math.random() * Math.PI, 
    Math.random() * Math.PI, 
    Math.random() * Math.PI
  );
  rockMesh.castShadow = true;
  rockMesh.receiveShadow = true;
  rock.add(rockMesh);
  
  return rock;
}

function createWaterFeature(): THREE.Group {
  const waterFeature = new THREE.Group();
  
  // Create a small pond
  const radius = Math.random() * 3 + 4;
  const pondGeometry = new THREE.CircleGeometry(radius, 24);
  const pondMaterial = new THREE.MeshStandardMaterial({
    color: 0x1E90FF,
    transparent: true,
    opacity: 0.8,
    metalness: 0.3,
    roughness: 0.1
  });
  
  const pond = new THREE.Mesh(pondGeometry, pondMaterial);
  pond.rotation.x = -Math.PI / 2;
  pond.position.y = 0.05; // Slightly above ground to avoid z-fighting
  pond.receiveShadow = true;
  waterFeature.add(pond);
  
  // Add a border of rocks around the pond
  const rockCount = Math.ceil(radius * 5);
  for (let i = 0; i < rockCount; i++) {
    const angle = (i / rockCount) * Math.PI * 2;
    const rock = createRock();
    const rockSize = rock.children[0].scale.x;
    
    // Position rocks around the edge
    rock.position.x = Math.cos(angle) * (radius * 1.1);
    rock.position.z = Math.sin(angle) * (radius * 1.1);
    rock.scale.set(0.6, 0.4, 0.6);
    
    // Vary the rock positions slightly
    rock.position.x += (Math.random() - 0.5) * 0.5;
    rock.position.z += (Math.random() - 0.5) * 0.5;
    
    waterFeature.add(rock);
  }
  
  // Maybe add some water plants
  if (Math.random() > 0.5) {
    for (let i = 0; i < Math.random() * 5 + 3; i++) {
      const plantHeight = Math.random() * 1.5 + 0.5;
      const plantGeometry = new THREE.CylinderGeometry(0.05, 0.05, plantHeight, 5);
      const plantMaterial = new THREE.MeshStandardMaterial({
        color: 0x006400,
        roughness: 0.8
      });
      
      const plant = new THREE.Mesh(plantGeometry, plantMaterial);
      
      // Position randomly within the pond
      const distance = Math.random() * (radius * 0.8);
      const angle = Math.random() * Math.PI * 2;
      
      plant.position.set(
        Math.cos(angle) * distance,
        plantHeight / 2,
        Math.sin(angle) * distance
      );
      
      plant.castShadow = true;
      waterFeature.add(plant);
    }
  }
  
  return waterFeature;
}

// Add export keyword to ensure createTreesAndNature is exported from this module
export function createTreesAndNature(x: number, y: number, z: number): THREE.Group {
  const natureGroup = new THREE.Group();
  natureGroup.position.set(x, y, z);
  
  // Determine what kind of nature area this is
  const areaType = Math.random();
  
  if (areaType < 0.7) {
    // Tree cluster
    const treeCount = Math.floor(Math.random() * 5) + 1;
    
    for (let i = 0; i < treeCount; i++) {
      const tree = createTree();
      tree.position.set(
        (Math.random() - 0.5) * 15,
        0,
        (Math.random() - 0.5) * 15
      );
      natureGroup.add(tree);
    }
    
    // Add some bushes around trees
    const bushCount = Math.floor(Math.random() * 8) + 2;
    for (let i = 0; i < bushCount; i++) {
      const bush = createBush();
      bush.position.set(
        (Math.random() - 0.5) * 20,
        0,
        (Math.random() - 0.5) * 20
      );
      natureGroup.add(bush);
    }
  } else if (areaType < 0.9) {
    // Rock formation
    const rockCount = Math.floor(Math.random() * 7) + 3;
    
    for (let i = 0; i < rockCount; i++) {
      const rock = createRock();
      rock.position.set(
        (Math.random() - 0.5) * 10,
        0,
        (Math.random() - 0.5) * 10
      );
      natureGroup.add(rock);
    }
  } else {
    // Water feature
    const waterFeature = createWaterFeature();
    natureGroup.add(waterFeature);
  }
  
  return natureGroup;
}
