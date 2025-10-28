
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface WeaponProps {
    scopeLevel: number;
}

const Weapon: React.FC<WeaponProps> = ({ scopeLevel }) => {
  const mesh = useRef<THREE.Group>(null!);
  
  useFrame(({ camera }) => {
    if (!mesh.current) return;
    
    mesh.current.visible = scopeLevel === 0;
    if (!mesh.current.visible) return;

    // Position the weapon in front of the camera
    const weaponOffset = new THREE.Vector3(0.3, -0.3, -0.6);
    weaponOffset.applyQuaternion(camera.quaternion);
    mesh.current.position.copy(camera.position).add(weaponOffset);
    
    // Rotate the weapon to match camera
    mesh.current.rotation.copy(camera.rotation);
  });

  return (
    <group ref={mesh}>
      <mesh>
        <boxGeometry args={[0.1, 0.15, 0.7]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[0, 0.1, -0.2]}>
         <boxGeometry args={[0.03, 0.03, 0.03]} />
         <meshStandardMaterial color="#111" />
      </mesh>
    </group>
  );
};

export default Weapon;
