import React, { useState, useEffect, useRef } from "react";
import { X, Terminal as TerminalIcon, ChevronRight } from "lucide-react";
import { useTerminalStore, terminalCommands } from "../store/terminalStore";

export const Terminal: React.FC<{ setShowArchitecture: (show: boolean) => void }> = ({ setShowArchitecture }) => {
  const {
    isOpen,
    outputHistory,
    currentCommand,
    addCommand,
    addOutput,
    setCurrentCommand,
    close,
  } = useTerminalStore();

  const [inputValue, setInputValue] = useState("");
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new output is added
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [outputHistory]);

  // Focus input when terminal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const command = inputValue.trim().toLowerCase();
    const args = command.split(" ").slice(1).join(" ");
    const baseCommand = command.split(" ")[0];

    // Add command to history
    addCommand(command);

    // Process command
      let response = "";
    
    try {
      if (baseCommand === "stats" || baseCommand === "waka") {
        addOutput("Fetching live stats...");
      }

      switch (baseCommand) {
        case "help":
          response = terminalCommands.help();
          break;
        case "whois":
          response = terminalCommands.whois();
          break;
        case "projects":
          response = terminalCommands.projects();
          break;
        case "contact":
          response = terminalCommands.contact();
          break;
        case "decode":
          response = terminalCommands.decode(args);
          break;
        case "stats":
        case "waka":
          response = await terminalCommands.stats();
          break;
        case "architecture":
          response = terminalCommands.architecture();
          setShowArchitecture(true);
          break;
        case "clear":
          response = terminalCommands.clear();
          break;
        case "exit":
          response = terminalCommands.exit();
          break;
        default:
          response = `Command not found: ${baseCommand}. Type 'help' for available commands.`;
          addOutput(response, "error");
          setInputValue("");
          return;
      }

      addOutput(response);
    } catch (error) {
      addOutput(`Error executing command: ${error}`, "error");
    }

    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl+L to clear (common terminal shortcut)
    if (e.ctrlKey && e.key === "l") {
      e.preventDefault();
      useTerminalStore.getState().clearHistory();
      setInputValue("");
      return;
    }
    
    // Tab completion (basic)
    if (e.key === "Tab") {
      e.preventDefault();
      const commands = Object.keys(terminalCommands);
      const matching = commands.find(cmd => cmd.startsWith(inputValue));
      if (matching) {
        setInputValue(matching);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={close}
      />
      
      {/* Terminal Window */}
      <div 
        className="relative w-full max-w-4xl h-[50vh] bg-terminal-bg border border-green-500/30 rounded-lg shadow-2xl shadow-green-500/20 animate-slide-down overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-green-500/30">
          <div className="flex items-center gap-2">
            <TerminalIcon className="w-4 h-4 text-green-400" />
            <span className="text-sm font-mono text-green-400">spacedcode-terminal</span>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
          </div>
          <button
            onClick={close}
            className="p-1 hover:bg-gray-800 rounded transition-colors"
            aria-label="Close terminal"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Terminal Content */}
        <div className="h-[calc(100%-3rem)] overflow-y-auto terminal-scrollbar p-4 font-mono text-sm">
          {/* Welcome message */}
          <div className="mb-4 text-gray-400">
            <div>SpacedCode Terminal v1.0.0 - Type 'help' for commands</div>
            <div className="text-xs mt-1">Press ESC or type 'exit' to close</div>
          </div>

          {/* Output History */}
          {outputHistory.map((item, index) => (
            <div
              key={index}
              className={`mb-2 ${
                item.type === "command"
                  ? "text-green-400"
                  : item.type === "error"
                  ? "text-red-400"
                  : "text-gray-300"
              }`}
            >
              {item.type === "command" ? (
                <div className="flex items-start">
                  <ChevronRight className="w-3 h-3 mt-0.5 mr-2 flex-shrink-0 text-green-500" />
                  <span className="whitespace-pre-wrap">{item.content}</span>
                </div>
              ) : (
                <div className="whitespace-pre-wrap ml-5">{item.content}</div>
              )}
            </div>
          ))}

          {/* Input Line */}
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="flex items-center">
              <div className="flex items-center text-green-500 mr-2">
                <ChevronRight className="w-4 h-4" />
                <span className="ml-1">$</span>
              </div>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setCurrentCommand(e.target.value);
                }}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent border-none outline-none text-green-400 font-mono placeholder-gray-600"
                placeholder="Type a command..."
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck="false"
              />
            </div>
          </form>

          {/* Command hints */}
          {inputValue && (
            <div className="mt-2 text-xs text-gray-500">
              <div>Press Enter to execute, Tab for autocomplete, Ctrl+L to clear</div>
            </div>
          )}

          <div ref={terminalEndRef} />
        </div>

        {/* Terminal Footer */}
        <div className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-gray-900/80 border-t border-green-500/20 text-xs text-gray-500 flex justify-between">
          <div>
            <span className="text-green-400">Connected</span>
            <span className="mx-2">•</span>
            <span>{outputHistory.length} lines</span>
          </div>
          <div className="flex gap-4">
            <span>Cmd+K to toggle</span>
            <span>ESC to close</span>
          </div>
        </div>
      </div>
    </div>
  );
};
