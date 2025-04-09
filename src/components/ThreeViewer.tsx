
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
import { RotateCcw, ZoomIn, ZoomOut, Maximize2, FileDown, Grid as GridIcon, Layers, Info, MessageCircle } from 'lucide-react';
import * as THREE from 'three';

// Import loaders from three/addons
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { ModelPropertyPanel } from './ModelPropertyPanel';

interface ThreeViewerProps {
  modelUrl?: string;
  modelType?: 'obj' | 'stl' | 'glb' | 'gltf';
  showStats?: boolean;
  projectName?: string;
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
      setIsLoading(false);
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
          
          // Apply a standard material to all models
          const material = new THREE.MeshStandardMaterial({ 
            color: "#e0e0e0", 
            roughness: 0.5, 
            metalness: 0.1 
          });
          
          loadedModel = new THREE.Mesh(geometry, material);
        } else {
          throw new Error("Unsupported file type");
        }
        
        // Apply the same material to all models for consistency
        if (type === 'obj' || type === 'glb' || type === 'gltf') {
          loadedModel.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material = new THREE.MeshStandardMaterial({ 
                color: "#e0e0e0", 
                roughness: 0.5, 
                metalness: 0.1 
              });
            }
          });
        }

        // Center the model and adjust scale
        const box = new THREE.Box3().setFromObject(loadedModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        // Get the maximum dimension for scaling
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2 / maxDim;
        
        // Center the model and apply scale
        loadedModel.position.set(-center.x, -center.y + (size.y / 2), -center.z);
        loadedModel.scale.multiplyScalar(scale);
        
        console.log(`Model loaded: ${type}, dimensions:`, size);
        
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
    const timer = setTimeout(() => {
      if (bounds) {
        bounds.refresh().fit();
        onFit();
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [bounds, onFit]);
  
  return (
    <Bounds clip observe margin={1.2}>
      <Center>{children}</Center>
    </Bounds>
  );
};

const ChatbotButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute bottom-4 left-4 z-10">
      {isOpen ? (
        <div className="bg-white shadow-lg rounded-md p-3 w-72 animate-in fade-in slide-in-from-left-2">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">Structure Assistant</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </Button>
          </div>
          <div className="h-48 bg-gray-50 rounded-md p-2 mb-3 overflow-y-auto">
            <p className="text-sm text-gray-500">
              How can I help with your structure design?
            </p>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ask a question..."
              className="flex-1 px-3 py-1 text-sm border rounded-md"
            />
            <Button size="sm">Send</Button>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full h-12 w-12 flex items-center justify-center shadow-md hover:shadow-lg transition-all"
        >
          <MessageCircle className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};

const ThreeViewer: React.FC<ThreeViewerProps> = ({ 
  modelUrl,
  modelType = 'obj',
  showStats = false,
  projectName = "Untitled Project"
}) => {
  const [is2DView, setIs2DView] = useState(false);
  const [wireframe, setWireframe] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [isLoading, setIsLoading] = useState(!!modelUrl);
  const [controlsEnabled, setControlsEnabled] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [showProperties, setShowProperties] = useState(true);

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
    <div className="model-container relative w-full h-full rounded-xl overflow-hidden border border-border flex">
      <div className={`relative flex-1 ${wireframe ? 'wireframe-mode' : ''}`}>
        <Canvas
          shadows
          gl={{ antialias: true, alpha: true }}
          className="w-full h-full"
        >
          {showStats && <Stats />}
          
          <PerspectiveCamera makeDefault position={is2DView ? [0, 10, 0] : [5, 5, 5]} />
          
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 10, 7.5]} intensity={1} castShadow />
          
          {modelUrl ? (
            <SceneContainer onFit={handleFitComplete}>
              <Model url={modelUrl} type={modelType} onLoadingComplete={handleLoadingComplete} />
            </SceneContainer>
          ) : (
            <Html center>
              <div className="text-center p-4 bg-black/20 rounded-lg backdrop-blur-sm">
                <p className="text-white">No model loaded</p>
                <p className="text-white/70 text-sm mt-1">Upload a 3D model to view</p>
              </div>
            </Html>
          )}
          
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
          
          <Button
            variant={showProperties ? "default" : "secondary"}
            size="icon"
            onClick={() => setShowProperties(!showProperties)}
            aria-label="Toggle Properties Panel"
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
            </div>
          </div>
        )}
        
        <ChatbotButton />
      </div>
      
      {showProperties && (
        <ModelPropertyPanel 
          projectName={projectName}
          onClose={() => setShowProperties(false)}
        />
      )}
    </div>
  );
};

export default ThreeViewer;
