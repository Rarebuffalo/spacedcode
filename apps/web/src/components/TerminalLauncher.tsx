import React, { useState, useEffect } from "react";
import { Terminal } from "lucide-react";
import { useTerminalStore } from "../store/terminalStore";

export const TerminalLauncher: React.FC = () => {
  const { open, isOpen } = useTerminalStore();
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsVisible(!isOpen);
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-40 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating button */}
      <button
        onClick={open}
        className={`
          flex items-center justify-center gap-2
          rounded-2xl border border-green-500/40 bg-slate-950/95 px-4 py-3
          shadow-lg shadow-green-500/10 backdrop-blur
          transition-all duration-300
          hover:-translate-y-0.5 hover:border-green-400 hover:shadow-xl hover:shadow-green-500/20
          active:scale-95
          ${isHovered ? "ring-1 ring-green-500/30" : ""}
        `}
        aria-label="Open terminal"
        title="Open terminal (Cmd+K or Ctrl+K)"
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-green-400" />
          <span className="font-mono text-green-400 text-sm font-medium">&gt;_</span>
        </div>

        {/* Tooltip on hover */}
        {isHovered && (
          <div className="absolute -top-12 right-0 whitespace-nowrap rounded-xl border border-green-500/30 bg-slate-950 px-3 py-2 shadow-lg">
            <div className="text-xs text-green-400 font-mono">
              Open Terminal
            </div>
            <div className="mt-1 text-[10px] text-gray-400">
              Cmd+K / Ctrl+K
            </div>
          </div>
        )}
      </button>
    </div>
  );
};
