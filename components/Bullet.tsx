
import React, { useEffect } from 'react';
import { useSphere } from '@react-three/cannon';
import * as THREE from 'three';

interface BulletProps {
  id: number;
  position: [number, number, number];
  forward: [number, number, number];
  onRemove: (id: number) => void;
  onHitWall: (position: [number, number, number], normal: [number, number, number]) => void;
  onHitNpc: (npcId: number) => void;
}

const BULLET_SPEED = 200;

const Bullet: React.FC<BulletProps> = ({ id, position, forward, onRemove, onHitWall, onHitNpc }) => {
  const [ref] = useSphere(() => ({
    mass: 0.1,
    position,
    velocity: [
      forward[0] * BULLET_SPEED,
      forward[1] * BULLET_SPEED,
      forward[2] * BULLET_SPEED,
    ],
    args: [0.1],
    onCollide: (e) => {
        if (e.body?.userData?.type === 'npc') {
            onHitNpc(e.body.userData.id);
        } else {
             const pos: [number, number, number] = [e.contact.contactPoint[0], e.contact.contactPoint[1], e.contact.contactPoint[2]];
             const norm: [number, number, number] = [e.contact.contactNormal[0], e.contact.contactNormal[1], e.contact.contactNormal[2]];
             onHitWall(pos, norm);
        }
        onRemove(id);
    },
    collisionFilterGroup: 2,
    collisionFilterMask: 1, // Will collide with group 1 (environment and NPCs)
  }));

  useEffect(() => {
    const timeoutId = setTimeout(() => {
        onRemove(id);
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, [id, onRemove]);

  return (
    <mesh ref={ref as React.Ref<THREE.Mesh>}>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshStandardMaterial color="yellow" emissive="yellow" emissiveIntensity={5} />
    </mesh>
  );
};

export default Bullet;
