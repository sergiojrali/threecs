
import React from 'react';
import { usePlane } from '@react-three/cannon';
import * as THREE from 'three';

const Ground: React.FC = () => {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
    type: 'Static',
    collisionFilterGroup: 1,
  }));

  return (
    <mesh ref={ref as React.Ref<THREE.Mesh>} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#d2b48c" />
    </mesh>
  );
};

export default Ground;
