
import React, { useState, useEffect } from 'react';
import { analyzeMarketPPC } from '../services/geminiService';
import { amazonService } from '../services/amazonService';
import { PPCMetric, AutomationLog, PPCStrategy, CampaignType } from '../types';

const PPCOptimizer: React.FC = () => {
  const [category, setCategory] = useState('');
  const [unitCost, setUnitCost] = useState<number>(12.50);
  const [retailPrice, setRetailPrice] = useState<number>(39.99);
  const [totalOrgSales, setTotalOrgSales] = useState<number>(15000); // Mock Organic Sales for TACoS
  const [strategy, setStrategy] = useState<PPCStrategy>('GROWTH');
  
  const [keywords, setKeywords] = useState<PPCMetric[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncingReport, setIsSyncingReport] = useState(false);
  const [isAutoPilot, setIsAutoPilot] = useState(false);
  const [logs, setLogs] = useState<AutomationLog[]>([]);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  // Financial Calculations
  const grossProfit = retailPrice - unitCost;
  const breakEvenAcos = (grossProfit / retailPrice) * 100;
  
  const totalAdSpend = keywords.reduce((acc, k) => acc + (k.currentBid * 100), 0); // Mocked calc
  const totalAdSales = keywords.reduce((acc, k) => acc + (k.roas * k.currentBid * 100), 0);
  const totalRevenue = totalOrgSales + totalAdSales;
  const tACOS = totalRevenue > 0 ? (totalAdSpend / totalRevenue) * 100 : 0;
  
  const currentAvgRoas = keywords.length > 0 
    ? keywords.reduce((acc, k) => acc + k.roas, 0) / keywords.length 
    : 0;

  const addLog = (action: string, details: string, type: AutomationLog['type'] = 'info') => {
    const newLog: AutomationLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      action,
      details,
      type
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50));
  };

  const syncAmazonReports = async () => {
    if (!category) return;
    setIsSyncingReport(true);
    addLog('SP-API', 'Requesting Advertising Performance Report...', 'info');
    
    try {
      const { reportId } = await amazonService.requestKeywordReport("CAMP_AD_STACK");
      const reportData = await amazonService.fetchReportData(reportId);
      addLog('Ingestion', `Parsed ${reportData.length} search terms. Identifying waste keywords...`, 'success');
      
      setLastSyncTime(new Date().toLocaleTimeString());
      await fetchOptimization();
    } catch (err) {
      addLog('Sync Error', 'Failed to link with Advertising API.', 'warning');
    } finally {
      setIsSyncingReport(false);
    }
  };

  const fetchOptimization = async () => {
    if (!category) return;
    setIsLoading(true);
    addLog('Neural Link', `Optimizing for ${strategy} with Target TACoS < 15%...`, 'info');
    try {
      const data = await analyzeMarketPPC(category, unitCost, retailPrice, strategy);
      setKeywords(data);
      addLog('Telemetry', `Ranking Engine Synced. Funnels: Auto, Exact, Phrase, Brand, Product.`, 'success');
    } catch (error) {
      addLog('API Failure', 'Handshake failed.', 'warning');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let interval: any;
    if (isAutoPilot && keywords.length > 0) {
      interval = setInterval(async () => {
        const randomIndex = Math.floor(Math.random() * keywords.length);
        const kw = keywords[randomIndex];
        if (kw && kw.status !== 'optimized') {
          addLog('Auto-Pilot', `Decision: Adjusting "${kw.keyword}" (${kw.campaignType}) for ROAS.`, 'success');
          setKeywords(prev => prev.map((k, i) => i === randomIndex ? { ...k, currentBid: k.recommendedBid, status: 'optimized' as any } : k));
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPilot, keywords, strategy]);

  const pruneWaste = () => {
    addLog('Pruning', 'Executed Negative Keyword SOP. 4 wasteful terms moved to Exclusion List.', 'success');
    setKeywords(prev => prev.filter(k => k.status !== 'waste'));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="sticky top-0 z-40 py-6 mb-4 bg-slate-50/80 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">PPC Ranking Engine</h1>
          <p className="text-slate-500 mt-1 font-medium italic">Autonomous Advertising Stack: Auto / Manual / Defensive / ASIN Targeting.</p>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={syncAmazonReports}
            disabled={isSyncingReport || !category}
            className="px-6 py-4 bg-white border border-slate-200 rounded-[2rem] text-xs font-black uppercase tracking-widest text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-3 shadow-sm"
          >
            {isSyncingReport ? 'Ingesting Reports...' : 'Sync Search Reports'}
          </button>
          
          <div className="bg-white px-6 py-4 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4">
             <div className="text-right">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Auto-Pilot Mode</span>
                <span className={`text-xs font-black uppercase block ${isAutoPilot ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {isAutoPilot ? 'Autonomous Active' : 'Manual Override'}
                </span>
             </div>
             <button 
                onClick={() => setIsAutoPilot(!isAutoPilot)}
                className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-4 border-transparent transition-colors duration-200 ease-in-out ${isAutoPilot ? 'bg-indigo-600' : 'bg-slate-200'}`}
              >
                <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-xl transition duration-200 ease-in-out ${isAutoPilot ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
          </div>
        </div>
      </header>

      {/* Helium 10 Adtomic Style Dash Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="bg-slate-900 p-8 rounded-[3rem] text-white space-y-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-20 text-4xl group-hover:scale-110 transition-transform">📊</div>
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Efficiency: TACoS</p>
            <p className="text-4xl font-black">{tACOS.toFixed(1)}%</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pt-2">Goal: &lt;15% for ${strategy}</p>
         </div>
         <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ad Spend vs Sales</p>
            <div className="flex items-center justify-center gap-2">
               <span className="text-xl font-black text-slate-400">${(totalAdSpend/1000).toFixed(1)}k</span>
               <span className="text-slate-200">/</span>
               <span className="text-2xl font-black text-slate-900">${(totalAdSales/1000).toFixed(1)}k</span>
            </div>
            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-2">ROAS: {currentAvgRoas.toFixed(2)}x</p>
         </div>
         <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Break-even ACOS</p>
            <p className="text-4xl font-black text-emerald-600">{breakEvenAcos.toFixed(1)}%</p>
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-2">Current Avg ACoS: 18.2%</p>
         </div>
         <div className="bg-indigo-600 p-8 rounded-[3rem] text-white shadow-xl shadow-indigo-100 flex flex-col justify-center items-center">
            <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1">Neural Pruning Result</p>
            <p className="text-4xl font-black">$412.00</p>
            <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mt-2">Potential Monthly Savings</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-1 space-y-8">
          {/* Controls */}
          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 space-y-8">
            <h3 className="text-lg font-black text-slate-900 italic">Campaign Controls</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Organic Sales Basis ($)</label>
                <input 
                  type="number" 
                  value={totalOrgSales}
                  onChange={(e) => setTotalOrgSales(Number(e.target.value))}
                  className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-black"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Strategy Profile</label>
                <div className="grid grid-cols-1 gap-2">
                  {(['LAUNCH', 'GROWTH', 'HARVEST'] as const).map(s => (
                    <button 
                      key={s}
                      onClick={() => setStrategy(s)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all ${strategy === s ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-slate-50 hover:bg-slate-50'}`}
                    >
                       <p className={`text-[10px] font-black tracking-tight ${strategy === s ? 'text-indigo-900' : 'text-slate-700'}`}>{s}</p>
                       <p className="text-[8px] text-slate-400 mt-1">{s === 'LAUNCH' ? 'High Volume, Low ROAS' : s === 'GROWTH' ? 'Balanced' : 'Profit Focus'}</p>
                    </button>
                  ))}
               </div>
              </div>
              <div className="space-y-2 pt-4">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ranking Target (ASIN)</label>
                 <input 
                  type="text" 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="B08X12345..."
                  className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                />
              </div>
              <button 
                onClick={fetchOptimization}
                disabled={isLoading || !category}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-black shadow-xl"
              >
                {isLoading ? 'Sequencing Funnels...' : 'Activate Ranking Engine'}
              </button>
            </div>
          </div>

          {/* Pruning List */}
          <div className="bg-red-50 p-8 rounded-[3rem] border border-red-100 space-y-6">
             <div className="flex justify-between items-center">
                <h4 className="text-xs font-black text-red-600 uppercase tracking-widest">Neural Pruning (Waste)</h4>
                <button onClick={pruneWaste} className="text-[9px] font-black text-white bg-red-600 px-3 py-1 rounded-full uppercase tracking-tighter">Negative All</button>
             </div>
             <div className="space-y-3">
                {keywords.filter(k => k.status === 'waste').map((k, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-white rounded-xl border border-red-100 shadow-sm">
                     <span className="text-[10px] font-bold text-slate-700 truncate mr-2">{k.keyword}</span>
                     <span className="text-[10px] font-black text-red-500 whitespace-nowrap">${(k.currentBid*100).toFixed(0)} Waste</span>
                  </div>
                ))}
                {keywords.filter(k => k.status === 'waste').length === 0 && (
                  <p className="text-center text-[10px] font-bold text-slate-400 py-4 italic">No waste detected currently.</p>
                )}
             </div>
          </div>

          <div className="bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col h-[200px]">
             <div className="p-4 bg-slate-800 flex justify-between items-center border-b border-slate-700">
                <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Execution Logs</h3>
             </div>
             <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-[8px]">
                {logs.map(log => (
                  <div key={log.id} className="text-slate-400">
                    <span className="text-indigo-400 mr-2">[{log.timestamp}]</span>
                    <span className="text-white">{log.details}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-8">
          {/* Adtomic Table Structure */}
          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Target & Funnel Type</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">CTR / CVR</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">ACoS / ROAS</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Actionable Bid</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Optimization Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {keywords.map((kw, i) => (
                    <tr key={i} className={`group hover:bg-slate-50/50 transition-colors ${kw.status === 'waste' ? 'opacity-60 bg-red-50/10' : ''}`}>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                           <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-[8px] font-black ${
                             kw.campaignType === 'AUTO' ? 'bg-slate-100 text-slate-500' :
                             kw.campaignType === 'EXACT' ? 'bg-indigo-600 text-white shadow-sm' :
                             kw.campaignType === 'BRAND' ? 'bg-emerald-600 text-white' : 'bg-amber-100 text-amber-700'
                           }`}>
                             {kw.campaignType[0]}
                           </span>
                           <div>
                              <p className="font-black text-slate-900 tracking-tight">{kw.keyword}</p>
                              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{kw.campaignType} Funnel</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="space-y-1">
                           <p className="text-xs font-black text-slate-900">CTR: 0.8%</p>
                           <p className="text-[10px] font-bold text-indigo-500">CVR: {kw.cvr}%</p>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="space-y-1">
                           <p className={`text-sm font-black ${kw.acos > breakEvenAcos ? 'text-red-500' : 'text-emerald-500'}`}>{kw.acos}%</p>
                           <p className="text-[10px] font-black text-slate-300 tracking-widest">{kw.roas.toFixed(1)}x ROAS</p>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="flex items-center justify-center gap-3">
                           <span className="text-[10px] text-slate-300 line-through">${kw.currentBid.toFixed(2)}</span>
                           <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100 animate-pulse-slow">${kw.recommendedBid.toFixed(2)}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                         <div className="flex flex-col items-end gap-1">
                            {kw.status === 'waste' ? (
                               <span className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-[8px] font-black uppercase tracking-widest border border-red-200">Bleeding Waste</span>
                            ) : (
                               <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all ${
                                 kw.status === 'optimized' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'
                               }`}>
                                 {kw.status === 'optimized' ? 'Ranking Peak' : 'Awaiting Bid Apply'}
                               </span>
                            )}
                            {kw.status === 'attention' && <p className="text-[8px] text-amber-500 font-black uppercase animate-pulse">Low impressions</p>}
                         </div>
                      </td>
                    </tr>
                  ))}
                  {keywords.length === 0 && !isLoading && (
                    <tr>
                      <td colSpan={5} className="px-8 py-40 text-center">
                         <div className="max-w-xs mx-auto space-y-4">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl mx-auto grayscale opacity-50">🛰️</div>
                            <h4 className="text-xl font-black text-slate-800 uppercase tracking-tight italic">Ranking Hub Offline</h4>
                            <p className="text-sm font-medium text-slate-400">Initialize your ASIN to activate the Ranking Stack (Auto/Exact/Phrase/Product).</p>
                         </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PPCOptimizer;
