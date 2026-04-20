import { useEffect, useRef } from "react";
import { useTerminalStore } from "../store/terminalStore";

export const useKeyboardShortcut = () => {
  const { toggle, close } = useTerminalStore();
  const isInputFocusedRef = useRef(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if user is typing in an input/textarea
      const isInputFocused = 
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA" ||
        document.activeElement?.getAttribute("contenteditable") === "true";
      
      isInputFocusedRef.current = isInputFocused;

      // Cmd+K or Ctrl+K to toggle terminal (but not when typing in input)
      if ((event.metaKey || event.ctrlKey) && event.key === "k" && !isInputFocused) {
        event.preventDefault();
        toggle();
      }

      // Escape to close terminal
      if (event.key === "Escape") {
        close();
      }
    };

    // Add global event listeners
    window.addEventListener("keydown", handleKeyDown);
    
    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [toggle, close]);

  // Also handle focus events to prevent keyboard shortcuts when typing
  useEffect(() => {
    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      isInputFocusedRef.current = 
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.getAttribute("contenteditable") === "true";
    };

    const handleFocusOut = () => {
      isInputFocusedRef.current = false;
    };

    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);

    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
    };
  }, []);

  return {
    isInputFocused: isInputFocusedRef.current,
  };
};
