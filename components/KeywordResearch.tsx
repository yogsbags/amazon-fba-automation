
import React, { useState } from 'react';
import { researchKeywords } from '../services/geminiService';
import { KeywordResearchResult } from '../types';

const KeywordResearch: React.FC = () => {
  const [seed, setSeed] = useState('');
  const [results, setResults] = useState<KeywordResearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('All');

  const handleSearch = async () => {
    if (!seed) return;
    setIsLoading(true);
    try {
      const data = await researchKeywords(seed);
      setResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredResults = results.filter(r => filter === 'All' || r.relevance === filter);

  const handleExport = () => {
    const csv = [
      ['Keyword', 'Amazon Volume', 'Google Volume', 'CPC', 'Relevance', 'Trend'],
      ...filteredResults.map(r => [r.keyword, r.volume, r.googleVolume, r.cpc, r.relevance, r.trend])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `demand_intel_${seed}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Omnichannel Demand Intel</h1>
          <p className="text-slate-500 mt-1 font-medium">Cross-referencing Amazon volumes with real-time Google search trends.</p>
        </div>
      </header>

      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 space-y-8">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Market Seed</label>
            <input 
              type="text" 
              className="w-full px-6 py-4 bg-slate-50 text-slate-900 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-300 font-semibold"
              placeholder="e.g. Ergonomic Office Supplies"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
            />
          </div>
          <button 
            onClick={handleSearch}
            disabled={isLoading || !seed}
            className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 shadow-2xl shadow-indigo-200 transition-all h-fit"
          >
            {isLoading ? 'Scanning Omnichannel...' : 'Fetch Multi-Point Demand'}
          </button>
        </div>

        {results.length > 0 && (
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-6 border-t border-slate-50">
            <div className="flex flex-wrap gap-2">
               {['All', 'High', 'Medium', 'Low'].map(f => (
                 <button 
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                 >
                   {f} Relevance
                 </button>
               ))}
            </div>
            <button 
              onClick={handleExport}
              className="px-6 py-2 border-2 border-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-indigo-600 hover:text-indigo-600 transition-all"
            >
              📥 Export Neural Report
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Market Keyword</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">AMZN Volume</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Google Volume</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Market Momentum</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Est. CPC</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                       <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                       <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Synchronizing Neural Indices...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredResults.length > 0 ? (
                filteredResults.map((kw, i) => (
                  <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6">
                       <p className="font-black text-slate-900 tracking-tight">{kw.keyword}</p>
                       <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${kw.relevance === 'High' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                         {kw.relevance} Relevance
                       </span>
                    </td>
                    <td className="px-8 py-6 text-center font-bold text-slate-700">{kw.volume.toLocaleString()}</td>
                    <td className="px-8 py-6 text-center font-bold text-indigo-600">{kw.googleVolume.toLocaleString()}</td>
                    <td className="px-8 py-6 text-center">
                      <div className={`flex items-center justify-center gap-2 text-[10px] font-black uppercase ${kw.trend === 'up' ? 'text-emerald-500' : kw.trend === 'down' ? 'text-red-500' : 'text-slate-400'}`}>
                         {kw.trend === 'up' && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>}
                         {kw.trend === 'down' && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>}
                         {kw.trend}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <span className="text-sm font-black text-slate-900">${kw.cpc.toFixed(2)}</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Track Index</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-8 py-32 text-center text-slate-400 bg-white/40">
                    <div className="max-w-sm mx-auto space-y-4">
                       <div className="text-5xl opacity-30">🔍</div>
                       <p className="font-black text-slate-800 text-lg uppercase tracking-tight">Demand Intelligence Offline</p>
                       <p className="text-sm font-medium">Search for a product category to see the unified demand map.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default KeywordResearch;
