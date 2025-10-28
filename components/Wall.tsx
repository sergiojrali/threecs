
import React from 'react';
import { useBox } from '@react-three/cannon';
import * as THREE from 'three';

interface WallProps {
  position: [number, number, number];
  args: [number, number, number];
}

const Wall: React.FC<WallProps> = ({ position, args }) => {
  const [ref] = useBox(() => ({
    args,
    position,
    type: 'Static',
    collisionFilterGroup: 1,
  }));

  return (
    <mesh ref={ref as React.Ref<THREE.Mesh>} castShadow receiveShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial color="#f0e68c" />
    </mesh>
  );
};

export default Wall;
