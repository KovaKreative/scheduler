import { useState } from "react";

export default function useVisualMode(initialMode) {
  const [mode, setMode] = useState(initialMode);
  const [history, setHistory] = useState([initialMode]);

  function transition(newMode, replace = false) {
    setMode(newMode);
    let historyBuffer = [...history];
    if(replace) {
      historyBuffer.pop();
    }
    setHistory([...historyBuffer, newMode]);
  }

  function back() {
    if (history.length <= 1) {
      return;
    }
    let historyBuffer = [...history];
    historyBuffer.pop();
    setMode(historyBuffer[historyBuffer.length - 1]);
    setHistory([...historyBuffer]);
  }

  return { mode, transition, back };
}