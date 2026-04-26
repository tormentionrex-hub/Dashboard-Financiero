import React, { createContext, useContext, useState } from 'react';

const AiContext = createContext();

export function AiProvider({ children }) {
  const [isAnalyzed, setIsAnalyzed] = useState(false);

  const runAnalysis = () => {
    setIsAnalyzed(true);
  };

  const resetAnalysis = () => {
    setIsAnalyzed(false);
  };

  return (
    <AiContext.Provider value={{ isAnalyzed, runAnalysis, resetAnalysis }}>
      {children}
    </AiContext.Provider>
  );
}

export const useAiAnalysis = () => {
  const context = useContext(AiContext);
  if (context === undefined) {
    throw new Error('useAiAnalysis must be used within an AiProvider');
  }
  return context;
};
