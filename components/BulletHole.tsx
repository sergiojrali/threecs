
import React, { useMemo } from 'react';
import * as THREE from 'three';

interface BulletHoleProps {
    position: [number, number, number];
    normal: [number, number, number];
}

const BulletHole: React.FC<BulletHoleProps> = ({ position, normal }) => {

    const orientation = useMemo(() => {
        const quat = new THREE.Quaternion();
        const up = new THREE.Vector3(0, 1, 0);
        const normalVec = new THREE.Vector3(...normal);
        
        // Create a rotation that aligns the Z-axis with the normal
        quat.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normalVec);
        return quat;
    }, [normal]);

    const slightlyOffsetPosition = useMemo(() => 
        position.map((p, i) => p + normal[i] * 0.01) as [number, number, number],
        [position, normal]
    );

    return (
        <mesh position={slightlyOffsetPosition} quaternion={orientation}>
            <circleGeometry args={[0.1, 16]} />
            <meshStandardMaterial color="black" roughness={1} />
        </mesh>
    );
};

export default BulletHole;
