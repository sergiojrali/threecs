import React from 'react';
import { useBox } from '@react-three/cannon';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface NPCProps {
    id: number;
    position: [number, number, number];
}

const NPC: React.FC<NPCProps> = ({ id, position }) => {
    // The physics body is now a box that approximates the NPC's shape.
    const [ref, api] = useBox(() => ({
        mass: 1,
        args: [1, 2, 1], // width, height, depth of the physics box
        position,
        userData: { id, type: 'npc' },
        collisionFilterGroup: 1, // Belongs to the environment group
        collisionFilterMask: 1 | 2, // Collides with environment (1) AND bullets (2)
    }));

    useFrame(({ clock }) => {
        // Simple back and forth movement
        const speed = 1;
        const distance = 5;
        const movementX = Math.sin(clock.getElapsedTime() * speed + id) * distance;

        api.velocity.set(
            movementX,
            0,
            0
        );
    });

    // The visual representation is a group parented to the physics body.
    return (
        <group ref={ref as React.Ref<THREE.Group>}>
            {/* Body */}
            <mesh castShadow position={[0, -0.25, 0]}>
                <boxGeometry args={[1, 1.5, 1]} />
                <meshStandardMaterial color="red" />
            </mesh>
            {/* Head */}
            <mesh castShadow position={[0, 0.75, 0]}>
                <sphereGeometry args={[0.4, 16, 16]} />
                <meshStandardMaterial color="red" />
            </mesh>
        </group>
    );
};

export default NPC;
