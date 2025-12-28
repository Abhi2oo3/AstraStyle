
import React, { useState } from 'react';
import { Spinner } from './Spinner';

interface ResultDisplayProps {
  image: string | null;
  loading: boolean;
  error: string | null;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ image, loading, error }) => {
  const [showComparison, setShowComparison] = useState(false);

  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
      <div className="relative w-full aspect-[4/5] bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl flex flex-col items-center justify-center overflow-hidden shadow-2xl">
        {loading ? (
          <Spinner />
        ) : error ? (
          <div className="text-center p-8">
            <p className="text-red-400 font-bold mb-2">Error Encountered</p>
            <p className="text-gray-500 text-xs">{error}</p>
          </div>
        ) : image ? (
          <div className="relative w-full h-full">
             <img
              src={image}
              alt="Generated result"
              className="w-full h-full object-contain animate-in fade-in duration-700"
            />
            
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-indigo-600/90 text-[10px] font-black uppercase tracking-tighter px-2 py-1 rounded text-white shadow-lg">
                Pro Render
              </span>
            </div>

            <div className="absolute bottom-4 right-4 flex gap-2">
               <a 
                href={image} 
                download="astrastyle-render.png"
                className="bg-gray-950/80 backdrop-blur-md p-3 rounded-xl text-white hover:bg-indigo-600 transition-colors shadow-lg"
               >
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
               </a>
            </div>
          </div>
        ) : (
          <div className="text-center p-8">
            <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
               <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <p className="text-gray-400 font-bold">Waiting for Input...</p>
            <p className="text-xs text-gray-500 mt-2 max-w-[200px]">Merchant-grade renders will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};
