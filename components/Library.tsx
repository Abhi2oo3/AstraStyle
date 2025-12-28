
import React, { useState } from 'react';
import type { HistoryItem } from '../types';

interface LibraryProps {
  history: HistoryItem[];
  onDelete: (id: string) => void;
}

const renderTextWithBold = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

const formatAdviceLines = (text?: string) => {
  if (!text) return null;
  return text.split('\n').map((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) return <div key={i} className="h-3" />;
    
    if (trimmed.startsWith('[')) {
      return (
        <h4 key={i} className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.2em] mt-8 mb-4 border-b border-indigo-500/20 pb-2">
          {trimmed.replace(/[\[\]]/g, '')}
        </h4>
      );
    }
    
    if (trimmed.startsWith('*') || trimmed.startsWith('-') || /^\d+\./.test(trimmed)) {
       const content = trimmed.replace(/^[*-\d.]+\s*/, '');
       return (
         <div key={i} className="flex gap-3 mb-3 items-start group">
           <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0 group-hover:shadow-[0_0_10px_rgba(99,102,241,0.8)] transition-all" />
           <span className="text-sm text-gray-300 leading-relaxed">
             {renderTextWithBold(content)}
           </span>
         </div>
       );
    }
    
    return (
      <p key={i} className="text-sm text-gray-300 leading-relaxed mb-3">
        {renderTextWithBold(trimmed)}
      </p>
    );
  });
};

export const Library: React.FC<LibraryProps> = ({ history, onDelete }) => {
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <header className="flex items-center justify-between border-b border-gray-800 pb-8">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight italic">Lookbook</h2>
          <p className="text-gray-500 mt-2 font-bold tracking-widest text-xs">MERCHANT ASSET ARCHIVE</p>
        </div>
        <div className="px-6 py-3 bg-indigo-600/10 border border-indigo-500/30 rounded-2xl text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] shadow-xl">
          {history.length} / 5 Assets Stored
        </div>
      </header>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-gray-800 rounded-[3rem] bg-gray-900/10">
          <div className="w-24 h-24 rounded-3xl bg-gray-900 border border-gray-800 flex items-center justify-center mb-6 shadow-2xl">
             <svg className="w-10 h-10 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <p className="text-gray-400 font-black uppercase tracking-widest text-sm">Vault is empty</p>
          <p className="text-xs text-gray-600 mt-2">Generate assets in the studio to populate your archive.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {history.map((item) => (
            <div key={item.id} className="group relative bg-gray-900/20 border border-gray-800/50 rounded-[2rem] overflow-hidden hover:border-indigo-500/50 transition-all flex flex-col shadow-2xl hover:-translate-y-1 duration-500">
              <div className="relative aspect-[4/5] overflow-hidden">
                <img 
                  src={`data:${item.resultImage.mimeType};base64,${item.resultImage.base64}`} 
                  alt={item.productName} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]"
                />
                {item.price && (
                  <div className="absolute top-6 left-6 bg-white text-gray-950 font-black px-4 py-1.5 rounded-full text-xs shadow-2xl tracking-tighter">
                    {item.price}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col justify-end p-8">
                   <button 
                    onClick={() => setSelectedItem(item)}
                    className="w-full bg-indigo-600 text-white font-black text-[10px] py-4 rounded-2xl uppercase tracking-[0.3em] shadow-2xl hover:bg-white hover:text-indigo-600 transition-all active:scale-95"
                   >
                     Inspect Strategy
                   </button>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col bg-gray-950/40 backdrop-blur-md">
                <div className="flex justify-between items-start">
                   <div>
                    <h3 className="font-black text-white text-lg tracking-tight truncate max-w-[200px] italic">{item.productName || "Product Asset"}</h3>
                    <p className="text-[10px] text-gray-600 uppercase tracking-widest font-black mt-1">
                      Rendered: {new Date(item.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <a 
                      href={`data:${item.resultImage.mimeType};base64,${item.resultImage.base64}`}
                      download={`${item.productName || 'astrastyle-asset'}.png`}
                      className="p-3 bg-gray-900/50 rounded-xl text-gray-500 hover:text-indigo-400 transition-all border border-gray-800"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    </a>
                    <button 
                      onClick={() => onDelete(item.id)}
                      className="p-3 bg-gray-900/50 rounded-xl text-gray-500 hover:text-red-400 transition-all border border-gray-800"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-gray-950/95 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="bg-gray-900 border border-white/5 rounded-[3rem] w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col lg:flex-row shadow-[0_0_100px_rgba(0,0,0,0.8)] relative">
            <button 
              onClick={() => setSelectedItem(null)} 
              className="absolute top-8 right-8 z-10 p-3 bg-gray-950/50 backdrop-blur-md border border-white/10 rounded-full text-white/50 hover:text-white transition-all hover:rotate-90 duration-300"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div className="w-full lg:w-1/2 bg-gray-950 flex items-center justify-center p-10 relative">
               <div className="absolute top-10 left-10 text-white/10 font-black text-6xl select-none">ASTRA</div>
               <img 
                src={`data:${selectedItem.resultImage.mimeType};base64,${selectedItem.resultImage.base64}`} 
                className="max-h-full object-contain rounded-3xl shadow-2xl relative z-10" 
                alt="Product detail"
               />
            </div>
            
            <div className="w-full lg:w-1/2 p-12 overflow-y-auto custom-scrollbar">
               <div className="mb-10">
                 <div className="flex items-center gap-2 mb-2">
                   <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.6)]"></div>
                   <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">Growth Intelligence</span>
                 </div>
                 <h3 className="text-5xl font-black text-white tracking-tighter italic">{selectedItem.productName}</h3>
                 <p className="text-gray-500 font-bold text-lg mt-1">{selectedItem.price || "Contact for Pricing"}</p>
               </div>
               
               <div className="space-y-10">
                 <div className="bg-gray-800/20 p-8 rounded-[2rem] border border-gray-800/50 relative overflow-hidden group">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-600/5 rounded-full blur-3xl group-hover:bg-indigo-600/10 transition-all duration-700"></div>
                    <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] mb-6 flex items-center gap-2">
                       <span className="w-4 h-[1px] bg-gray-700"></span>
                       Strategic Brief
                    </h4>
                    {formatAdviceLines(selectedItem.stylingAdvice)}
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                       <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Asset Status</p>
                       <p className="text-white font-bold text-sm">Web Ready</p>
                    </div>
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                       <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Legal Clearance</p>
                       <p className="text-white font-bold text-sm">AI Generated</p>
                    </div>
                 </div>

                 <div className="flex flex-col md:flex-row gap-4 pt-6 pb-10">
                    <button className="flex-1 bg-white text-gray-950 font-black text-[10px] py-5 rounded-2xl uppercase tracking-[0.2em] shadow-2xl hover:bg-indigo-600 hover:text-white transition-all active:scale-95">
                      Deploy to E-Commerce
                    </button>
                    <button className="flex-1 bg-gray-800 text-white font-black text-[10px] py-5 rounded-2xl uppercase tracking-[0.2em] hover:bg-gray-700 transition-all active:scale-95 border border-white/5">
                      Export Source Bundle
                    </button>
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
