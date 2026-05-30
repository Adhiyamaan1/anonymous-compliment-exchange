import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

// Floating particle field
function Particles({ count = 120 }) {
  const mesh = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.04;
      mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.1;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#a855f7" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

// Glowing floating orb
function FloatingOrb({ position, color, size = 1 }) {
  const mesh = useRef();
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.3;
      mesh.current.rotation.x = state.clock.elapsedTime * 0.2;
      mesh.current.rotation.z = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <mesh ref={mesh} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.4}
        transparent
        opacity={0.35}
        wireframe
      />
    </mesh>
  );
}

// Rotating ring
function Ring({ position, color }) {
  const mesh = useRef();
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = state.clock.elapsedTime * 0.3;
      mesh.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });
  return (
    <mesh ref={mesh} position={position}>
      <torusGeometry args={[1.5, 0.02, 16, 100]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
    </mesh>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      style={{ position: 'absolute', inset: 0, zIndex: 0 }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} color="#a855f7" intensity={2} />
      <pointLight position={[-5, -5, 3]} color="#f472b6" intensity={1.5} />

      <Particles count={150} />

      <FloatingOrb position={[-3, 1, -2]} color="#a855f7" size={1.2} />
      <FloatingOrb position={[3, -1, -3]} color="#f472b6" size={0.9} />
      <FloatingOrb position={[0, 2, -4]} color="#34d399" size={0.6} />
      <FloatingOrb position={[-1.5, -2, -1]} color="#fbbf24" size={0.5} />

      <Ring position={[2, 2, -3]} color="#a855f7" />
      <Ring position={[-2, -1, -4]} color="#f472b6" />
    </Canvas>
  );
}
