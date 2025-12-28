
import React from 'react';

export const Strategy: React.FC = () => {
  const strategies = [
    {
      title: "Instagram Mastery",
      action: "Direct AI Content",
      content: "Use the 'Urban' and 'Runway' presets for your Reels. The AI-generated captions are optimized for high-engagement keywords like #VirtualTryOn and #SustainableFashion.",
      icon: "📸"
    },
    {
      title: "Email Marketing",
      action: "Personalized Catalog",
      content: "Send 'Lookbooks' to VIP clients by uploading their own photos to AstraStyle. A personalized render has 4x higher conversion than standard product shots.",
      icon: "✉️"
    },
    {
      title: "In-Store Digital Display",
      action: "Virtual Mirror",
      content: "Set up an iPad in your boutique. Let customers see how catalog items fit them instantly without using the fitting room. Saves time, increases sales velocity.",
      icon: "🏢"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <header>
        <h2 className="text-3xl font-bold text-white">Merchant Growth Strategy</h2>
        <p className="text-gray-400 mt-1">Professional blueprint for scaling your fashion business with AI.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {strategies.map((s, i) => (
          <div key={i} className="p-6 bg-gray-900/50 border border-gray-800 rounded-2xl hover:border-indigo-500/50 transition-all group">
            <div className="text-3xl mb-4">{s.icon}</div>
            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">{s.title}</h3>
            <span className="text-[10px] font-black uppercase text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded tracking-tighter mb-4 inline-block">
              {s.action}
            </span>
            <p className="text-sm text-gray-400 leading-relaxed mt-2">{s.content}</p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 p-8 rounded-3xl">
        <h3 className="text-2xl font-bold text-white mb-4">Marketing KPI Targets</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <p className="text-gray-400 text-xs uppercase font-bold tracking-widest mb-1">Cost Reduction</p>
            <p className="text-3xl font-black text-indigo-400">-85%</p>
            <p className="text-[10px] text-gray-500 mt-1">Photography Overhead</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase font-bold tracking-widest mb-1">Conversion Lift</p>
            <p className="text-3xl font-black text-green-400">+42%</p>
            <p className="text-[10px] text-gray-500 mt-1">Customer Confidence</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase font-bold tracking-widest mb-1">Time to Market</p>
            <p className="text-3xl font-black text-white">2 Min</p>
            <p className="text-[10px] text-gray-500 mt-1">Per Product Entry</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase font-bold tracking-widest mb-1">Asset Reuse</p>
            <p className="text-3xl font-black text-purple-400">10x</p>
            <p className="text-[10px] text-gray-500 mt-1">Multi-Channel Ready</p>
          </div>
        </div>
      </div>
    </div>
  );
};
