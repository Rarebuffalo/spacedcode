import React from "react";
import { X } from "lucide-react";

interface SystemDesignDisplayProps {
  onClose: () => void;
}

export const SystemDesignDisplay: React.FC<SystemDesignDisplayProps> = ({ 
  onClose 
}) => {
  const diagram = `[User Browser] -> [Vite Frontend] -> [Hono API] -> [Upstash Redis]
                                     |
                                     v
                                [Resend Email]`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-4xl bg-gray-900 border border-green-500/30 rounded-lg shadow-2xl shadow-green-500/20 overflow-hidden animate-zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-800 border-b border-green-500/30">
          <h2 className="text-xl font-bold text-green-400">System Architecture</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {/* Architecture Diagram */}
          <div className="mb-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <h3 className="text-lg font-bold mb-3 text-green-400">System Diagram</h3>
            <pre className="overflow-x-auto rounded bg-gray-950 p-6 text-left text-sm text-green-400">
              {diagram}
            </pre>
          </div>
          
          {/* Tech Stack */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-3 text-green-400">Technology Stack</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <h4 className="font-bold mb-2">Frontend</h4>
                <ul className="space-y-1 text-sm">
                  <li>• React 18 + TypeScript</li>
                  <li>• Vite build system</li>
                  <li>• Tailwind CSS + shadcn/ui</li>
                  <li>• Zustand state management</li>
                  <li>• React Query data fetching</li>
                </ul>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <h4 className="font-bold mb-2">Backend</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Hono.js server framework</li>
                  <li>• Cloudflare Workers/Node.js</li>
                  <li>• Upstash Redis database</li>
                  <li>• Resend.com email service</li>
                  <li>• LeetCode API integration</li>
                </ul>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <h4 className="font-bold mb-2">Infrastructure</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Turborepo monorepo</li>
                  <li>• Vercel frontend hosting</li>
                  <li>• Cloudflare Workers backend</li>
                  <li>• GitHub Actions CI/CD</li>
                  <li>• ESLint + Prettier tooling</li>
                </ul>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <h4 className="font-bold mb-2">Key Features</h4>
                <ul className="space-y-1 text-sm">
                  <li>• LeetCode spaced repetition</li>
                  <li>• Developer stats dashboard</li>
                  <li>• Hidden terminal interface</li>
                  <li>• Email notifications</li>
                  <li>• Responsive design</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Architecture Explanation */}
          <div className="mb-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <h3 className="text-lg font-bold mb-3 text-green-400">Architecture Design</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-bold mb-1">Monorepo Structure</h4>
                <p className="text-sm text-gray-300">
                  The project uses Turborepo to manage multiple apps and packages in a single repository. 
                  This allows sharing code between frontend and backend while maintaining strict separation 
                  of concerns.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-1">Edge Computing</h4>
                <p className="text-sm text-gray-300">
                  The backend API is built with Hono.js and deployed to Cloudflare Workers for sub-50ms 
                  response times globally. The edge-first architecture ensures low latency for API requests 
                  regardless of user location.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-1">Data Flow</h4>
                <p className="text-sm text-gray-300">
                  User interactions trigger API calls to the backend which fetches data from LeetCode, 
                  GitHub, and WakaTime APIs. Redis caches frequently accessed data to reduce latency 
                  and external API calls.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="px-6 py-3 bg-gray-800/80 border-t border-green-500/20 text-xs text-gray-500">
          <div className="flex justify-between">
            <span>SpacedCode Terminal Architecture</span>
            <span>v1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};
