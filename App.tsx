
import React, { useState } from 'react';
import Game from './components/Game';
import HUD from './components/HUD';

function App() {
  const [scopeLevel, setScopeLevel] = useState(0);

  return (
    <div className="relative w-screen h-screen bg-black">
      <Game scopeLevel={scopeLevel} setScopeLevel={setScopeLevel} />
      <HUD scopeLevel={scopeLevel} />
    </div>
  );
}

export default App;
