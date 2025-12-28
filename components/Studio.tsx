
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './ImageUploader';
import { ResultDisplay } from './ResultDisplay';
import { generateTryOnImage, generateStylingAdvice } from '../services/geminiService';
import { toBase64 } from '../utils/fileUtils';
import type { ImageData, HistoryItem } from '../types';

const BACKGROUND_PRESETS = [
  { id: 'original', label: 'Original', icon: '👤' },
  { id: 'runway', label: 'Runway', icon: '✨' },
  { id: 'studio', label: 'Studio', icon: '📸' },
  { id: 'urban', label: 'Urban', icon: '🏙️' },
  { id: 'luxury', label: 'Luxe', icon: '💎' },
];

const renderTextWithBold = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

const formatContent = (text: string) => {
  return text.split('\n').map((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) return <div key={idx} className="h-2" />;
    
    // Check for bullets (*, -, 1.)
    if (trimmed.startsWith('*') || trimmed.startsWith('-') || /^\d+\./.test(trimmed)) {
      const content = trimmed.replace(/^[*-\d.]+\s*/, '');
      return (
        <div key={idx} className="flex gap-3 mb-3 items-start">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
          <span className="text-gray-300 leading-relaxed text-sm">
            {renderTextWithBold(content)}
          </span>
        </div>
      );
    }
    
    return (
      <p key={idx} className="mb-2 last:mb-0 text-gray-300 leading-relaxed text-sm">
        {renderTextWithBold(trimmed)}
      </p>
    );
  });
};

const InsightSection: React.FC<{ title: string; content: string; icon?: React.ReactNode }> = ({ title, content, icon }) => (
  <div className="bg-gray-900/60 border border-gray-800 p-6 rounded-2xl h-full flex flex-col hover:bg-gray-900/80 transition-colors group">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h4 className="text-[11px] font-black uppercase text-gray-400 tracking-[0.2em]">{title}</h4>
    </div>
    <div className="flex-1">
      {formatContent(content)}
    </div>
  </div>
);

interface StudioProps {
  onSave: (item: HistoryItem) => void;
}

export const Studio: React.FC<StudioProps> = ({ onSave }) => {
  const [modelImage, setModelImage] = useState<ImageData | null>(null);
  const [outfitImage, setOutfitImage] = useState<ImageData | null>(null);
  const [generatedImage, setGeneratedImage] = useState<ImageData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [customInstructions, setCustomInstructions] = useState("");
  const [selectedBg, setSelectedBg] = useState("original");
  
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [advice, setAdvice] = useState<string | null>(null);

  const handleImageUpload = useCallback(async (file: File, setImageState: React.Dispatch<React.SetStateAction<ImageData | null>>) => {
    try {
      const imageData = await toBase64(file);
      setImageState(imageData);
    } catch (err) {
      setError('Failed to process image file.');
    }
  }, []);

  const handleTryOn = useCallback(async () => {
    if (!modelImage || !outfitImage) {
      setError('Upload both images to continue.');
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedImage(null);
    setAdvice(null);

    try {
      const result = await generateTryOnImage(modelImage, outfitImage, customInstructions, selectedBg);
      setGeneratedImage(result);
      
      const stylingAdvice = await generateStylingAdvice(productName, result);
      setAdvice(stylingAdvice);
      
      onSave({
        id: crypto.randomUUID(),
        modelImage,
        outfitImage,
        resultImage: result,
        timestamp: Date.now(),
        prompt: customInstructions,
        productName: productName || "Untitled Product",
        price: price,
        stylingAdvice
      });
    } catch (err: any) {
      setError(err.message || 'API call failed');
    } finally {
      setLoading(false);
    }
  }, [modelImage, outfitImage, customInstructions, selectedBg, productName, price, onSave]);

  const parseAdvice = (text: string) => {
    const sections: Record<string, string> = {};
    const keys = ['MARKET APPEAL', 'STYLING STRATEGY', 'CATALOG COPY', 'SOCIAL MEDIA HOOK'];
    
    let currentKey = "";
    text.split('\n').forEach(line => {
      const cleanLine = line.trim();
      const match = keys.find(k => cleanLine.toUpperCase().includes(`[${k}]`));
      if (match) {
        currentKey = match;
      } else if (currentKey && cleanLine) {
        sections[currentKey] = (sections[currentKey] || "") + cleanLine + "\n";
      }
    });
    return sections;
  };

  const parsedAdvice = advice ? parseAdvice(advice) : null;

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">Active Merchant Session</span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tight italic">Studio</h2>
        </div>
        <div className="flex gap-2 bg-gray-900/50 p-2 rounded-2xl border border-gray-800 backdrop-blur-md">
           {BACKGROUND_PRESETS.map((bg) => (
             <button
               key={bg.id}
               onClick={() => setSelectedBg(bg.id)}
               className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                 selectedBg === bg.id 
                 ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/30' 
                 : 'text-gray-500 hover:text-gray-300'
               }`}
             >
               <span className="mr-2">{bg.icon}</span> {bg.label}
             </button>
           ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUploader
              id="model-uploader"
              title="Target Model"
              description="Upload reference figure"
              onImageUpload={(file) => handleImageUpload(file, setModelImage)}
              imagePreviewUrl={modelImage ? `data:${modelImage.mimeType};base64,${modelImage.base64}` : null}
              disabled={loading}
            />
            <ImageUploader
              id="outfit-uploader"
              title="Catalog Item"
              description="Upload product shot"
              onImageUpload={(file) => handleImageUpload(file, setOutfitImage)}
              imagePreviewUrl={outfitImage ? `data:${outfitImage.mimeType};base64,${outfitImage.base64}` : null}
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-900/40 p-6 rounded-2xl border border-gray-800 group focus-within:border-indigo-500/50 transition-all">
              <label className="block text-[10px] font-black text-gray-500 mb-3 uppercase tracking-[0.2em]">Product Name</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Ex: High-Neck Silk Blouse"
                className="w-full bg-transparent border-none outline-none text-white font-bold text-lg placeholder:text-gray-700"
              />
            </div>
            <div className="bg-gray-900/40 p-6 rounded-2xl border border-gray-800 group focus-within:border-indigo-500/50 transition-all">
              <label className="block text-[10px] font-black text-gray-500 mb-3 uppercase tracking-[0.2em]">Price Label</label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Ex: $129.00"
                className="w-full bg-transparent border-none outline-none text-white font-bold text-lg placeholder:text-gray-700"
              />
            </div>
          </div>

          <div className="bg-gray-900/40 p-6 rounded-2xl border border-gray-800 group focus-within:border-indigo-500/50 transition-all">
            <label className="block text-[10px] font-black text-gray-500 mb-4 uppercase tracking-[0.2em]">Creative Direction</label>
            <textarea
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="E.g. Add golden hour lighting, cinematic focus, or editorial mood..."
              className="w-full bg-gray-950/30 border-none outline-none text-sm text-gray-200 min-h-[100px] resize-none placeholder:text-gray-700"
            />
          </div>

          <button
            onClick={handleTryOn}
            disabled={!modelImage || !outfitImage || loading}
            className="w-full h-16 bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] active:scale-[0.98] disabled:grayscale disabled:opacity-50 text-white font-black text-sm uppercase tracking-[0.3em] rounded-2xl shadow-2xl transition-all flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing Digital Fit...</span>
              </>
            ) : (
              "Generate Professional Look"
            )}
          </button>
        </div>

        <div className="lg:col-span-5">
          <ResultDisplay 
            image={generatedImage ? `data:${generatedImage.mimeType};base64,${generatedImage.base64}` : null} 
            loading={loading} 
            error={error} 
          />
        </div>
      </div>

      {parsedAdvice && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="flex items-center justify-between border-b border-gray-800 pb-6 px-2">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="font-black text-white text-xl tracking-tight uppercase">Merchant Asset Intelligence</h3>
                <p className="text-gray-500 text-xs font-bold tracking-widest mt-1">AI-POWERED COMMERCE STRATEGY</p>
              </div>
            </div>
            <div className="hidden md:flex gap-4">
               <div className="text-right">
                  <p className="text-[10px] font-black text-gray-600 uppercase">Analysis Confidence</p>
                  <p className="text-lg font-black text-green-500 tracking-tighter">98.4%</p>
               </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             <InsightSection 
                title="Market Appeal" 
                content={parsedAdvice['MARKET APPEAL']} 
                icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>}
             />
             <InsightSection 
                title="Styling Strategy" 
                content={parsedAdvice['STYLING STRATEGY']} 
                icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>}
             />
             <InsightSection 
                title="Catalog Copy" 
                content={parsedAdvice['CATALOG COPY']} 
                icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>}
             />
             <InsightSection 
                title="Social Hook" 
                content={parsedAdvice['SOCIAL MEDIA HOOK']} 
                icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586l6.828-6.828A6 6 0 0121 9z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>}
             />
          </div>
        </div>
      )}
    </div>
  );
};
