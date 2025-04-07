
import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Grid, 
  Environment, 
  Center,
  useGLTF
} from '@react-three/drei';
import { Button } from './ui/button';
import { RotateCcw, ZoomIn, ZoomOut, Maximize2, FileDown } from 'lucide-react';

interface ThreeViewerProps {
  modelUrl?: string;
  modelType?: 'obj' | 'stl' | 'glb';
}

const Model = ({ url, type }: { url?: string; type?: string }) => {
  if (!url) {
    // Default cube when no model is provided
    return (
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#6373f2" roughness={0.3} metalness={0.1} />
      </mesh>
    );
  }

  if (type === 'glb') {
    const { scene } = useGLTF(url);
    return <primitive object={scene} />;
  }

  // For simplicity, we'll render a default shape for other formats
  // In a real app, you'd use specific loaders for OBJ and STL
  return (
    <mesh castShadow receiveShadow>
      <sphereGeometry args={[1.5, 32, 32]} />
      <meshStandardMaterial color="#6373f2" roughness={0.3} metalness={0.1} />
    </mesh>
  );
};

const ThreeViewer: React.FC<ThreeViewerProps> = ({ 
  modelUrl,
  modelType = 'obj'
}) => {
  const [is2DView, setIs2DView] = useState(false);
  const [zoom, setZoom] = useState(5);

  const handleZoom = (zoomIn: boolean) => {
    setZoom(prev => zoomIn ? Math.max(2, prev * 0.8) : Math.min(10, prev * 1.2));
  };

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-border">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={is2DView ? [0, 10, 0] : [zoom, zoom, zoom]} />
        
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 7.5]} intensity={1} castShadow />
        
        <Center>
          <Model url={modelUrl} type={modelType} />
        </Center>
        
        <Grid infiniteGrid fadeDistance={30} />
        <OrbitControls enableRotate={!is2DView} />
        <Environment preset="city" />
      </Canvas>
      
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
          onClick={() => setZoom(5)}
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
      
      <div className="absolute bottom-4 right-4">
        <Button
          variant="secondary"
          className="flex items-center gap-2"
        >
          <FileDown className="h-4 w-4" />
          <span>Export</span>
        </Button>
      </div>
    </div>
  );
};

export default ThreeViewer;
