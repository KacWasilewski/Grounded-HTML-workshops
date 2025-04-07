
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { Button } from './ui/button';
import { RotateCcw, ZoomIn, ZoomOut, Maximize2, FileDown } from 'lucide-react';

interface ThreeViewerProps {
  modelUrl?: string;
  modelType?: 'obj' | 'stl' | 'glb';
}

const ThreeViewer: React.FC<ThreeViewerProps> = ({ 
  modelUrl, 
  modelType = 'obj'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const [is2DView, setIs2DView] = useState(false);
  
  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Set up scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f7);
    sceneRef.current = scene;
    
    // Set up camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;
    
    // Set up renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Set up controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (
        containerRef.current &&
        rendererRef.current &&
        cameraRef.current
      ) {
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        
        rendererRef.current.setSize(width, height);
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Add a grid helper for reference
    const gridHelper = new THREE.GridHelper(10, 10, 0x888888, 0xcccccc);
    scene.add(gridHelper);
    
    // Add axes helper
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    
    // If no model provided, add a default cube
    if (!modelUrl) {
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
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, []);
  
  // Load model when URL changes
  useEffect(() => {
    if (!modelUrl || !sceneRef.current) return;
    
    // Clear any existing models
    if (sceneRef.current) {
      sceneRef.current.children = sceneRef.current.children.filter(
        child => child.type === 'Light' || child.type === 'Helper'
      );
    }
    
    // Load model based on type
    switch (modelType) {
      case 'obj':
        const objLoader = new OBJLoader();
        objLoader.load(
          modelUrl,
          (object) => {
            if (sceneRef.current) {
              object.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                  child.material = new THREE.MeshStandardMaterial({
                    color: 0x6373f2,
                    roughness: 0.3,
                    metalness: 0.1
                  });
                  child.castShadow = true;
                  child.receiveShadow = true;
                }
              });
              
              sceneRef.current.add(object);
              centerCamera(object);
            }
          },
          (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
          },
          (error) => {
            console.error('Error loading OBJ', error);
          }
        );
        break;
        
      case 'stl':
        const stlLoader = new STLLoader();
        stlLoader.load(
          modelUrl,
          (geometry) => {
            if (sceneRef.current) {
              const material = new THREE.MeshStandardMaterial({
                color: 0x6373f2,
                roughness: 0.3,
                metalness: 0.1
              });
              const mesh = new THREE.Mesh(geometry, material);
              mesh.castShadow = true;
              mesh.receiveShadow = true;
              
              sceneRef.current.add(mesh);
              centerCamera(mesh);
            }
          },
          (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
          },
          (error) => {
            console.error('Error loading STL', error);
          }
        );
        break;
        
      case 'glb':
        const gltfLoader = new GLTFLoader();
        gltfLoader.load(
          modelUrl,
          (gltf) => {
            if (sceneRef.current) {
              const model = gltf.scene;
              
              model.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                  child.castShadow = true;
                  child.receiveShadow = true;
                }
              });
              
              sceneRef.current.add(model);
              centerCamera(model);
            }
          },
          (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
          },
          (error) => {
            console.error('Error loading GLB/GLTF', error);
          }
        );
        break;
    }
  }, [modelUrl, modelType]);
  
  // Toggle 2D/3D view
  useEffect(() => {
    if (!cameraRef.current || !controlsRef.current) return;
    
    if (is2DView) {
      // Set to top-down view (2D-like)
      cameraRef.current.position.set(0, 10, 0);
      cameraRef.current.lookAt(0, 0, 0);
      controlsRef.current.enableRotate = false;
    } else {
      // Reset to 3D view
      cameraRef.current.position.set(5, 5, 5);
      cameraRef.current.lookAt(0, 0, 0);
      controlsRef.current.enableRotate = true;
    }
  }, [is2DView]);
  
  // Helper function to center camera on loaded model
  const centerCamera = (model: THREE.Object3D) => {
    if (!model || !cameraRef.current || !controlsRef.current) return;
    
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = cameraRef.current.fov * (Math.PI / 180);
    let distance = maxDim / (2 * Math.tan(fov / 2));
    
    distance *= 1.5; // Add some padding
    
    model.position.x = -center.x;
    model.position.y = -center.y;
    model.position.z = -center.z;
    
    cameraRef.current.position.set(distance, distance, distance);
    cameraRef.current.lookAt(0, 0, 0);
    
    controlsRef.current.update();
  };
  
  // Handle zoom in/out
  const handleZoom = (zoomIn: boolean) => {
    if (!cameraRef.current) return;
    
    const zoomFactor = zoomIn ? 0.8 : 1.2;
    cameraRef.current.position.multiplyScalar(zoomFactor);
    
    if (controlsRef.current) {
      controlsRef.current.update();
    }
  };
  
  // Handle reset view
  const handleReset = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    
    cameraRef.current.position.set(5, 5, 5);
    cameraRef.current.lookAt(0, 0, 0);
    controlsRef.current.reset();
  };
  
  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-border">
      <div 
        ref={containerRef} 
        className="w-full h-full three-canvas" 
        style={{ touchAction: 'none' }}
      />
      
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
