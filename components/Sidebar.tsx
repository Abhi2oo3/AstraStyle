
import React from 'react';
import { View } from '../types';

interface SidebarProps {
  activeView: View;
  onViewChange: (view: View) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  return (
    <aside className="w-64 border-r border-gray-800 bg-gray-900/50 backdrop-blur-xl flex flex-col p-4 shrink-0">
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l1.912 5.886h6.191l-5.008 3.638 1.912 5.886-5.007-3.638-5.007 3.638 1.912-5.886-5.008-3.638h6.191z" />
            <circle cx="12" cy="11" r="2" />
            <path d="M12 3v2M12 17v2M3 12h2M19 12h2" opacity="0.6" />
          </svg>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">AstraStyle</h1>
      </div>

      <nav className="flex-1 space-y-1">
        <button
          onClick={() => onViewChange('studio')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            activeView === 'studio' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span className="font-medium">Studio</span>
        </button>
        
        <button
          onClick={() => onViewChange('library')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            activeView === 'library' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
          </svg>
          <span className="font-medium">Lookbook</span>
        </button>

        <button
          onClick={() => onViewChange('strategy')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            activeView === 'strategy' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="font-medium">Market Strategy</span>
        </button>
      </nav>

      <div className="mt-auto p-4 rounded-xl bg-gray-800/20 border border-gray-800/50">
        <p className="text-[10px] text-center text-gray-500 font-bold uppercase tracking-widest">
          made by Abhishek Dixit
        </p>
      </div>
    </aside>
  );
};
