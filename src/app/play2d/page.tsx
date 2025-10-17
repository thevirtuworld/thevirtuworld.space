"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Box, Typography, Button, List, ListItem, ListItemText } from "@mui/material";

// Dynamically import the Game2D component with no SSR
const Game2D = dynamic(() => import("@/components/Game2D/Game2D"), { ssr: false });

export default function Play2D() {
  const [gameStarted, setGameStarted] = useState(false);
  
  return (
    <Box sx={{ width: '100%', height: '100vh', bgcolor: 'grey.900', color: 'white', overflow: 'hidden' }}>
      {!gameStarted ? (
        <Box 
          sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            px: 3,
          }}
        >
          <Typography variant="h2" sx={{ mb: 3, fontWeight: 700, color: 'primary.main' }}>
            AI Life Simulation
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, maxWidth: 800, textAlign: 'center', color: 'grey.400' }}>
            Watch AI-powered entities evolve, build civilizations, and interact in a dynamic 2D world. 
            Each entity has unique personalities and makes autonomous decisions based on their needs and environment.
          </Typography>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
              Features:
            </Typography>
            <List sx={{ maxWidth: 500, mx: 'auto' }}>
              {[
                { icon: '🤖', text: 'Advanced AI decision-making system' },
                { icon: '🏗️', text: 'Dynamic building and resource gathering' },
                { icon: '🌱', text: 'Evolving ecosystems and relationships' },
                { icon: '📊', text: 'Real-time entity inspection and analytics' },
                { icon: '⚡', text: 'Customizable simulation speed' },
              ].map((feature, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemText 
                    primary={`${feature.icon} ${feature.text}`}
                    sx={{ color: 'grey.300', textAlign: 'center' }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
          <Button
            onClick={() => setGameStarted(true)}
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'primary.main',
              color: 'background.default',
              fontWeight: 700,
              py: 2,
              px: 6,
              fontSize: '1.25rem',
              '&:hover': {
                bgcolor: 'primary.dark',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.3s',
            }}
          >
            Start Simulation
          </Button>
          <Typography variant="caption" sx={{ mt: 3, color: 'grey.500' }}>
            Click on entities to inspect their AI behavior and status
          </Typography>
        </Box>
      ) : (
        <Game2D />
      )}
    </Box>
  );
}
