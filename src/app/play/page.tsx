"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import the Game component with no SSR to avoid hydration issues
const Game = dynamic(() => import("@/components/Game"), { ssr: false });

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);
  
  return (
    <div className="w-full h-screen bg-black text-white overflow-hidden">
      {!gameStarted ? (
        <div className="h-full flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold mb-6">VirtuWorld</h1>
          <p className="text-xl mb-8 max-w-md text-center">
            Experience a fully simulated world built entirely with code.
            Explore cities, nature, and interact with other players.
          </p>
          <button
            onClick={() => setGameStarted(true)}
            className="bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition"
          >
            Enter World
          </button>
          <p className="mt-6 text-sm text-gray-400">
            Use W, A, S, D to move and mouse to look around
          </p>
        </div>
      ) : (
        <Game />
      )}
    </div>
  );
}
