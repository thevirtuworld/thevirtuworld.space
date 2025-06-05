"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Simulate loading for the interactive elements
const LoadingScreen = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4 text-primary">TheVirtuWorld</h1>
      <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div className="loading-bar h-full bg-gradient-to-r from-primary to-secondary"></div>
      </div>
      <p className="mt-4 text-sm text-gray-400">Loading Virtual Experience...</p>
    </div>
  </div>
);

const Navbar = () => (
  <nav className="fixed w-full top-0 z-40 backdrop-blur-md bg-background/70 border-b border-white/10">
    <div className="max-w-7xl mx-auto px-6 py-4">
      <div className="flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-primary glow"></div>
          <span className="font-bold text-xl">TheVirtuWorld</span>
        </Link>
        
        <div className="hidden md:flex space-x-8">
          <Link href="#games" className="hover:text-primary transition-colors">Games</Link>
          <Link href="#creators" className="hover:text-primary transition-colors">Creators</Link>
          <Link href="#metaverse" className="hover:text-primary transition-colors">Metaverse</Link>
          <Link href="#web3" className="hover:text-primary transition-colors">Web3</Link>
        </div>
        
        <div className="flex space-x-4 items-center">
          <button className="hidden md:block px-4 py-2 border border-primary text-primary rounded-full hover:bg-primary hover:text-background transition-colors">
            Connect Wallet
          </button>
          <a href="https://thevirtuworld.vercel.app/" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-primary text-background rounded-full hover:bg-primary/80 transition-colors">
            Launch App
          </a>
        </div>
      </div>
    </div>
  </nav>
);

const HeroSection = () => (
  <section className="relative min-h-screen pt-20 overflow-hidden grid-bg">
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-10"></div>