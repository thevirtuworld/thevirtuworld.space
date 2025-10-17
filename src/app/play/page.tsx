"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Box, Typography, Button, Stack } from "@mui/material";

// Dynamically import the Game component with no SSR to avoid hydration issues
const Game = dynamic(() => import("@/components/Game"), { ssr: false });

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);
  
  return (
    <Box sx={{ width: '100%', height: '100vh', bgcolor: 'black', color: 'white', overflow: 'hidden' }}>
      {!gameStarted ? (
        <Box 
          sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            px: 2,
          }}
        >
          <Typography variant="h2" sx={{ mb: 3, fontWeight: 700 }}>
            VirtuWorld
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, maxWidth: 600, textAlign: 'center', color: 'grey.400' }}>
            Experience a fully simulated world built entirely with code.
            Explore cities, nature, and interact with other players.
          </Typography>
          <Button
            onClick={() => setGameStarted(true)}
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'white',
              color: 'black',
              fontWeight: 700,
              py: 1.5,
              px: 4,
              '&:hover': {
                bgcolor: 'grey.200',
              }
            }}
          >
            Enter World
          </Button>
          <Typography variant="caption" sx={{ mt: 3, color: 'grey.500' }}>
            Use W, A, S, D to move and mouse to look around
          </Typography>
        </Box>
      ) : (
        <Game />
      )}
    </Box>
  );
}
