
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center } from '@react-three/drei';
import { Button } from './ui/button';
import { RotateCcw, ZoomIn, ZoomOut, Maximize2, FileDown } from 'lucide-react';

// Scene component that contains all the 3D elements
const Scene = ({ modelUrl, modelType = 'obj' }) => {
  const { scene, camera, gl } = useThree();
  const modelRef = useRef();
  
  useEffect(() => {
    // Set up scene
    scene.background = new THREE.Color(0xf5f5f7);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // If no model provided, add a default cube
    if (!modelUrl && !modelRef.current) {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshStandardMaterial({ 
        color: 0x6373f2,
        roughness: 0.3,
        metalness: 0.1
      });
      const cube = new THREE.Mesh(geometry, material);
      cube.castShadow = true;
      cube.receiveShadow = true;
      scene.add(cube);
      modelRef.current = cube;
    }
    
    // Load model if URL is provided
    if (modelUrl) {
      loadModel();
    }
    
    return () => {
      if (modelRef.current) {
        scene.remove(modelRef.current);
      }
    };
  }, [modelUrl, modelType]);
  
  const loadModel = async () => {
    // Clear previous model
    if (modelRef.current) {
      scene.remove(modelRef.current);
    }
    
    // In a real implementation, we would load the model based on modelType
    // For now, we're just creating a placeholder model
    if (modelType === 'obj' || modelType === 'stl') {
      const geometry = new THREE.SphereGeometry(1, 32, 32);
      const material = new THREE.MeshStandardMaterial({
        color: 0x6373f2,
        roughness: 0.3,
        metalness: 0.1
      });
      const model = new THREE.Mesh(geometry, material);
      model.castShadow = true;
      model.receiveShadow = true;
      scene.add(model);
      modelRef.current = model;
    } else if (modelType === 'glb') {
      try {
        // Note: In a real implementation, we would use useGLTF hook properly
        const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
        const material = new THREE.MeshStandardMaterial({
          color: 0x6373f2,
          roughness: 0.3,
          metalness: 0.1
        });
        const model = new THREE.Mesh(geometry, material);
        model.castShadow = true;
        model.receiveShadow = true;
        scene.add(model);
        modelRef.current = model;
      } catch (error) {
        console.error('Error loading GLB model:', error);
      }
    }
  };

  return (
    <>
      <gridHelper args={[10, 10, 0x888888, 0xcccccc]} />
      <axesHelper args={[5]} />
      <OrbitControls 
        enableDamping 
        dampingFactor={0.05} 
      />
    </>
  );
};

interface ThreeViewerProps {
  modelUrl?: string;
  modelType?: 'obj' | 'stl' | 'glb';
}

const ThreeViewer: React.FC<ThreeViewerProps> = ({ 
  modelUrl, 
  modelType = 'obj'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [is2DView, setIs2DView] = useState(false);
  const [cameraPosition, setCameraPosition] = useState([5, 5, 5]);
  
  // Toggle 2D/3D view
  useEffect(() => {
    if (is2DView) {
      setCameraPosition([0, 10, 0]);
    } else {
      setCameraPosition([5, 5, 5]);
    }
  }, [is2DView]);
  
  // Handle zoom in/out
  const handleZoom = (zoomIn: boolean) => {
    setCameraPosition(prev => {
      const factor = zoomIn ? 0.8 : 1.2;
      return prev.map(coord => coord * factor) as [number, number, number];
    });
  };
  
  // Handle reset view
  const handleReset = () => {
    setCameraPosition([5, 5, 5]);
  };
  
  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-border">
      <div 
        ref={containerRef} 
        className="w-full h-full three-canvas" 
        style={{ touchAction: 'none' }}
      >
        <Canvas
          shadows
          camera={{ position: cameraPosition, fov: 75 }}
          gl={{ antialias: true }}
        >
          <Scene modelUrl={modelUrl} modelType={modelType} />
        </Canvas>
      </div>
      
      {/* Controls overlay */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button 
          variant="secondary" 
          size="icon" 
          onClick={() => handleZoom(true)}
          aria-label="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button 
          variant="secondary" 
          size="icon" 
          onClick={() => handleZoom(false)}
          aria-label="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button 
          variant="secondary" 
          size="icon" 
          onClick={handleReset}
          aria-label="Reset View"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button 
          variant={is2DView ? "default" : "secondary"} 
          size="icon" 
          onClick={() => setIs2DView(!is2DView)}
          aria-label="Toggle 2D View"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Export overlay */}
      <div className="absolute bottom-4 right-4">
        <Button variant="secondary" className="flex items-center gap-2">
          <FileDown className="h-4 w-4" />
          <span>Export</span>
        </Button>
      </div>
    </div>
  );
};

export default ThreeViewer;
