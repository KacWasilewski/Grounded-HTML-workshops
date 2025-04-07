
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ThreeBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Set up scene
    const scene = new THREE.Scene();
    
    // Set up camera
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 20;
    
    // Set up renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    
    // Create wireframe grid
    const size = 20;
    const divisions = 20;
    const gridHelper = new THREE.GridHelper(size, divisions, 0x6373f2, 0xc7d7fe);
    gridHelper.position.y = -5;
    gridHelper.rotation.x = Math.PI / 2;
    scene.add(gridHelper);
    
    // Add geometric shapes
    const geometries = [
      new THREE.BoxGeometry(2, 2, 2),
      new THREE.SphereGeometry(1.5, 32, 32),
      new THREE.TetrahedronGeometry(2),
      new THREE.TorusGeometry(1, 0.5, 16, 100),
      new THREE.ConeGeometry(1.5, 3, 32),
    ];
    
    const material = new THREE.MeshBasicMaterial({
      color: 0x6373f2,
      wireframe: true,
    });
    
    const objects: THREE.Mesh[] = [];
    
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
      
      objects.push(mesh);
      scene.add(mesh);
    }
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate objects
      objects.forEach((obj, i) => {
        obj.rotation.x += 0.001 + (i % 3) * 0.001;
        obj.rotation.y += 0.002 + (i % 2) * 0.001;
      });
      
      // Rotate grid
      gridHelper.rotation.z += 0.0005;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (containerRef.current) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      objects.forEach(obj => {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach(m => m.dispose());
        } else {
          obj.material.dispose();
        }
      });
      
      renderer.dispose();
    };
  }, []);
  
  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 -z-10 opacity-70"
      aria-hidden="true"
    />
  );
};

export default ThreeBackground;
