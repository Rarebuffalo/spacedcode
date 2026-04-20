import React from "react";
import { Terminal, Github, Linkedin, Mail } from "lucide-react";
import { Button } from "./ui/button";
import { siteConfig } from "../lib/siteConfig";
import { useTerminalStore } from "../store/terminalStore";

export const Header: React.FC = () => {
  const { open } = useTerminalStore();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-800 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/20 rounded-lg">
            <Terminal className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              SpacedCode
              <span className="text-green-400">.dev</span>
            </h1>
            <p className="text-xs text-gray-400">LeetCode × Spaced Repetition</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-gray-300 hover:text-green-400 transition-colors text-sm">
            Features
          </a>
          <a href="#how-it-works" className="text-gray-300 hover:text-green-400 transition-colors text-sm">
            How It Works
          </a>
          <a href="#about" className="text-gray-300 hover:text-green-400 transition-colors text-sm">
            About
          </a>
          <a 
            href={siteConfig.githubUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-green-400 transition-colors text-sm"
          >
            GitHub
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-gray-400 hover:text-green-400"
            asChild
          >
            <a href={siteConfig.githubUrl} target="_blank" rel="noopener noreferrer">
              <Github className="w-5 h-5" />
            </a>
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-gray-400 hover:text-blue-400"
            asChild
          >
            <a href={siteConfig.linkedinUrl} target="_blank" rel="noopener noreferrer">
              <Linkedin className="w-5 h-5" />
            </a>
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-gray-400 hover:text-red-400"
            asChild
          >
            <a href={`mailto:${siteConfig.email}`}>
              <Mail className="w-5 h-5" />
            </a>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="border-green-500 text-green-400 hover:bg-green-500/10"
            onClick={open}
          >
            <Terminal className="w-4 h-4 mr-2" />
            Press Cmd+K
          </Button>
        </div>
      </div>
    </header>
  );
};
