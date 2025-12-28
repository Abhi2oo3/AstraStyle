
import React, { useState, useEffect } from 'react';

const loadingMessages = [
  "Analyzing textures...",
  "Fitting garments...",
  "Adjusting lighting...",
  "Applying shadows...",
  "Polishing final look..."
];

export const Spinner: React.FC = () => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex(prev => (prev + 1) % loadingMessages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></div>
        </div>
      </div>
      <div className="space-y-1 text-center">
        <p className="text-lg font-bold text-white tracking-wide">Designing...</p>
        <p className="text-sm text-gray-400 font-medium animate-pulse">{loadingMessages[msgIndex]}</p>
      </div>
    </div>
  );
};
