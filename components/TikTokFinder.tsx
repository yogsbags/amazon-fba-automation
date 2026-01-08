
import React, { useState } from 'react';
import { findTrendingTikTokProducts } from '../services/geminiService';
import { TikTokProduct } from '../types';

const TikTokFinder: React.FC = () => {
  const [category, setCategory] = useState('');
  const [products, setProducts] = useState<TikTokProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleSearch = async () => {
    if (!category) return;
    setIsLoading(true);
    setStatus('Scanning TikTok Hashtag Telemetry...');
    try {
      const data = await findTrendingTikTokProducts(category);
      setProducts(data);
      setStatus(`Analyzed ${data.length} viral signals.`);
    } catch (err) {
      console.error(err);
      setStatus('Search failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">TikTok Product Finder</h1>
          <p className="text-slate-500 mt-1 font-medium italic">Scraping social momentum to find the next viral Amazon hit.</p>
        </div>
        {status && (
          <div className="flex items-center gap-3 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
            {status}
          </div>
        )}
      </header>

      <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-8 items-end">
        <div className="flex-1 space-y-4">
           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Trend Category</label>
           <input 
             type="text" 
             className="w-full px-8 py-5 bg-slate-50 text-slate-900 border-none rounded-3xl outline-none focus:ring-2 focus:ring-indigo-500 font-semibold transition-all"
             placeholder="e.g. Home Decor, Skincare, Car Gadgets..."
             value={category}
             onChange={(e) => setCategory(e.target.value)}
           />
        </div>
        <button 
          onClick={handleSearch}
          disabled={isLoading || !category}
          className="px-12 py-5 bg-slate-900 text-white rounded-3xl font-black text-lg hover:bg-black transition-all shadow-2xl shadow-slate-200 active:scale-95"
        >
          {isLoading ? 'Scanning FYP Trends...' : 'Hunt Viral Products'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white p-10 rounded-[4rem] border border-slate-100 space-y-6 animate-pulse">
               <div className="h-6 bg-slate-50 rounded w-1/3"></div>
               <div className="h-24 bg-slate-50 rounded-2xl"></div>
               <div className="h-10 bg-slate-50 rounded-xl"></div>
            </div>
          ))
        ) : products.map((prod, i) => (
          <div key={i} className="bg-white p-10 rounded-[4rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-700 flex flex-col md:flex-row gap-10 group overflow-hidden relative">
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-3xl"></div>
             
             <div className="flex-1 space-y-6 relative z-10">
                <div className="flex justify-between items-start">
                   <div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">{prod.name}</h3>
                      <div className="flex flex-wrap gap-2 mt-3">
                         {prod.hashtags.map((tag, j) => (
                           <span key={j} className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">#{tag}</span>
                         ))}
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Viral Potential</p>
                      <p className="text-4xl font-black text-indigo-600">{prod.viralScore}%</p>
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">The Trend Reason</p>
                      <p className="text-xs font-semibold text-slate-600 leading-relaxed italic">"{prod.reason}"</p>
                   </div>
                   <div className="p-5 bg-indigo-900 text-white rounded-2xl">
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Ad Strategy</p>
                      <p className="text-xs font-medium leading-relaxed">{prod.adOpportunity}</p>
                   </div>
                </div>
             </div>

             <div className="md:w-32 flex flex-col justify-between items-center relative z-10">
                <div className="w-24 h-24 bg-slate-900 rounded-3xl flex flex-col items-center justify-center text-center shadow-xl group-hover:scale-110 transition-transform">
                   <p className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Views</p>
                   <p className="text-xl font-black text-white">{prod.viewCount}</p>
                </div>
                <button className="w-full py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all mt-6">
                   Snipe Niche
                </button>
             </div>
          </div>
        ))}

        {!products.length && !isLoading && (
          <div className="col-span-full h-96 border-4 border-dashed border-slate-100 rounded-[4rem] flex flex-col items-center justify-center text-slate-300 bg-white/40 p-12 text-center">
             <div className="text-8xl mb-6 opacity-30 grayscale">🔍🎵</div>
             <h3 className="text-3xl font-black text-slate-400 mb-2 uppercase tracking-tighter italic">Niche Hunter Standby</h3>
             <p className="text-sm font-medium max-w-sm mx-auto">Input a category to begin scraping TikTok for trending products and viral hashtag momentum.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TikTokFinder;
