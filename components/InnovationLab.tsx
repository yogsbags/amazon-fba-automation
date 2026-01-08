
import React, { useState } from 'react';
import { analyzeSentimentArbitrage } from '../services/geminiService';
import { InnovationBlueprint } from '../types';

const InnovationLab: React.FC = () => {
  const [competitorName, setCompetitorName] = useState('');
  const [blueprint, setBlueprint] = useState<InnovationBlueprint | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDeepDive = async () => {
    if (!competitorName) return;
    setIsLoading(true);
    try {
      const data = await analyzeSentimentArbitrage(competitorName);
      setBlueprint(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Innovation Lab</h1>
          <p className="text-slate-500 mt-1 font-medium italic">Neural Sentiment Arbitrage: Disrupt competitors by fixing what they ignore.</p>
        </div>
        <div className="px-4 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em]">
           Secret Tier: Neural Advantage
        </div>
      </header>

      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-12 rounded-[3.5rem] shadow-2xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full"></div>
        
        <div className="relative z-10 space-y-8">
          <div className="max-w-2xl">
            <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Target Market Disruptor</h3>
            <p className="text-slate-400 font-medium">Identify a market leader or ASIN. We will scan all public sentiment (reviews, Reddit, TikTok) to find the "Disruption Window."</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <input 
              type="text" 
              className="flex-1 px-8 py-5 bg-white/5 text-white border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-semibold placeholder:text-slate-600 transition-all"
              placeholder="e.g. HydroFlask, Oura Ring, or specific ASIN..."
              value={competitorName}
              onChange={(e) => setCompetitorName(e.target.value)}
            />
            <button 
              onClick={handleDeepDive}
              disabled={isLoading || !competitorName}
              className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 disabled:bg-white/5 disabled:text-slate-600 transition-all shadow-2xl shadow-indigo-500/20 active:scale-95"
            >
              {isLoading ? 'Neural Analysis Active...' : 'Begin Disruption Map'}
            </button>
          </div>
        </div>
      </div>

      {blueprint && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-10">
               <div className="flex justify-between items-start border-b border-slate-50 pb-8">
                  <div>
                    <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-2">Product v2.0 Identity</h4>
                    <h5 className="text-3xl font-black text-slate-900 tracking-tight">{blueprint.v2ProductName}</h5>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Market disruption index</p>
                    <p className="text-4xl font-black text-indigo-600">{blueprint.estimatedMarketShareGain}%</p>
                  </div>
               </div>

               <div className="space-y-6">
                  <h6 className="text-sm font-black text-slate-900 uppercase tracking-widest">Sentiment Gaps Identified</h6>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {blueprint.sentimentGaps.map((gap, i) => (
                       <div key={i} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-indigo-200 transition-colors">
                          <p className="text-xs font-black text-red-500 uppercase tracking-widest mb-3 flex justify-between">
                            Compliant Gap #{i+1}
                            <span className="text-slate-400">{gap.frequency}</span>
                          </p>
                          <p className="text-slate-900 font-bold mb-4 italic leading-relaxed">"{gap.complaint}"</p>
                          <div className="pt-4 border-t border-slate-200/50">
                             <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Astra V2 Fix</p>
                             <p className="text-xs font-semibold text-slate-600 leading-relaxed">{gap.proposedFix}</p>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
             <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
                <h4 className="text-xl font-black text-slate-900 tracking-tight">Design Directives</h4>
                <ul className="space-y-4">
                   {blueprint.designDirectives.map((dir, i) => (
                     <li key={i} className="flex gap-4 items-start">
                        <span className="shrink-0 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black">{i+1}</span>
                        <p className="text-sm font-bold text-slate-600 leading-relaxed">{dir}</p>
                     </li>
                   ))}
                </ul>
                <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100">
                   <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                     <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z" clipRule="evenodd" /></svg>
                     Strategic Advantage
                   </p>
                   <p className="text-xs font-semibold text-amber-700 leading-relaxed">Launching with these features allows you to target "Dissatisfied Customers" of {blueprint.targetCompetitor} via aggressive PPC targeting on their own brand keywords.</p>
                </div>
                <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-black transition-all">
                  Generate 3D Visual Brief
                </button>
             </div>
          </div>
        </div>
      )}

      {!blueprint && !isLoading && (
        <div className="h-96 border-4 border-dashed border-slate-100 rounded-[3.5rem] flex flex-col items-center justify-center text-slate-300 bg-white/40 p-12 text-center">
          <div className="text-7xl mb-6 opacity-40 grayscale">🧬</div>
          <h3 className="text-2xl font-black text-slate-400 mb-2 uppercase tracking-tighter">Arbitrage Engine Offline</h3>
          <p className="text-sm font-medium max-w-sm mx-auto italic">Enter a market leader to find product-market fit gaps that competitors have left wide open.</p>
        </div>
      )}
    </div>
  );
};

export default InnovationLab;
