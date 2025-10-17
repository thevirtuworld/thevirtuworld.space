"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { Box, Button, Typography, Slider, Stack, Paper, Divider } from '@mui/material';
import { WorldState, Entity, Building, Resource, GameEvent } from './GameTypes';
import { AIEngine } from './AIEngine';
import { SimulationEngine } from './SimulationEngine';
import { Renderer2D } from './Renderer2D';
import AISettings from './AISettings';

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
  const [aiStats, setAiStats] = useState({ enhancedEntities: 0, provider: 'Local AI', enabled: true });
  const [showAISettings, setShowAISettings] = useState(false);

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
    
    // Update AI stats
    if (aiEngineRef.current) {
      setAiStats(aiEngineRef.current.getAIStats());
    }
    
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
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', bgcolor: 'grey.900', color: 'white' }}>
      {/* Control Panel */}
      <Paper 
        elevation={0}
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          p: 2,
          bgcolor: 'grey.800',
          borderBottom: 1,
          borderColor: 'grey.700',
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
            AI Life Simulation
          </Typography>
          <Button
            onClick={toggleSimulation}
            variant="contained"
            sx={{
              bgcolor: isRunning ? 'error.main' : 'success.main',
              '&:hover': {
                bgcolor: isRunning ? 'error.dark' : 'success.dark',
              }
            }}
          >
            {isRunning ? 'Pause' : 'Start'}
          </Button>
          <Button
            onClick={resetWorld}
            variant="contained"
            sx={{ bgcolor: 'grey.600', '&:hover': { bgcolor: 'grey.700' } }}
          >
            Reset
          </Button>
          <Button
            onClick={() => setShowAISettings(true)}
            variant="contained"
            color="info"
          >
            AI Settings
          </Button>
        </Stack>
        
        <Stack direction="row" spacing={3} alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2">Speed:</Typography>
            <Slider
              value={gameSpeed}
              onChange={(_, value) => setGameSpeed(value as number)}
              min={0.1}
              max={5}
              step={0.1}
              sx={{ width: 80 }}
            />
            <Typography variant="body2" sx={{ minWidth: 32 }}>{gameSpeed}x</Typography>
          </Stack>
          
          <Typography variant="body2">
            <Box component="span" sx={{ color: 'grey.400' }}>Gen:</Box> {generation}
          </Typography>
          <Typography variant="body2">
            <Box component="span" sx={{ color: 'grey.400' }}>Pop:</Box> {population}
          </Typography>
          <Typography variant="body2">
            <Box component="span" sx={{ color: 'grey.400' }}>FPS:</Box> {fps}
          </Typography>
          <Typography variant="body2">
            <Box component="span" sx={{ color: 'grey.400' }}>AI:</Box>{' '}
            <Box 
              component="span" 
              sx={{ color: aiStats.enabled ? 'success.main' : 'warning.main' }}
            >
              {aiStats.provider}
            </Box>
            {aiStats.enhancedEntities > 0 && (
              <Box component="span" sx={{ color: 'grey.400', ml: 0.5 }}>
                ({aiStats.enhancedEntities})
              </Box>
            )}
          </Typography>
        </Stack>
      </Paper>

      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Game Canvas */}
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.900' }}>
          <Box
            component="canvas"
            ref={canvasRef}
            width={width}
            height={height}
            onClick={handleCanvasClick}
            sx={{ 
              border: 1, 
              borderColor: 'grey.700',
              cursor: 'crosshair',
            }}
          />
        </Box>

        {/* Entity Inspector */}
        <Paper 
          elevation={0}
          sx={{ 
            width: 320, 
            bgcolor: 'grey.800', 
            borderLeft: 1,
            borderColor: 'grey.700',
            p: 2,
            overflowY: 'auto',
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Entity Inspector
          </Typography>
          
          {selectedEntityData ? (
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" color="text.secondary" component="span">ID: </Typography>
                <Typography variant="body2" component="span">{selectedEntityData.id}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" component="span">Position: </Typography>
                <Typography variant="body2" component="span">
                  ({Math.round(selectedEntityData.x)}, {Math.round(selectedEntityData.y)})
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" component="span">Level: </Typography>
                <Typography variant="body2" component="span">{selectedEntityData.level}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" component="span">Age: </Typography>
                <Typography variant="body2" component="span">{Math.round(selectedEntityData.age)}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" component="span">Health: </Typography>
                <Typography variant="body2" component="span">{Math.round(selectedEntityData.health)}/100</Typography>
              </Box>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Resources</Typography>
                <Stack spacing={0.5} sx={{ fontSize: '0.875rem' }}>
                  <Typography variant="body2">Food: {Math.round(selectedEntityData.food)}</Typography>
                  <Typography variant="body2">Wood: {Math.round(selectedEntityData.wood)}</Typography>
                  <Typography variant="body2">Stone: {Math.round(selectedEntityData.stone)}</Typography>
                </Stack>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>AI Personality</Typography>
                <Stack spacing={0.5} sx={{ fontSize: '0.875rem' }}>
                  <Typography variant="body2">
                    Aggression: {(selectedEntityData.aiPersonality.aggression * 100).toFixed(0)}%
                  </Typography>
                  <Typography variant="body2">
                    Cooperation: {(selectedEntityData.aiPersonality.cooperation * 100).toFixed(0)}%
                  </Typography>
                  <Typography variant="body2">
                    Exploration: {(selectedEntityData.aiPersonality.exploration * 100).toFixed(0)}%
                  </Typography>
                  <Typography variant="body2">
                    Efficiency: {(selectedEntityData.aiPersonality.efficiency * 100).toFixed(0)}%
                  </Typography>
                </Stack>
              </Box>

              {selectedEntityData.currentTask && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Current Task</Typography>
                  <Stack spacing={0.5} sx={{ fontSize: '0.875rem' }}>
                    <Typography variant="body2">Type: {selectedEntityData.currentTask.type}</Typography>
                    <Typography variant="body2">
                      Progress: {Math.round(selectedEntityData.currentTask.progress * 100)}%
                    </Typography>
                  </Stack>
                </Box>
              )}
            </Stack>
          ) : (
            <Typography variant="body2" sx={{ color: 'grey.400', textAlign: 'center', mt: 4 }}>
              Click on an entity to inspect its properties
            </Typography>
          )}
        </Paper>
      </Box>

      {/* Status Bar */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 1, 
          bgcolor: 'grey.800', 
          borderTop: 1,
          borderColor: 'grey.700',
        }}
      >
        <Typography variant="caption" sx={{ color: 'grey.400' }}>
          {worldStateRef.current && (
            <>
              Events: {worldStateRef.current.events.length} | 
              Buildings: {worldStateRef.current.buildings.size} | 
              Resources: {worldStateRef.current.resources.size} | 
              Weather: {worldStateRef.current.weather} | 
              Season: {worldStateRef.current.season} |
              AI: {aiStats.enabled ? `${aiStats.provider} (${aiStats.enhancedEntities} enhanced)` : 'Local only'}
            </>
          )}
        </Typography>
      </Paper>

      {/* AI Settings Modal */}
      <AISettings
        isOpen={showAISettings}
        onClose={() => setShowAISettings(false)}
      />
    </Box>
  );
};

export default Game2D;
