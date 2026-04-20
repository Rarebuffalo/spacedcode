import { create } from "zustand";
import { rot13, siteConfig } from "../lib/siteConfig";

export interface TerminalState {
  isOpen: boolean;
  commandHistory: string[];
  outputHistory: Array<{
    type: "command" | "output" | "error";
    content: string;
    timestamp: number;
  }>;
  currentCommand: string;
  
  // Actions
  toggle: () => void;
  open: () => void;
  close: () => void;
  addCommand: (command: string) => void;
  addOutput: (output: string, type?: "output" | "error") => void;
  setCurrentCommand: (command: string) => void;
  clearHistory: () => void;
}

export const useTerminalStore = create<TerminalState>((set, get) => ({
  isOpen: false,
  commandHistory: [],
  outputHistory: [
    {
      type: "output",
      content: "Welcome to SpacedCode Terminal v1.0.0",
      timestamp: Date.now(),
    },
    {
      type: "output",
      content: "Type 'help' to see available commands",
      timestamp: Date.now(),
    },
  ],
  currentCommand: "",

  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  
  open: () => set({ isOpen: true }),
  
  close: () => set({ isOpen: false }),
  
  addCommand: (command: string) =>
    set((state) => ({
      commandHistory: [...state.commandHistory, command],
      outputHistory: [
        ...state.outputHistory,
        {
          type: "command",
          content: `$ ${command}`,
          timestamp: Date.now(),
        },
      ],
      currentCommand: "",
    })),
  
  addOutput: (output: string, type: "output" | "error" = "output") =>
    set((state) => ({
      outputHistory: [
        ...state.outputHistory,
        {
          type,
          content: output,
          timestamp: Date.now(),
        },
      ],
    })),
  
  setCurrentCommand: (command: string) =>
    set({ currentCommand: command }),
  
  clearHistory: () =>
    set({
      outputHistory: [
        {
          type: "output",
          content: "Terminal history cleared",
          timestamp: Date.now(),
        },
      ],
      commandHistory: [],
    }),
}));

// Predefined commands and their handlers
export const terminalCommands = {
  help: () => `
Available commands:
• help          - Show this help message
• whois         - About the developer
• projects      - List of projects
• contact       - Contact information (ROT13 encoded)
• decode [text] - Decode ROT13 text
• stats         - Developer stats (WakaTime, GitHub)
• waka          - Alias for stats
• architecture  - System architecture diagram
• clear         - Clear terminal history
• exit          - Close terminal
  `.trim(),

  whois: () => `
┌─────────────────────────────────────────────────────────────┐
│  Krishna Singh — Backend / Systems Engineer                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  I build backend systems. The kind that actually handle     │
│  load and don't crash when things go sideways.              │
│                                                             │
│  What I actually care about:                                │
│  > Retry logic when things fail                             │
│  > Async workers that don't silently break                  │
│  > Database schemas built for queries, not just storage     │
│  > Systems that survive 2 AM outages                        │
│                                                             │
│  I think in event loops, worker queues, and Redis-backed    │
│  async processing. MongoDB schemas are designed around      │
│  query behavior, not just how the data looks.               │
│                                                             │
│  Stack I live in:                                           │
│  > Python | FastAPI | Redis | MongoDB | PostgreSQL          │
│                                                             │
│  Right now I'm in 7th semester, but I stopped waiting       │
│  for permission to call myself an engineer.                 │
│                                                             │
│  Looking for: SDE role. Something I can own end-to-end.     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
  `.trim(),

  projects: () => `
1. SpacedCode
   https://github.com/Rarebuffalo/spacedcode

2. Sentinel
   https://github.com/Rarebuffalo/Sentinel

3. SecureLens Frontend
   https://github.com/Rarebuffalo/securelens-frontend

4. SecureLens Backend
   https://github.com/Rarebuffalo/securelens-backend

5. Log Processing System
   https://github.com/Rarebuffalo/log-processing-system

6. Indian Law RAG
   https://github.com/Rarebuffalo/indian-law-rag

7. X-agent
   https://github.com/Rarebuffalo/X-agent
  `.trim(),

  contact: () => `
Email (ROT13 encoded): ${siteConfig.encodedEmail}
Use 'decode ${siteConfig.encodedEmail}' to decode.

LinkedIn: ${siteConfig.linkedinUrl}
GitHub: ${siteConfig.githubUrl}
  `.trim(),

  decode: (text: string) => {
    if (!text) {
      return "Usage: decode [text] - Decode ROT13 encoded text";
    }
    return rot13(text);
  },

  stats: async (): Promise<string> => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";
      const response = await fetch(`${apiBaseUrl}/api/dev/stats`);

      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      const payload = await response.json();
      const githubData = payload.data.github;
      const wakatimeData = payload.data.wakatime;

      return `
> Coding Stats (Last 7 Days)
> WakaTime: ${wakatimeData.hours} hours
> GitHub: ${githubData.contributions} contributions | ${githubData.streak} day streak
> Repos: ${githubData.publicRepos} | Followers: ${githubData.followers} | Stars: ${githubData.totalStars}
> Top Languages: ${githubData.topLanguages.join(", ")}
      `.trim();
    } catch (error) {
      console.error('Stats error:', error);
      return `Failed to fetch stats: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  },

  architecture: () => `
[User Browser] -> [Vercel Edge] -> [Hono API] -> [Upstash Redis]
                                      |
                                      v
                                 [Resend Email]

System Architecture:
• Frontend: Vite + React 18 + TypeScript + Tailwind
• Backend: Hono.js (Cloudflare Workers/Node.js)
• Database: Upstash Redis (serverless Redis)
• Email: Resend.com
• Deployment: Vercel (Frontend), Cloudflare Workers (Backend)
• CI/CD: GitHub Actions

This portfolio runs on a Turborepo monorepo with CI/CD via GitHub Actions.
The backend uses Hono.js for sub-50ms cold starts.
  `.trim(),

  clear: () => {
    useTerminalStore.getState().clearHistory();
    return "Terminal cleared.";
  },

  exit: () => {
    useTerminalStore.getState().close();
    return "Closing terminal...";
  },

};
