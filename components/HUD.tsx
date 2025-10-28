
import React from 'react';

interface HUDProps {
    scopeLevel: number;
}

const HUD: React.FC<HUDProps> = ({ scopeLevel }) => {
    if (scopeLevel > 0) {
        return (
            <div className="pointer-events-none fixed inset-0 flex justify-center items-center">
                {/* Scope vignette */}
                <div className="absolute inset-0" style={{
                    background: 'radial-gradient(circle, transparent 40%, black 41%)'
                }}></div>
                
                {/* Crosshair */}
                <div className="absolute w-px h-24 bg-red-500/80" />
                <div className="absolute w-24 h-px bg-red-500/80" />
            </div>
        );
    }

  return (
    <div className="pointer-events-none fixed inset-0 flex justify-center items-center">
      <div className="w-0.5 h-6 bg-white/70" />
      <div className="w-6 h-0.5 bg-white/70 absolute" />
    </div>
  );
};

export default HUD;
