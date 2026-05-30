import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

function EnvelopeBody({ sent }) {
  const group = useRef();
  const flap = useRef();

  useFrame((state) => {
    if (!group.current) return;
    if (sent) {
      group.current.position.y += 0.05;
      group.current.rotation.z = Math.sin(state.clock.elapsedTime * 3) * 0.1;
      group.current.scale.setScalar(Math.max(0.01, 1 - state.clock.elapsedTime * 0.3));
    } else {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.15;
      group.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
    if (flap.current) {
      flap.current.rotation.x = sent
        ? THREE.MathUtils.lerp(flap.current.rotation.x, -Math.PI * 0.5, 0.05)
        : Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
    }
  });

  const envMat = new THREE.MeshStandardMaterial({ color: '#7c3aed', transparent: true, opacity: 0.9 });
  const flapMat = new THREE.MeshStandardMaterial({ color: '#a855f7', transparent: true, opacity: 0.85 });

  return (
    <group ref={group}>
      {/* Envelope body */}
      <mesh material={envMat}>
        <boxGeometry args={[2.4, 1.6, 0.05]} />
      </mesh>
      {/* Flap */}
      <mesh ref={flap} position={[0, 0.8, 0.03]} material={flapMat}>
        <boxGeometry args={[2.4, 0.8, 0.03]} />
      </mesh>
      {/* Heart on envelope */}
      <mesh position={[0, -0.1, 0.06]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#f472b6" emissive="#f472b6" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

export default function EnvelopeScene({ sent = false }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      style={{ width: '100%', height: '220px' }}
      gl={{ alpha: true }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[3, 3, 3]} color="#a855f7" intensity={2} />
      <pointLight position={[-3, -2, 2]} color="#f472b6" intensity={1.5} />
      <EnvelopeBody sent={sent} />
    </Canvas>
  );
}
