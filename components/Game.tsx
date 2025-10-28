
import React, { useState, Suspense, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import { Sky, PointerLockControls } from '@react-three/drei';
import Player from './Player';
import Ground from './Ground';
import Wall from './Wall';
import Bullet from './Bullet';
import Weapon from './Weapon';
import NPC from './NPC';
import BulletHole from './BulletHole';
import * as THREE from 'three';

interface BulletState {
  id: number;
  position: [number, number, number];
  forward: [number, number, number];
}

interface BulletHoleState {
    id: number;
    position: [number, number, number];
    normal: [number, number, number];
}

interface NpcState {
    id: number;
    key: number; // For re-mounting on respawn
    position: [number, number, number];
}

interface GameProps {
  scopeLevel: number;
  setScopeLevel: React.Dispatch<React.SetStateAction<number>>;
}

const initialNpcs: NpcState[] = [
    { id: 1, key: Math.random(), position: [-15, 1, -15] },
    { id: 2, key: Math.random(), position: [0, 1, -15] },
    { id: 3, key: Math.random(), position: [15, 1, 15] },
];

// This component ensures the camera FOV updates when the scope level changes
const CameraUpdater = ({ fov }: { fov: number }) => {
    const { camera } = useThree();
    useEffect(() => {
        if (camera instanceof THREE.PerspectiveCamera) {
            camera.fov = fov;
            camera.updateProjectionMatrix();
        }
    }, [fov, camera]);
    return null;
};

const Game: React.FC<GameProps> = ({ scopeLevel, setScopeLevel }) => {
  const [bullets, setBullets] = useState<BulletState[]>([]);
  const [bulletHoles, setBulletHoles] = useState<BulletHoleState[]>([]);
  const [npcs, setNpcs] = useState<NpcState[]>(initialNpcs);

  const handleShoot = (position: [number, number, number], forward: [number, number, number]) => {
    setBullets((prevBullets) => [
      ...prevBullets,
      { id: Date.now(), position, forward },
    ]);
    if (scopeLevel > 0) {
        setScopeLevel(0);
    }
  };
  
  const removeBullet = (id: number) => {
    setBullets((prevBullets) => prevBullets.filter((bullet) => bullet.id !== id));
  };

  const addBulletHole = (position: [number, number, number], normal: [number, number, number]) => {
    setBulletHoles((holes) => [...holes, { id: Date.now(), position, normal }].slice(-50)); // Keep max 50 holes
  };

  const handleNpcHit = (npcId: number) => {
    const respawnInfo = initialNpcs.find(npc => npc.id === npcId);
    if (!respawnInfo) return;

    // Remove the NPC from the current state
    setNpcs(prev => prev.filter(npc => npc.id !== npcId));

    // After a delay, add it back with a new key to force re-mount
    setTimeout(() => {
        setNpcs(prev => [...prev, { ...respawnInfo, key: Math.random() }]);
    }, 1000); // Respawn after 1 second
  };


  const fov = scopeLevel === 0 ? 60 : scopeLevel === 1 ? 25 : 10;

  return (
    <Suspense fallback={<div className="w-full h-full bg-black flex justify-center items-center text-white">Loading...</div>}>
        <Canvas shadows camera={{ position: [0, 1.6, 0] }}>
            <CameraUpdater fov={fov} />
            <Sky sunPosition={[100, 20, 100]} />
            <ambientLight intensity={0.5} />
            <directionalLight
                castShadow
                position={[50, 50, 25]}
                intensity={1.5}
                shadow-mapSize-width={4096}
                shadow-mapSize-height={4096}
                shadow-camera-near={0.5}
                shadow-camera-far={200}
                shadow-camera-left={-40}
                shadow-camera-right={40}
                shadow-camera-top={40}
                shadow-camera-bottom={-40}
            />
            
            <Physics gravity={[0, -30, 0]}>
                <Ground />
                
                {/* Arena Walls */}
                <Wall position={[0, 2.5, -20]} args={[40, 5, 1]} />
                <Wall position={[0, 2.5, 20]} args={[40, 5, 1]} />
                <Wall position={[-20, 2.5, 0]} args={[1, 5, 40]} />
                <Wall position={[20, 2.5, 0]} args={[1, 5, 40]} />

                {/* Obstacles */}
                <Wall position={[-10, 2.5, 0]} args={[1, 5, 15]} />
                <Wall position={[10, 2.5, -5]} args={[1, 5, 10]} />
                <Wall position={[0, 2.5, 5]} args={[15, 5, 1]} />

                <Player onShoot={handleShoot} scopeLevel={scopeLevel} setScopeLevel={setScopeLevel} />
                
                {bullets.map((bullet) => (
                    <Bullet
                        key={bullet.id}
                        id={bullet.id}
                        position={bullet.position}
                        forward={bullet.forward}
                        onRemove={removeBullet}
                        onHitWall={addBulletHole}
                        onHitNpc={handleNpcHit}
                    />
                ))}

                {npcs.map(npc => (
                    <NPC key={npc.key} id={npc.id} position={npc.position} />
                ))}
            </Physics>

            {bulletHoles.map(hole => (
                <BulletHole key={hole.id} position={hole.position} normal={hole.normal} />
            ))}
            
            <Weapon scopeLevel={scopeLevel} />
            <PointerLockControls />
        </Canvas>
    </Suspense>
  );
};

export default Game;
