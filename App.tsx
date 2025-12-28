
import React, { useState, useCallback, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Studio } from './components/Studio';
import { Library } from './components/Library';
import { Strategy } from './components/Strategy';
import type { HistoryItem, View } from './types';

const MAX_HISTORY_ITEMS = 5;

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('studio');
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('styler_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  const saveToHistory = useCallback((item: HistoryItem) => {
    setHistory(prev => {
      // Limit history size to prevent localStorage quota issues with large base64 strings
      const newHistory = [item, ...prev].slice(0, MAX_HISTORY_ITEMS);
      try {
        localStorage.setItem('styler_history', JSON.stringify(newHistory));
      } catch (e) {
        console.warn("Storage quota exceeded, could not save to local storage", e);
      }
      return newHistory;
    });
  }, []);

  const deleteFromHistory = useCallback((id: string) => {
    setHistory(prev => {
      const newHistory = prev.filter(h => h.id !== id);
      try {
        localStorage.setItem('styler_history', JSON.stringify(newHistory));
      } catch (e) {
        console.error("Failed to update history in storage", e);
      }
      return newHistory;
    });
  }, []);

  const renderContent = () => {
    switch(activeView) {
      case 'studio': return <Studio onSave={saveToHistory} />;
      case 'library': return <Library history={history} onDelete={deleteFromHistory} />;
      case 'strategy': return <Strategy />;
      default: return <Studio onSave={saveToHistory} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 font-sans selection:bg-indigo-500/30 overflow-hidden">
      <Sidebar 
        activeView={activeView} 
        onViewChange={setActiveView} 
      />
      
      <main className="flex-1 h-full overflow-y-auto bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950/20">
        <div className="container mx-auto max-w-6xl px-6 py-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
