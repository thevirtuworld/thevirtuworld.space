"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import the Game2D component with no SSR
const Game2D = dynamic(() => import("@/components/Game2D/Game2D"), { ssr: false });

export default function Play2D() {
  const [gameStarted, setGameStarted] = useState(false);
  
  return (
    <div className="w-full h-screen bg-gray-900 text-white overflow-hidden">
      {!gameStarted ? (
        <div className="h-full flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold mb-6 text-primary">AI Life Simulation</h1>
          <p className="text-xl mb-8 max-w-2xl text-center">
            Watch AI-powered entities evolve, build civilizations, and interact in a dynamic 2D world. 
            Each entity has unique personalities and makes autonomous decisions based on their needs and environment.
          </p>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-4">Features:</h2>
            <ul className="text-lg space-y-2 text-gray-300">
              <li>🤖 Advanced AI decision-making system</li>
              <li>🏗️ Dynamic building and resource gathering</li>
              <li>🌱 Evolving ecosystems and relationships</li>
              <li>📊 Real-time entity inspection and analytics</li>
              <li>⚡ Customizable simulation speed</li>
            </ul>
          </div>
          <button
            onClick={() => setGameStarted(true)}
            className="bg-primary text-background font-bold py-4 px-12 rounded-full text-xl hover:bg-primary/80 transition-all transform hover:scale-105"
          >
            Start Simulation
          </button>
          <p className="mt-6 text-sm text-gray-400">
            Click on entities to inspect their AI behavior and status
          </p>
        </div>
      ) : (
        <Game2D />
      )}
    </div>
  );
}
