import React, { useState, useEffect } from "react";
import { Toaster } from "sonner";
import DailyProblemCard from "./components/DailyProblemCard";
import StatsDashboard from "./components/StatsDashboard";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { TerminalLauncher } from "./components/TerminalLauncher";
import { Terminal } from "./components/Terminal";
import { useTerminalStore } from "./store/terminalStore";
import { Brain, Zap, Clock, Users } from "lucide-react";
import { SystemDesignDisplay } from "./components/SystemDesignDisplay";
import { useKeyboardShortcut } from "./hooks/useKeyboardShortcut";
import { siteConfig } from "./lib/siteConfig";

// Mock data for fallback
const mockProblem = {
  title: "Two Sum",
  slug: "two-sum",
  difficulty: "Easy" as const,
  link: "https://leetcode.com/problems/two-sum",
  tags: ["Array", "Hash Table"],
  isPaidOnly: false,
  date: new Date().toISOString().split("T")[0],
  isMock: true,
};

function App() {
  const [dailyProblem, setDailyProblem] = useState(mockProblem);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [starredCount, setStarredCount] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeToday, setActiveToday] = useState(0);
  const [showArchitecture, setShowArchitecture] = useState(false);
  useKeyboardShortcut();

  useEffect(() => {
    fetchDailyProblem();
    fetchStarredCount();
  }, []);

  const fetchDailyProblem = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/leetcode/daily");
      const data = await response.json();
      
      if (data.success) {
        setDailyProblem(data.data);
      } else {
        setError("Failed to fetch daily problem");
      }
    } catch (err) {
      console.error("Error fetching daily problem:", err);
      setError("Network error. Using demo data.");
      // Keep using mock data
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStarredCount = async () => {
    try {
      const response = await fetch("/api/user/stats");
      const data = await response.json();
      
      if (data.success) {
        setStarredCount(data.data.globalStats.totalProblemsStarred || 0);
        setTotalUsers(data.data.globalStats.totalUsers || 0);
        setActiveToday(data.data.globalStats.activeToday || 0);
      }
    } catch (err) {
      console.error("Error fetching starred count:", err);
    }
  };

  const handleStarSuccess = () => {
    setStarredCount(prev => prev + 1);
    fetchStarredCount(); // Refresh count
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
        <Toaster 
          position="top-right"
          toastOptions={{
            className: "bg-gray-800 text-white border border-gray-700",
          }}
        />
        
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <section className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-cyan-400">
              SpacedCode Terminal
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              A hybrid portfolio that combines LeetCode spaced repetition with a hidden developer terminal.
              Built by {siteConfig.name}, a 7th semester software developer seeking Summer 2026 internships.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
              <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                <Brain className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Spaced Repetition</h3>
                <p className="text-sm text-gray-400">Based on Ebbinghaus curve</p>
              </div>
              <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Daily Challenges</h3>
                <p className="text-sm text-gray-400">LeetCode integration</p>
              </div>
              <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                <Clock className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">3-Day Reminders</h3>
                <p className="text-sm text-gray-400">Optimal review intervals</p>
              </div>
              <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                <Users className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">{starredCount}+ Reviews</h3>
                <p className="text-sm text-gray-400">Problems scheduled</p>
              </div>
            </div>
          </section>

          {/* Main Content */}
          <div id="features" className="grid scroll-mt-28 grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {isLoading ? (
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
                  <p className="text-gray-300">Fetching today's LeetCode challenge...</p>
                </div>
              ) : error ? (
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                  <div className="text-yellow-400 mb-4">
                    <p className="font-semibold">⚠️ {error}</p>
                  </div>
                  <DailyProblemCard 
                    problem={dailyProblem} 
                    onStarSuccess={handleStarSuccess}
                  />
                </div>
              ) : (
                <DailyProblemCard 
                  problem={dailyProblem} 
                  onStarSuccess={handleStarSuccess}
                />
              )}
              
              {/* How It Works Section */}
              <div
                id="how-it-works"
                className="mt-8 scroll-mt-28 rounded-xl border border-gray-700 bg-gray-800/30 p-6"
              >
                <h2 className="text-2xl font-bold mb-4">How Spaced Repetition Works</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-500/20 text-green-400 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold">Star Today's Problem</h3>
                      <p className="text-gray-400">Click "Star for Review" on the daily LeetCode challenge.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-yellow-500/20 text-yellow-400 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold">Get Reminded in 3 Days</h3>
                      <p className="text-gray-400">We'll email you to review the problem when retention drops to ~60%.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-cyan-500/20 text-cyan-400 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold">Reinforce Learning</h3>
                      <p className="text-gray-400">Each review strengthens neural pathways for long-term retention.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <StatsDashboard
                starredCount={starredCount}
                totalUsers={totalUsers}
                activeToday={activeToday}
              />
              
              {/* Easter Egg Hint */}
              <div id="about" className="scroll-mt-28 rounded-xl border border-gray-700 bg-gray-800/50 p-6">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <span className="text-green-400">🎮</span> Developer Easter Egg
                </h3>
                <p className="text-gray-300 mb-4">
                  This portfolio has a hidden terminal interface. Try pressing{" "}
                  <kbd className="px-2 py-1 bg-gray-900 border border-gray-700 rounded text-sm font-mono">
                    Ctrl+K
                  </kbd>{" "}
                  or{" "}
                  <kbd className="px-2 py-1 bg-gray-900 border border-gray-700 rounded text-sm font-mono">
                    Cmd+K
                  </kbd>{" "}
                  (Mac).
                </p>
                <p className="text-sm text-gray-400">
                  Or click the <code className="text-green-400">&gt;_</code> button in the bottom-right corner.
                </p>
              </div>

              {/* About Me */}
              <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
                <h3 className="font-bold text-lg mb-3">👨‍💻 About the Developer</h3>
                <div className="space-y-3 text-sm leading-7 text-gray-300">
                  <p>
                    I build backend systems. The kind that actually handle load and do not
                    crash when things go sideways.
                  </p>
                  <p>
                    Most people stop at "it works." I do not. I care about retry logic,
                    failure recovery, and making sure nothing silently breaks at 2 AM.
                  </p>
                  <p>
                    I think in event loops, worker queues, and Redis-backed async
                    processing. MongoDB schemas are designed around how the queries will
                    actually run, not just how the data looks.
                  </p>
                  <p>
                    Right now I am in 7th semester, but I stopped waiting for permission to
                    call myself an engineer. I build things that scale, survive failure,
                    and do not need constant babysitting.
                  </p>
                  <p>
                    Backend is where I live. Systems thinking is how I operate. I want an
                    SDE role where I can own something real, design it, ship it, watch it
                    run, and make it better.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
        
        {/* Terminal Components */}
        <TerminalLauncher />
        <Terminal setShowArchitecture={setShowArchitecture} />
        
        {/* System Design Display */}
        {showArchitecture && (
          <SystemDesignDisplay onClose={() => setShowArchitecture(false)} />
        )}
      </div>
  );
}

export default App;
