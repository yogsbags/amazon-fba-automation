
import React, { useState } from 'react';
import { generateViralHooks } from '../services/geminiService';
import { ViralHook } from '../types';

const ViralAgent: React.FC = () => {
  const [productName, setProductName] = useState('');
  const [features, setFeatures] = useState('');
  const [hooks, setHooks] = useState<ViralHook[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateHooks = async () => {
    if (!productName || !features) return;
    setIsLoading(true);
    try {
      const data = await generateViralHooks(productName, features);
      setHooks(data);
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
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Viral Traffic Agent</h1>
          <p className="text-slate-500 mt-1 font-medium italic">Drive high-velocity external traffic to spike your Amazon organic rank.</p>
        </div>
        <div className="px-4 py-2 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em]">
           External Accelerator: On
        </div>
      </header>

      <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Market Offering</label>
              <input 
                type="text" 
                className="w-full px-6 py-4 bg-slate-50 text-slate-900 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-semibold transition-all"
                placeholder="e.g. Ultrasonic Portable Cleaner"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
           </div>
           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Viral-Ready USP</label>
              <input 
                type="text" 
                className="w-full px-6 py-4 bg-slate-50 text-slate-900 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-semibold transition-all"
                placeholder="What makes people stop scrolling?"
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
              />
           </div>
        </div>
        <button 
          onClick={handleGenerateHooks}
          disabled={isLoading || !productName}
          className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-black disabled:bg-slate-50 disabled:text-slate-300 transition-all shadow-2xl shadow-slate-200"
        >
          {isLoading ? 'Sequencing Social Triggers...' : 'Generate Viral Script Package'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-100 space-y-6 animate-pulse">
               <div className="h-4 bg-slate-50 rounded w-1/2"></div>
               <div className="h-20 bg-slate-50 rounded"></div>
               <div className="space-y-2">
                 <div className="h-3 bg-slate-50 rounded"></div>
                 <div className="h-3 bg-slate-50 rounded"></div>
               </div>
            </div>
          ))
        ) : hooks.map((hook, i) => (
          <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500 flex flex-col group">
             <div className="flex justify-between items-start mb-8">
                <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest">{hook.platform}</span>
                <span className="text-2xl group-hover:scale-125 transition-transform duration-500">{hook.hookType === 'Problem/Solution' ? '🚨' : '✨'}</span>
             </div>
             
             <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{hook.hookType} Hook</h4>
             <div className="p-6 bg-slate-900 text-white rounded-[2rem] text-sm font-medium italic mb-8 relative">
                <div className="absolute top-2 left-2 text-indigo-500 text-4xl opacity-20">"</div>
                {hook.script}
             </div>

             <div className="space-y-4 flex-1">
                <h5 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Visual Directives</h5>
                <ul className="space-y-3">
                   {hook.visualDirections.map((dir, j) => (
                     <li key={j} className="text-xs font-bold text-slate-600 flex gap-2">
                       <span className="text-indigo-400">•</span> {dir}
                     </li>
                   ))}
                </ul>
             </div>

             <div className="mt-10 pt-6 border-t border-slate-50">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Recommended Audio Vibe</p>
                <p className="text-sm font-black text-slate-900">{hook.trendingAudioVibe}</p>
             </div>
          </div>
        ))}
      </div>
      
      {!hooks.length && !isLoading && (
        <div className="h-80 border-4 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center text-slate-300 bg-white/40 p-12 text-center">
          <div className="text-6xl mb-6 opacity-40 grayscale">📱</div>
          <h3 className="text-2xl font-black text-slate-400 mb-2 uppercase tracking-tighter">Viral Agent Standby</h3>
          <p className="text-sm font-medium max-w-sm mx-auto">Input your product to receive psychologically-primed scripts that legacy data tools cannot generate.</p>
        </div>
      )}
    </div>
  );
};

export default ViralAgent;
