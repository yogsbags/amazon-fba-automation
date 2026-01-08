
import React, { useState, useEffect } from 'react';
import { analyzeMarketPPC } from '../services/geminiService';
import { PPCMetric } from '../types';

const PPCOptimizer: React.FC = () => {
  const [category, setCategory] = useState('');
  const [keywords, setKeywords] = useState<PPCMetric[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOptimization = async () => {
    if (!category) return;
    setIsLoading(true);
    try {
      const data = await analyzeMarketPPC(category);
      setKeywords(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: PPCMetric['status']) => {
    switch (status) {
      case 'optimized':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            Optimized
          </span>
        );
      case 'attention':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            Attention
          </span>
        );
      case 'adjusting':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Adjusting
          </span>
        );
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">AI PPC Optimizer</h1>
        <p className="text-slate-500">Intelligent ROAS management powered by market search volume data.</p>
      </header>

      <div className="bg-indigo-600 rounded-3xl p-8 mb-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">Auto-Pilot Active</h2>
          <p className="text-indigo-100 max-w-md mb-6 text-sm">Astra AI is currently analyzing 2,403 search terms for your active campaigns. Targeted ROAS: 4.5x</p>
          <div className="flex gap-4">
             <input 
              type="text" 
              className="bg-white text-slate-900 border border-transparent rounded-xl px-4 py-2 placeholder-slate-400 focus:ring-2 focus:ring-white outline-none transition-all w-64"
              placeholder="Search category (e.g. Yoga Mats)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <button 
              onClick={fetchOptimization}
              className="px-6 py-2 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg"
            >
              Analyze Market
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
          <div className="text-9xl">🤖</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Keyword</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Search Volume</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Current Bid</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">AI Recommended</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Est. ROAS</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    Analysing market bids and performance...
                  </div>
                </td>
              </tr>
            ) : keywords.length > 0 ? (
              keywords.map((kw, i) => (
                <tr key={i} className={`hover:bg-gray-50 transition-colors ${kw.status === 'attention' ? 'bg-red-50/30' : ''}`}>
                  <td className="px-6 py-4">{getStatusBadge(kw.status)}</td>
                  <td className="px-6 py-4 font-semibold text-slate-700">{kw.keyword}</td>
                  <td className="px-6 py-4 text-center text-slate-600">{kw.searchVolume.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center text-slate-600">${kw.currentBid.toFixed(2)}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded-lg font-bold text-sm ${kw.status === 'attention' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                      ${kw.recommendedBid.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-bold">
                    <span className={kw.roas > 4 ? 'text-green-600' : kw.roas < 2.5 ? 'text-red-600' : 'text-indigo-600'}>
                      {kw.roas.toFixed(1)}x
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className={`font-bold hover:underline ${kw.status === 'attention' ? 'text-red-600' : 'text-indigo-600'}`}>
                      {kw.status === 'attention' ? 'Urgent Fix' : 'Apply'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                  No keyword data available. Use the search bar above to fetch market analysis.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PPCOptimizer;
