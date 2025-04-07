
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';

const BackgroundScene = () => {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      
      {/* Grid */}
      <gridHelper args={[20, 20, 0x6373f2, 0xc7d7fe]} position={[0, -5, 0]} rotation={[Math.PI / 2, 0, 0]} />
      
      {/* Wireframe objects */}
      {Array.from({ length: 15 }).map((_, i) => {
        const position = [
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 10 - 10,
        ];
        
        const rotation = [
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          0,
        ];
        
        const shapes = [
          <boxGeometry args={[2, 2, 2]} />,
          <sphereGeometry args={[1.5, 32, 32]} />,
          <tetrahedronGeometry args={[2]} />,
          <torusGeometry args={[1, 0.5, 16, 100]} />,
          <coneGeometry args={[1.5, 3, 32]} />,
        ];
        
        const randomShape = Math.floor(Math.random() * shapes.length);
        
        return (
          <mesh 
            key={i} 
            position={position as [number, number, number]} 
            rotation={rotation as [number, number, number]}
          >
            {shapes[randomShape]}
            <meshBasicMaterial wireframe color={0x6373f2} />
          </mesh>
        );
      })}
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
