
import React, { useState } from 'react';
import { snipeEarlyOpportunities } from '../services/geminiService';
import { EarlyPick } from '../types';

const TrendSniper: React.FC = () => {
  const [marketSeed, setMarketSeed] = useState('');
  const [picks, setPicks] = useState<EarlyPick[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSnipe = async () => {
    if (!marketSeed) return;
    setIsLoading(true);
    try {
      const data = await snipeEarlyOpportunities(marketSeed);
      setPicks(data);
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
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Neural Trend Sniper</h1>
          <p className="text-slate-500 mt-1 font-medium italic">Arbitrage emerging social momentum before the Amazon marketplace saturates.</p>
        </div>
        <div className="px-5 py-2.5 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-200">
           Real-Time Social Grounding: Active
        </div>
      </header>

      <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-8 items-end">
        <div className="flex-1 space-y-4">
           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Market Sector</label>
           <input 
             type="text" 
             className="w-full px-8 py-5 bg-slate-50 text-slate-900 border-none rounded-3xl outline-none focus:ring-2 focus:ring-indigo-500 font-semibold transition-all"
             placeholder="e.g. Pet Wellness, Sustainable Tech, Retro Gaming..."
             value={marketSeed}
             onChange={(e) => setMarketSeed(e.target.value)}
           />
        </div>
        <button 
          onClick={handleSnipe}
          disabled={isLoading || !marketSeed}
          className="px-12 py-5 bg-slate-900 text-white rounded-3xl font-black text-lg hover:bg-black transition-all shadow-2xl shadow-slate-200 active:scale-95"
        >
          {isLoading ? 'Scanning Omnichannel...' : 'Activate Sniper Radar'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-20">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-100 space-y-8 animate-pulse">
               <div className="h-6 bg-slate-50 rounded w-1/3"></div>
               <div className="h-40 bg-slate-50 rounded-3xl"></div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="h-10 bg-slate-50 rounded-xl"></div>
                  <div className="h-10 bg-slate-50 rounded-xl"></div>
               </div>
            </div>
          ))
        ) : picks.map((pick, i) => (
          <div key={i} className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-700 p-10 group overflow-hidden relative">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-3xl"></div>
             
             <div className="relative z-10 flex flex-col md:flex-row gap-10">
                <div className="flex-1 space-y-8">
                   <div className="flex justify-between items-start">
                      <div>
                         <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-100 mb-2 inline-block">
                           {pick.niche}
                         </span>
                         <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">{pick.productName}</h3>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Early Mover Index</p>
                         <p className="text-4xl font-black text-indigo-600">{pick.earlyMoverIndex}%</p>
                      </div>
                   </div>

                   <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 italic text-sm text-slate-600 leading-relaxed">
                      <span className="text-indigo-600 font-black uppercase text-[10px] tracking-widest block mb-1">Why It's Winning:</span>
                      "{pick.whyItsWinning}"
                   </div>

                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Alibaba Cost</p>
                         <p className="text-lg font-black text-slate-900">${pick.alibabaUnitCost}</p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Target Price</p>
                         <p className="text-lg font-black text-indigo-600">${pick.projectedAmzPrice}</p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Est. Profit</p>
                         <p className="text-lg font-black text-emerald-600">${pick.potentialProfit}</p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Saturation</p>
                         <p className="text-lg font-black text-slate-900">{pick.estimatedSaturationDate}</p>
                      </div>
                   </div>
                </div>

                <div className="md:w-48 flex flex-col gap-4">
                   <div className="flex-1 bg-slate-900 rounded-[2.5rem] p-6 flex flex-col items-center justify-center text-center group-hover:scale-105 transition-transform duration-500">
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Social Momentum</p>
                      <div className="relative w-20 h-20 flex items-center justify-center">
                         <svg className="w-full h-full transform -rotate-90">
                            <circle cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-800" />
                            <circle cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={220} strokeDashoffset={220 - (pick.socialMomentum / 100) * 220} className="text-indigo-500" strokeLinecap="round" />
                         </svg>
                         <span className="absolute text-white font-black text-xl">{pick.socialMomentum}%</span>
                      </div>
                   </div>
                   <a 
                     href={pick.alibabaLink} 
                     target="_blank" 
                     className="w-full py-4 bg-indigo-600 text-white rounded-3xl text-xs font-black uppercase tracking-widest text-center hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all"
                   >
                      Snipe Unit
                   </a>
                </div>
             </div>
          </div>
        ))}

        {!picks.length && !isLoading && (
          <div className="col-span-full h-96 border-4 border-dashed border-slate-100 rounded-[4rem] flex flex-col items-center justify-center text-slate-300 bg-white/40 p-12 text-center">
             <div className="text-8xl mb-6 opacity-30 grayscale">🔭</div>
             <h3 className="text-3xl font-black text-slate-400 mb-2 uppercase tracking-tighter italic">Sniper Offline</h3>
             <p className="text-sm font-medium max-w-sm mx-auto">Input a high-level market sector to discover the next $1M product *before* it becomes an Amazon bestseller.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendSniper;
