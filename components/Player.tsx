
import React, { useEffect, useRef } from 'react';
import { useSphere } from '@react-three/cannon';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useControls } from '../hooks/useControls';

const PLAYER_SPEED = 5;
const PLAYER_JUMP_FORCE = 6;

interface PlayerProps {
  onShoot: (position: [number, number, number], forward: [number, number, number]) => void;
  scopeLevel: number;
  setScopeLevel: React.Dispatch<React.SetStateAction<number>>;
}

const Player: React.FC<PlayerProps> = ({ onShoot, scopeLevel, setScopeLevel }) => {
  const { camera } = useThree();
  const controls = useControls();
  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: 'Dynamic',
    position: [0, 5, 0],
    args: [0.5],
  }));

  const velocity = useRef([0, 0, 0]);
  const pos = useRef<[number, number, number]>([0, 5, 0]);

  useEffect(() => {
    api.velocity.subscribe((v) => (velocity.current = v));
    api.position.subscribe((p) => (pos.current = p));
  }, [api]);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
        if (document.pointerLockElement) {
            if (e.button === 0) { // Left mouse button
                const shootOrigin = new THREE.Vector3();
                camera.getWorldPosition(shootOrigin);

                const cameraDirection = new THREE.Vector3();
                camera.getWorldDirection(cameraDirection);
                
                const forward: [number, number, number] = [cameraDirection.x, cameraDirection.y, cameraDirection.z];

                onShoot([shootOrigin.x, shootOrigin.y, shootOrigin.z], forward);
            } else if (e.button === 2) { // Right mouse button
                setScopeLevel(prev => (prev + 1) % 3);
            }
        }
    };

    const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('contextmenu', handleContextMenu);
    return () => {
        document.removeEventListener('mousedown', handleMouseDown);
        document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [camera, onShoot, setScopeLevel]);


  useFrame(() => {
    const playerHeight = 1.6;
    camera.position.set(pos.current[0], pos.current[1] + playerHeight, pos.current[2]);
    
    const direction = new THREE.Vector3();
    const frontVector = new THREE.Vector3(0, 0, Number(controls.current.backward) - Number(controls.current.forward));
    const sideVector = new THREE.Vector3(Number(controls.current.left) - Number(controls.current.right), 0, 0);

    const speed = scopeLevel > 0 ? PLAYER_SPEED * 0.5 : PLAYER_SPEED;

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(speed)
      .applyEuler(camera.rotation);

    api.velocity.set(direction.x, velocity.current[1], direction.z);

    if (controls.current.jump && Math.abs(velocity.current[1]) < 0.05) {
      api.velocity.set(velocity.current[0], PLAYER_JUMP_FORCE, velocity.current[2]);
    }
  });

  // This invisible mesh is the physics body
  return <mesh ref={ref as React.Ref<THREE.Mesh>} />;
};

export default Player;
