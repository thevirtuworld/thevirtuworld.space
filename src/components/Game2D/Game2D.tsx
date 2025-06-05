"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { WorldState, Entity, Building, Resource, GameEvent } from './GameTypes';
import { AIEngine } from './AIEngine';
import { SimulationEngine } from './SimulationEngine';
import { Renderer2D } from './Renderer2D';

interface Game2DProps {
  width?: number;
  height?: number;
}

const Game2D: React.FC<Game2DProps> = ({ width = 1200, height = 800 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const worldStateRef = useRef<WorldState>();
  const aiEngineRef = useRef<AIEngine>();
  const simulationEngineRef = useRef<SimulationEngine>();
  const rendererRef = useRef<Renderer2D>();
  
  const [isRunning, setIsRunning] = useState(false);
  const [generation, setGeneration] = useState(1);
  const [population, setPopulation] = useState(0);
  const [fps, setFps] = useState(0);
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const [gameSpeed, setGameSpeed] = useState(1);

  // Initialize the game world
  const initializeWorld = useCallback(() => {
    if (!canvasRef.current) return;

    // Create initial world state
    worldStateRef.current = {
      entities: new Map(),
      buildings: new Map(),
      resources: new Map(),
      particles: [],
      events: [],
      generation: 1,
      time: 0,
      weather: 'sunny',
      season: 'spring'
    };

    // Initialize AI engine
    aiEngineRef.current = new AIEngine();
    
    // Initialize simulation engine
    simulationEngineRef.current = new SimulationEngine(aiEngineRef.current);
    
    // Initialize renderer
    rendererRef.current = new Renderer2D(canvasRef.current, width, height);

    // Generate initial world
    simulationEngineRef.current.generateInitialWorld(worldStateRef.current, width, height);
    
    setPopulation(worldStateRef.current.entities.size);
  }, [width, height]);

  // Game loop
  const gameLoop = useCallback(() => {
    if (!worldStateRef.current || !simulationEngineRef.current || !rendererRef.current || !isRunning) {
      return;
    }

    const startTime = performance.now();

    // Update simulation
    simulationEngineRef.current.update(worldStateRef.current, gameSpeed);
    
    // Render world
    rendererRef.current.render(worldStateRef.current, selectedEntity);
    
    // Update UI state
    setGeneration(worldStateRef.current.generation);
    setPopulation(worldStateRef.current.entities.size);
    
    // Calculate FPS
    const endTime = performance.now();
    const frameTime = endTime - startTime;
    setFps(Math.round(1000 / frameTime));

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [isRunning, selectedEntity, gameSpeed]);

  // Handle canvas click for entity selection
  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !worldStateRef.current || !rendererRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Find entity at click position
    const clickedEntity = rendererRef.current.getEntityAtPosition(x, y, worldStateRef.current);
    setSelectedEntity(clickedEntity?.id || null);
  }, []);

  // Start/stop simulation
  const toggleSimulation = useCallback(() => {
    setIsRunning(prev => !prev);
  }, []);

  // Reset world
  const resetWorld = useCallback(() => {
    setIsRunning(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    initializeWorld();
  }, [initializeWorld]);

  // Initialize on mount
  useEffect(() => {
    initializeWorld();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initializeWorld]);

  // Start/stop game loop based on isRunning
  useEffect(() => {
    if (isRunning) {
      gameLoop();
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, gameLoop]);

  const selectedEntityData = selectedEntity && worldStateRef.current?.entities.get(selectedEntity);

  return (
    <div className="flex flex-col w-full h-full bg-gray-900 text-white">
      {/* Control Panel */}
      <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-primary">AI Life Simulation</h1>
          <button
            onClick={toggleSimulation}
            className={`px-4 py-2 rounded-lg font-semibold ${
              isRunning 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={resetWorld}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold"
          >
            Reset
          </button>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <label className="text-sm">Speed:</label>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={gameSpeed}
              onChange={(e) => setGameSpeed(parseFloat(e.target.value))}
              className="w-20"
            />
            <span className="text-sm w-8">{gameSpeed}x</span>
          </div>
          
          <div className="text-sm">
            <span className="text-gray-400">Gen:</span> {generation}
          </div>
          <div className="text-sm">
            <span className="text-gray-400">Pop:</span> {population}
          </div>
          <div className="text-sm">
            <span className="text-gray-400">FPS:</span> {fps}
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Game Canvas */}
        <div className="flex-1 flex items-center justify-center bg-gray-900">
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            onClick={handleCanvasClick}
            className="border border-gray-700 cursor-crosshair"
          />
        </div>

        {/* Entity Inspector */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 p-4 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Entity Inspector</h3>
          
          {selectedEntityData ? (
            <div className="space-y-3">
              <div>
                <span className="text-gray-400">ID:</span> {selectedEntityData.id}
              </div>
              <div>
                <span className="text-gray-400">Position:</span> ({Math.round(selectedEntityData.x)}, {Math.round(selectedEntityData.y)})
              </div>
              <div>
                <span className="text-gray-400">Level:</span> {selectedEntityData.level}
              </div>
              <div>
                <span className="text-gray-400">Age:</span> {selectedEntityData.age}
              </div>
              <div>
                <span className="text-gray-400">Health:</span> {Math.round(selectedEntityData.health)}/100
              </div>
              
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Resources</h4>
                <div className="space-y-1 text-sm">
                  <div>Food: {Math.round(selectedEntityData.food)}</div>
                  <div>Wood: {Math.round(selectedEntityData.wood)}</div>
                  <div>Stone: {Math.round(selectedEntityData.stone)}</div>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-semibold mb-2">AI Personality</h4>
                <div className="space-y-1 text-sm">
                  <div>Aggression: {(selectedEntityData.aiPersonality.aggression * 100).toFixed(0)}%</div>
                  <div>Cooperation: {(selectedEntityData.aiPersonality.cooperation * 100).toFixed(0)}%</div>
                  <div>Exploration: {(selectedEntityData.aiPersonality.exploration * 100).toFixed(0)}%</div>
                  <div>Efficiency: {(selectedEntityData.aiPersonality.efficiency * 100).toFixed(0)}%</div>
                </div>
              </div>

              {selectedEntityData.currentTask && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Current Task</h4>
                  <div className="text-sm">
                    <div>Type: {selectedEntityData.currentTask.type}</div>
                    <div>Progress: {Math.round(selectedEntityData.currentTask.progress * 100)}%</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-400 text-center mt-8">
              Click on an entity to inspect its properties
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="p-2 bg-gray-800 border-t border-gray-700 text-sm text-gray-400">
        {worldStateRef.current && (
          <>
            Events: {worldStateRef.current.events.length} | 
            Buildings: {worldStateRef.current.buildings.size} | 
            Resources: {worldStateRef.current.resources.size} | 
            Weather: {worldStateRef.current.weather} | 
            Season: {worldStateRef.current.season}
          </>
        )}
      </div>
    </div>
  );
};

export default Game2D;
