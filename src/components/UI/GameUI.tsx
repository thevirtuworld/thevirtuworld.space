import React, { useState, useEffect } from 'react';

interface GameUIProps {
  fps: number;
  isLocked: boolean;
  weather: string;
}

const GameUI: React.FC<GameUIProps> = ({ fps, isLocked, weather }) => {
  const [showHelp, setShowHelp] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0, z: 0 });
  
  // Mock coordinates update
  useEffect(() => {
    const interval = setInterval(() => {
      setCoordinates(prev => ({
        x: Math.round((prev.x + (Math.random() - 0.5) / 10) * 100) / 100,
        y: Math.round(prev.y * 100) / 100,
        z: Math.round((prev.z + (Math.random() - 0.5) / 10) * 100) / 100,
      }));
    }, 500);
    
    return () => clearInterval(interval);
  }, []);
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLocked) return;
      
      if (e.code === 'KeyH') {
        setShowHelp(prev => !prev);
      }
      
      if (e.code === 'KeyM') {
        setShowMap(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLocked]);
  
  return (
    <>
      {/* Top-left info panel */}
      <div className="absolute top-5 left-5 bg-black/50 p-3 rounded text-white">
        <h2 className="text-lg font-bold">VirtuWorld</h2>
        <p className="text-sm mt-2">FPS: {fps}</p>
        <p className="text-sm">Weather: {weather}</p>
        <p className="text-xs">
          Pos: ({coordinates.x.toFixed(1)}, {coordinates.y.toFixed(1)}, {coordinates.z.toFixed(1)})
        </p>
        <div className="text-xs mt-2 text-gray-300">
          Press H for Help, M for Map, P for Weather
        </div>
      </div>
      
      {/* Center crosshair for aiming */}
      {isLocked && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-4 h-4 border-2 border-white rounded-full opacity-50"></div>
        </div>
      )}
      
      {/* Help panel */}
      {showHelp && isLocked && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/70 p-6 rounded-lg max-w-sm text-white">
          <h2 className="text-xl font-bold mb-4">Controls</h2>
          <ul className="space-y-2">
            <li>W, A, S, D: Move</li>
            <li>Mouse: Look around</li>
            <li>Shift: Sprint</li>
            <li>H: Toggle help</li>
            <li>M: Toggle map</li>
            <li>P: Cycle weather</li>
            <li>ESC: Release mouse pointer</li>
          </ul>
          <button 
            className="mt-4 bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200 transition"
            onClick={() => setShowHelp(false)}
          >
            Close
          </button>
        </div>
      )}
      
      {/* Mini map */}
      {showMap && isLocked && (
        <div className="absolute bottom-5 right-5 w-64 h-64 bg-black/60 rounded-lg p-2">
          <div className="w-full h-full relative rounded overflow-hidden border border-white/30">
            {/* Simple map grid */}
            <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
              {Array(64).fill(0).map((_, i) => (
                <div 
                  key={i} 
                  className="border border-white/10"
                  style={{
                    backgroundColor: Math.random() > 0.8 ? 'rgba(100,100,100,0.3)' : 'transparent'
                  }}
                ></div>
              ))}
            </div>
            
            {/* Player position marker */}
            <div 
              className="absolute w-2 h-2 bg-blue-500 rounded-full"
              style={{ 
                left: '50%', 
                top: '50%',
                transform: 'translate(-50%, -50%)' 
              }}
            ></div>
            
            {/* North indicator */}
            <div className="absolute top-2 left-2 text-white text-xs font-bold">N</div>
          </div>
        </div>
      )}
      
      {/* Instructions when not locked */}
      {!isLocked && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="bg-black/70 p-6 rounded-lg max-w-sm text-white">
            <h2 className="text-xl font-bold mb-4">Click to explore the world</h2>
            <p className="mb-2">Use W, A, S, D keys to move</p>
            <p>Move your mouse to look around</p>
          </div>
        </div>
      )}
    </>
  );
};

export default GameUI;
