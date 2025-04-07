
import React from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

const BackgroundScene = () => {
  // Create wireframe grid
  const gridHelper = React.useMemo(() => {
    const grid = new THREE.GridHelper(20, 20, 0x6373f2, 0xc7d7fe);
    grid.position.y = -5;
    grid.rotation.x = Math.PI / 2;
    return grid;
  }, []);
  
  // Define geometries
  const geometries = React.useMemo(() => [
    new THREE.BoxGeometry(2, 2, 2),
    new THREE.SphereGeometry(1.5, 32, 32),
    new THREE.TetrahedronGeometry(2),
    new THREE.TorusGeometry(1, 0.5, 16, 100),
    new THREE.ConeGeometry(1.5, 3, 32),
  ], []);
  
  // Create objects
  const objects = React.useMemo(() => {
    const material = new THREE.MeshBasicMaterial({
      color: 0x6373f2,
      wireframe: true,
    });
    
    const meshes = [];
    for (let i = 0; i < 15; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const mesh = new THREE.Mesh(geometry, material);
      
      // Random position
      mesh.position.x = (Math.random() - 0.5) * 30;
      mesh.position.y = (Math.random() - 0.5) * 30;
      mesh.position.z = (Math.random() - 0.5) * 10 - 10;
      
      // Random rotation
      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;
      
      meshes.push(mesh);
    }
    
    return meshes;
  }, [geometries]);
  
  // Animate objects
  React.useEffect(() => {
    // Add objects to scene
    const scene = new THREE.Scene();
    scene.add(gridHelper);
    objects.forEach(obj => scene.add(obj));
    
    // Rotation animation
    const interval = setInterval(() => {
      objects.forEach((obj, i) => {
        obj.rotation.x += 0.001 + (i % 3) * 0.001;
        obj.rotation.y += 0.002 + (i % 2) * 0.001;
      });
      
      gridHelper.rotation.z += 0.0005;
    }, 16);
    
    return () => {
      clearInterval(interval);
      objects.forEach(obj => {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach(m => m.dispose());
        } else {
          obj.material.dispose();
        }
      });
    };
  }, [gridHelper, objects]);
  
  return (
    <>
      {/* The scene is populated in useEffect */}
    </>
  );
};

const ThreeBackground: React.FC = () => {
  return (
    <div 
      className="absolute inset-0 -z-10 opacity-70"
      aria-hidden="true"
    >
      <Canvas
        camera={{
          position: [0, 0, 20],
          fov: 60,
        }}
        gl={{ alpha: true, antialias: true }}
      >
        <BackgroundScene />
      </Canvas>
    </div>
  );
};

export default ThreeBackground;
