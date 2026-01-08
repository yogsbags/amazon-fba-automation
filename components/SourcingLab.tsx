
import React, { useState } from 'react';
import { researchSourcingOptions } from '../services/geminiService';
import { SourcingRecommendation } from '../types';

const SourcingLab: React.FC = () => {
  const [productName, setProductName] = useState('');
  const [recommendations, setRecommendations] = useState<SourcingRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleResearch = async () => {
    if (!productName) return;
    setIsLoading(true);
    try {
      const data = await researchSourcingOptions(productName);
      setRecommendations(data);
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
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">AI Sourcing Lab</h1>
          <p className="text-slate-500 mt-1 font-medium">Neural Alibaba connector for high-margin product procurement.</p>
        </div>
      </header>

      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-end">
          <div className="lg:col-span-3 space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Market Opportunity</label>
            <input 
              type="text" 
              className="w-full px-6 py-4 bg-slate-50 text-slate-900 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-300 font-semibold"
              placeholder="e.g. Ergonomic Standing Desk"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>
          <button 
            onClick={handleResearch}
            disabled={isLoading || !productName}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 shadow-2xl shadow-indigo-200 transition-all active:scale-95"
          >
            {isLoading ? 'Scanning Alibaba...' : 'Calculate Profit Matrix'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 space-y-6 animate-pulse">
               <div className="w-full h-40 bg-slate-50 rounded-2xl"></div>
               <div className="space-y-3">
                 <div className="h-4 bg-slate-50 rounded w-3/4"></div>
                 <div className="h-3 bg-slate-50 rounded w-1/2"></div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="h-10 bg-slate-50 rounded-xl"></div>
                 <div className="h-10 bg-slate-50 rounded-xl"></div>
               </div>
            </div>
          ))
        ) : recommendations.length > 0 ? (
          recommendations.map((rec, i) => (
            <div key={i} className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 p-8 flex flex-col justify-between">
               <div>
                 <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🏭</div>
                    {rec.verified && (
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100">Verified</span>
                    )}
                 </div>
                 <h3 className="text-lg font-black text-slate-900 tracking-tight leading-tight mb-1">{rec.supplierName}</h3>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mb-6">{rec.productName}</p>
                 
                 <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-sm">
                       <span className="text-slate-400 font-medium">Unit Cost</span>
                       <span className="font-black text-slate-900">${rec.unitCost}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                       <span className="text-slate-400 font-medium">Retail (AMZN)</span>
                       <span className="font-black text-indigo-600">${rec.amazonPrice}</span>
                    </div>
                    <div className="flex justify-between text-sm p-3 bg-indigo-50/50 rounded-xl border border-indigo-50">
                       <span className="text-indigo-600 font-black text-[10px] uppercase tracking-widest">Est. Margin</span>
                       <span className="font-black text-indigo-700">{rec.estimatedMargin.toFixed(1)}%</span>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="p-3 bg-slate-50 rounded-xl text-center">
                       <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">MOQ</p>
                       <p className="text-sm font-black text-slate-700">{rec.moq}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl text-center">
                       <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Lead Time</p>
                       <p className="text-sm font-black text-slate-700">{rec.leadTime}</p>
                    </div>
                 </div>
               </div>

               <a 
                 href={rec.alibabaUrl} 
                 target="_blank" 
                 className="w-full py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest text-center hover:bg-black transition-colors"
               >
                 Contact Supplier
               </a>
            </div>
          ))
        ) : (
          <div className="col-span-full h-80 border-4 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center text-slate-300 bg-white/40 p-12 text-center">
            <div className="text-6xl mb-6 opacity-40">🛳️</div>
            <h3 className="text-2xl font-black text-slate-400 mb-2 uppercase tracking-tighter">Procurement Engine Ready</h3>
            <p className="text-sm font-medium max-w-sm mx-auto">Input your product category to find profitable sourcing opportunities on Alibaba.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SourcingLab;
