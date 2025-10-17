import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Stack, List, ListItem } from '@mui/material';

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
      <Paper 
        sx={{ 
          position: 'absolute', 
          top: 20, 
          left: 20, 
          bgcolor: 'rgba(0, 0, 0, 0.5)', 
          p: 2, 
          borderRadius: 1,
          color: 'white',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>VirtuWorld</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>FPS: {fps}</Typography>
        <Typography variant="body2">Weather: {weather}</Typography>
        <Typography variant="caption">
          Pos: ({coordinates.x.toFixed(1)}, {coordinates.y.toFixed(1)}, {coordinates.z.toFixed(1)})
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'grey.300' }}>
          Press H for Help, M for Map, P for Weather
        </Typography>
      </Paper>
      
      {/* Center crosshair for aiming */}
      {isLocked && (
        <Box 
          sx={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        >
          <Box 
            sx={{ 
              width: 16, 
              height: 16, 
              border: 2, 
              borderColor: 'white', 
              borderRadius: '50%', 
              opacity: 0.5,
            }} 
          />
        </Box>
      )}
      
      {/* Help panel */}
      {showHelp && isLocked && (
        <Paper 
          sx={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'rgba(0, 0, 0, 0.7)',
            p: 3,
            borderRadius: 2,
            maxWidth: 400,
            color: 'white',
          }}
        >
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>Controls</Typography>
          <List sx={{ py: 0 }}>
            <ListItem sx={{ px: 0, py: 0.5 }}><Typography variant="body2">W, A, S, D: Move</Typography></ListItem>
            <ListItem sx={{ px: 0, py: 0.5 }}><Typography variant="body2">Mouse: Look around</Typography></ListItem>
            <ListItem sx={{ px: 0, py: 0.5 }}><Typography variant="body2">Shift: Sprint</Typography></ListItem>
            <ListItem sx={{ px: 0, py: 0.5 }}><Typography variant="body2">H: Toggle help</Typography></ListItem>
            <ListItem sx={{ px: 0, py: 0.5 }}><Typography variant="body2">M: Toggle map</Typography></ListItem>
            <ListItem sx={{ px: 0, py: 0.5 }}><Typography variant="body2">P: Cycle weather</Typography></ListItem>
            <ListItem sx={{ px: 0, py: 0.5 }}><Typography variant="body2">ESC: Release mouse pointer</Typography></ListItem>
          </List>
          <Button 
            variant="contained"
            sx={{ 
              mt: 2, 
              bgcolor: 'white', 
              color: 'black',
              '&:hover': { bgcolor: 'grey.200' },
            }}
            onClick={() => setShowHelp(false)}
          >
            Close
          </Button>
        </Paper>
      )}
      
      {/* Mini map */}
      {showMap && isLocked && (
        <Paper 
          sx={{ 
            position: 'absolute', 
            bottom: 20, 
            right: 20, 
            width: 256, 
            height: 256,
            bgcolor: 'rgba(0, 0, 0, 0.6)',
            borderRadius: 2,
            p: 1,
          }}
        >
          <Box 
            sx={{ 
              width: '100%', 
              height: '100%', 
              position: 'relative', 
              borderRadius: 1,
              overflow: 'hidden',
              border: 1,
              borderColor: 'rgba(255, 255, 255, 0.3)',
            }}
          >
            {/* Simple map grid */}
            <Box 
              sx={{ 
                position: 'absolute', 
                inset: 0, 
                display: 'grid', 
                gridTemplateColumns: 'repeat(8, 1fr)',
                gridTemplateRows: 'repeat(8, 1fr)',
              }}
            >
              {Array(64).fill(0).map((_, i) => (
                <Box 
                  key={i} 
                  sx={{
                    border: 1,
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    bgcolor: Math.random() > 0.8 ? 'rgba(100,100,100,0.3)' : 'transparent',
                  }}
                />
              ))}
            </Box>
            
            {/* Player position marker */}
            <Box 
              sx={{ 
                position: 'absolute',
                width: 8,
                height: 8,
                bgcolor: 'blue',
                borderRadius: '50%',
                left: '50%', 
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
            
            {/* North indicator */}
            <Typography 
              variant="caption" 
              sx={{ 
                position: 'absolute', 
                top: 8, 
                left: 8, 
                color: 'white', 
                fontWeight: 700,
              }}
            >
              N
            </Typography>
          </Box>
        </Paper>
      )}
      
      {/* Instructions when not locked */}
      {!isLocked && (
        <Box 
          sx={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}
        >
          <Paper 
            sx={{ 
              bgcolor: 'rgba(0, 0, 0, 0.7)', 
              p: 3, 
              borderRadius: 2,
              maxWidth: 400,
              color: 'white',
            }}
          >
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
              Click to explore the world
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Use W, A, S, D keys to move
            </Typography>
            <Typography variant="body2">
              Move your mouse to look around
            </Typography>
          </Paper>
        </Box>
      )}
    </>
  );
};

export default GameUI;
