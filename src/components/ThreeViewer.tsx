
import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Grid, 
  Environment, 
  Center,
  useGLTF,
  Bounds,
  useBounds,
  Html,
  Stats
} from '@react-three/drei';
import { Button } from './ui/button';
import { Spinner } from './ui/spinner';
import { RotateCcw, ZoomIn, ZoomOut, Maximize2, FileDown, Grid as GridIcon, Layers, Info } from 'lucide-react';
import * as THREE from 'three';

// Import loaders from three/addons
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

interface ThreeViewerProps {
  modelUrl?: string;
  modelType?: 'obj' | 'stl' | 'glb' | 'gltf';
  showStats?: boolean;
}

const Model = ({ url, type, onLoadingComplete }: { 
  url?: string; 
  type?: string;
  onLoadingComplete?: () => void;
}) => {
  const [model, setModel] = useState<THREE.Object3D | null>(null);
  const [isLoading, setIsLoading] = useState(url ? true : false);
  const [error, setError] = useState<string | null>(null);
  const { camera } = useThree();
  
  useEffect(() => {
    if (!url) {
      // Default cube when no model is provided
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshStandardMaterial({ color: "#6373f2", roughness: 0.3, metalness: 0.1 });
      const mesh = new THREE.Mesh(geometry, material);
      setModel(mesh);
      if (onLoadingComplete) onLoadingComplete();
      return;
    }

    setIsLoading(true);
    setError(null);

    const loadModel = async () => {
      try {
        let loadedModel: THREE.Object3D;
        
        if (type === 'glb' || type === 'gltf') {
          const gltfLoader = new GLTFLoader();
          const gltf = await new Promise<any>((resolve, reject) => 
            gltfLoader.load(url, resolve, undefined, reject)
          );
          loadedModel = gltf.scene;
        } else if (type === 'obj') {
          const objLoader = new OBJLoader();
          loadedModel = await new Promise<THREE.Group>((resolve, reject) => 
            objLoader.load(url, resolve, undefined, reject)
          );
        } else if (type === 'stl') {
          const stlLoader = new STLLoader();
          const geometry = await new Promise<THREE.BufferGeometry>((resolve, reject) => 
            stlLoader.load(url, resolve, undefined, reject)
          );
          
          const material = new THREE.MeshStandardMaterial({ 
            color: "#6373f2", 
            roughness: 0.3, 
            metalness: 0.1 
          });
          
          // Create a mesh from the geometry
          loadedModel = new THREE.Mesh(geometry, material);
        } else {
          throw new Error("Unsupported file type");
        }

        // Center and normalize the model
        const box = new THREE.Box3().setFromObject(loadedModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2 / maxDim;
        
        loadedModel.position.set(-center.x, -center.y, -center.z);
        loadedModel.scale.multiplyScalar(scale);
        
        setModel(loadedModel);
        if (onLoadingComplete) onLoadingComplete();
      } catch (err) {
        console.error('Error loading model:', err);
        setError(err instanceof Error ? err.message : "Failed to load model");
      } finally {
        setIsLoading(false);
      }
    };

    loadModel();
  }, [url, type, onLoadingComplete]);

  if (isLoading) {
    return (
      <Html center>
        <div className="flex flex-col items-center">
          <Spinner size="lg" />
          <p className="mt-2 text-white bg-black/50 px-3 py-1 rounded-md">Loading model...</p>
        </div>
      </Html>
    );
  }

  if (error) {
    return (
      <Html center>
        <div className="text-red-500 bg-black/50 p-3 rounded-md">
          Error: {error}
        </div>
      </Html>
    );
  }

  return model ? <primitive object={model} /> : null;
};

const SceneContainer = ({ children, onFit }: { children: React.ReactNode; onFit: () => void }) => {
  const bounds = useBounds();
  
  useEffect(() => {
    // Fit view to model after a short delay to ensure model is loaded
    const timer = setTimeout(() => {
      bounds.refresh().fit();
      onFit();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [bounds, onFit]);
  
  return (
    <Bounds clip observe margin={1.2}>
      <Center>{children}</Center>
    </Bounds>
  );
};

const ThreeViewer: React.FC<ThreeViewerProps> = ({ 
  modelUrl,
  modelType = 'obj',
  showStats = false
}) => {
  const [is2DView, setIs2DView] = useState(false);
  const [wireframe, setWireframe] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [isLoading, setIsLoading] = useState(!!modelUrl);
  const [controlsEnabled, setControlsEnabled] = useState(true);
  const [showInfo, setShowInfo] = useState(false);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    setControlsEnabled(true);
  };

  const handleFitComplete = () => {
    // Additional actions after the model is fitted to view
  };

  const handleDownload = () => {
    if (modelUrl) {
      const link = document.createElement('a');
      link.href = modelUrl;
      link.download = modelUrl.split('/').pop() || 'model';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const toggleFullscreen = () => {
    const container = document.querySelector('.model-container');
    if (container) {
      if (!document.fullscreenElement) {
        container.requestFullscreen?.().catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
      } else {
        document.exitFullscreen?.();
      }
    }
  };

  return (
    <div className="model-container relative w-full h-full rounded-xl overflow-hidden border border-border">
      <Canvas
        shadows
        className={`${wireframe ? 'wireframe-mode' : ''}`}
        gl={{ antialias: true, alpha: true }}
      >
        {showStats && <Stats />}
        
        <PerspectiveCamera makeDefault position={is2DView ? [0, 10, 0] : [5, 5, 5]} />
        
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 7.5]} intensity={1} castShadow />
        
        <SceneContainer onFit={handleFitComplete}>
          <Model url={modelUrl} type={modelType} onLoadingComplete={handleLoadingComplete} />
        </SceneContainer>
        
        {showGrid && <Grid infiniteGrid fadeDistance={30} />}
        <OrbitControls 
          enableRotate={!is2DView && controlsEnabled} 
          enablePan={controlsEnabled}
          enableZoom={controlsEnabled}
          makeDefault
        />
        <Environment preset="city" />
      </Canvas>
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <Spinner size="xl" />
            <p className="mt-4 text-white">Loading model...</p>
          </div>
        </div>
      )}
      
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button
          variant="secondary"
          size="icon"
          onClick={() => {
            const controls = document.querySelector('.model-container canvas')
              ?.parentElement?.querySelector('.orbit-controls');
            if (controls) {
              (controls as any).dollyIn(0.9);
            }
          }}
          aria-label="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        
        <Button
          variant="secondary"
          size="icon"
          onClick={() => {
            const controls = document.querySelector('.model-container canvas')
              ?.parentElement?.querySelector('.orbit-controls');
            if (controls) {
              (controls as any).dollyOut(0.9);
            }
          }}
          aria-label="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        
        <Button
          variant="secondary"
          size="icon"
          onClick={() => {
            const bounds = document.querySelector('.model-container canvas')
              ?.parentElement?.querySelector('.bounds');
            if (bounds) {
              (bounds as any).refresh().fit();
            }
          }}
          aria-label="Reset View"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        
        <Button
          variant={wireframe ? "default" : "secondary"}
          size="icon"
          onClick={() => setWireframe(!wireframe)}
          aria-label="Toggle Wireframe"
        >
          <Layers className="h-4 w-4" />
        </Button>
        
        <Button
          variant={showGrid ? "secondary" : "default"}
          size="icon"
          onClick={() => setShowGrid(!showGrid)}
          aria-label="Toggle Grid"
        >
          <GridIcon className="h-4 w-4" />
        </Button>
        
        <Button
          variant={is2DView ? "default" : "secondary"}
          size="icon"
          onClick={() => setIs2DView(!is2DView)}
          aria-label="Toggle 2D View"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
        
        <Button
          variant={showInfo ? "default" : "secondary"}
          size="icon"
          onClick={() => setShowInfo(!showInfo)}
          aria-label="Show Model Info"
        >
          <Info className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="absolute bottom-4 right-4 flex gap-2">
        <Button
          variant="secondary"
          className="flex items-center gap-2"
          onClick={toggleFullscreen}
        >
          <Maximize2 className="h-4 w-4" />
          <span>Fullscreen</span>
        </Button>
        
        <Button
          variant="secondary"
          className="flex items-center gap-2"
          onClick={handleDownload}
          disabled={!modelUrl}
        >
          <FileDown className="h-4 w-4" />
          <span>Download</span>
        </Button>
      </div>
      
      {showInfo && modelUrl && (
        <div className="absolute top-4 left-4 p-4 bg-background/90 backdrop-blur-sm border border-border rounded-md shadow-md max-w-xs">
          <h3 className="font-medium mb-2">Model Information</h3>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Type:</span> {modelType.toUpperCase()}</p>
            <p><span className="font-medium">File:</span> {modelUrl.split('/').pop()}</p>
            {/* More model info would be available with real server integration */}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreeViewer;
