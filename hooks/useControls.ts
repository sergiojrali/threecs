
import { useEffect, useRef } from 'react';

export const useControls = () => {
  const controls = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          controls.current.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          controls.current.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          controls.current.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          controls.current.right = true;
          break;
        case 'Space':
          controls.current.jump = true;
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          controls.current.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          controls.current.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          controls.current.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          controls.current.right = false;
          break;
        case 'Space':
          controls.current.jump = false;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return controls;
};
