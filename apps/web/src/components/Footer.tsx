import React from "react";
import { Heart, Code, Coffee } from "lucide-react";
import { siteConfig } from "../lib/siteConfig";
import { useTerminalStore } from "../store/terminalStore";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { open } = useTerminalStore();

  return (
    <footer className="mt-16 border-t border-gray-800 bg-gray-900/50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">SpacedCode Terminal</h3>
            <p className="text-gray-400 text-sm">
              A hybrid portfolio that combines LeetCode spaced repetition with a hidden developer terminal.
              Built to solve my own DSA retention problem.
            </p>
            <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
              <Code className="w-4 h-4" />
              <span>Built with React, TypeScript, Hono, Redis</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href={siteConfig.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-400 transition-colors"
                >
                  GitHub Repository
                </a>
              </li>
              <li>
                <a 
                  href={siteConfig.leetcodeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  LeetCode
                </a>
              </li>
              <li>
                <a 
                  href="/api" 
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  API Documentation
                </a>
              </li>
              <li>
                <button 
                  onClick={open}
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  Open Terminal (Cmd+K)
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Hiring?</h3>
            <p className="text-gray-400 text-sm mb-4">
              I'm a 7th semester CS student seeking Summer 2026 SDE internships.
              Passionate about full-stack development, developer tools, and solving real problems.
            </p>
            <div className="flex items-center gap-4">
              <a
                href={siteConfig.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                LinkedIn
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="px-4 py-2 border border-gray-700 hover:border-green-400 text-gray-300 hover:text-green-400 rounded-lg text-sm font-medium transition-colors"
              >
                Email Me
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Coffee className="w-4 h-4" />
            <span>Built during late-night coding sessions</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Heart className="w-4 h-4 text-red-400" />
            <span>
              © {currentYear} SpacedCode Terminal. Built by a 7th semester developer.
            </span>
          </div>

          <div className="text-xs text-gray-600">
            <p>This project uses mock data when APIs are unavailable.</p>
            <p className="mt-1">Not affiliated with LeetCode. Educational purpose only.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
