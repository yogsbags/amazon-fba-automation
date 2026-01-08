
import React, { useState } from 'react';
import { generatePackagingSuite, generateProductImage } from '../services/geminiService';
import { PackagingAsset, MARKETPLACES, Marketplace } from '../types';

const PackagingStudio: React.FC = () => {
  const [brandName, setBrandName] = useState('');
  const [productName, setProductName] = useState('');
  const [specs, setSpecs] = useState('');
  const [selectedMarket, setSelectedMarket] = useState<Marketplace>(MARKETPLACES[0]);
  const [assets, setAssets] = useState<PackagingAsset[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState('');

  const handleArchitectPackaging = async () => {
    if (!brandName || !productName) return;
    setIsGenerating(true);
    setStatus('Architecting physical blueprint neural path...');
    try {
      const suite = await generatePackagingSuite(productName, specs, brandName, selectedMarket.lang);
      setAssets(suite);

      setStatus('Synthesizing high-res collateral visuals...');
      const updatedAssets = [...suite];
      for (let i = 0; i < suite.length; i++) {
        setStatus(`Rendering ${suite[i].type}: ${suite[i].title}...`);
        const ar = suite[i].type === 'Outer Box' ? '4:3' : '1:1';
        const img = await generateProductImage(suite[i].imagePrompt, ar, 'Modern', 'Professional', selectedMarket.lang);
        if (img) updatedAssets[i].imageUrl = img;
        setAssets([...updatedAssets]);
      }
      
      setStatus('Physical Logistics Package Ready.');
    } catch (err) {
      console.error(err);
      setStatus('Packaging pipeline interrupted.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Packaging & Insert Studio</h1>
          <p className="text-slate-500 mt-1 font-medium italic">Autonomous Industrial Design & Post-Purchase Optimization.</p>
        </div>
        {status && (
          <div className="flex items-center gap-3 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
            {status}
          </div>
        )}
      </header>

      {/* Checklist-driven inputs */}
      <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
           <div className="lg:col-span-3 space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Brand & Marketplace</label>
              <div className="flex gap-4">
                 <input 
                   type="text" 
                   className="flex-1 px-6 py-4 bg-slate-50 text-slate-900 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                   placeholder="e.g. Astra Home"
                   value={brandName}
                   onChange={(e) => setBrandName(e.target.value)}
                 />
                 <select 
                   value={selectedMarket.id}
                   onChange={(e) => setSelectedMarket(MARKETPLACES.find(m => m.id === e.target.value) || MARKETPLACES[0])}
                   className="px-4 py-4 bg-slate-50 border-none rounded-2xl font-black text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                 >
                   {MARKETPLACES.map(m => <option key={m.id} value={m.id}>{m.flag}</option>)}
                 </select>
              </div>
           </div>
           <div className="lg:col-span-4 space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Title</label>
              <input 
                type="text" 
                className="w-full px-8 py-4 bg-slate-50 text-slate-900 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                placeholder="e.g. Ultrasonic Humidifier V2"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
           </div>
           <div className="lg:col-span-3 space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Box Dimensions / Specs</label>
              <input 
                type="text" 
                className="w-full px-8 py-4 bg-slate-50 text-slate-900 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                placeholder="e.g. 200x150x100mm, BPA Free"
                value={specs}
                onChange={(e) => setSpecs(e.target.value)}
              />
           </div>
           <div className="lg:col-span-2">
              <button 
                onClick={handleArchitectPackaging}
                disabled={isGenerating || !brandName}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 active:scale-95"
              >
                {isGenerating ? 'Synthesizing...' : 'Architect Studio'}
              </button>
           </div>
        </div>
        
        <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-50">
           <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
              FBA Fee Optimized
           </div>
           <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
              TOS-Compliant Review Logic
           </div>
           <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
              Support Routing Enabled
           </div>
        </div>
      </div>

      <div className="space-y-12">
        {assets.map((asset, i) => (
          <div key={i} className="bg-white rounded-[3.5rem] overflow-hidden border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-8 duration-700">
             <div className="p-8 border-b bg-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                   <div className="flex items-center gap-3 mb-1">
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                         {asset.type}
                      </span>
                      {asset.fbaFeeTier !== 'N/A' && (
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                          asset.fbaFeeTier === 'Small Standard' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          Logistics: {asset.fbaFeeTier}
                        </span>
                      )}
                   </div>
                   <h3 className="text-2xl font-black text-slate-900 tracking-tight">{asset.title}</h3>
                </div>
                <div className="flex gap-2">
                   <button className="px-4 py-2 bg-white text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200 hover:bg-slate-50 transition-all">Download PDF</button>
                   <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg">Push to Factory</button>
                </div>
             </div>
             
             <div className={`p-10 flex flex-col lg:flex-row gap-10 items-start ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                <div className="lg:w-1/2 space-y-6">
                   <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Primary Benefit / Purpose</p>
                        <p className="text-xl text-slate-900 font-black leading-tight italic">"{asset.primaryBenefitStatement}"</p>
                      </div>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed italic">"{asset.description}"</p>
                   </div>
                   
                   {asset.type === 'Insert Card' && asset.insertFeatures && (
                     <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-6 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                           <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400">Insert Feature Audit (7-Points)</h4>
                           <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[8px] font-black rounded uppercase tracking-widest border border-emerald-500/20">TOS Compliant</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-4">
                              <div className="flex items-start gap-3">
                                 <div className="w-8 h-8 rounded-xl bg-indigo-600/20 flex items-center justify-center text-xs text-indigo-400 border border-indigo-500/30">🙏</div>
                                 <div>
                                    <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Thank You (Human Touch)</p>
                                    <p className="text-[11px] font-bold text-slate-300 leading-tight">"{asset.insertFeatures.thankYouText}"</p>
                                 </div>
                              </div>
                              <div className="flex items-start gap-3">
                                 <div className="w-8 h-8 rounded-xl bg-emerald-600/20 flex items-center justify-center text-xs text-emerald-400 border border-emerald-500/30">📜</div>
                                 <div>
                                    <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Clear Instructions</p>
                                    <p className="text-[11px] font-bold text-slate-300 leading-tight">"{asset.insertFeatures.usageInstructionsSnippet}"</p>
                                 </div>
                              </div>
                              <div className="flex items-start gap-3">
                                 <div className="w-8 h-8 rounded-xl bg-amber-600/20 flex items-center justify-center text-xs text-amber-400 border border-amber-500/30">📞</div>
                                 <div>
                                    <p className="text-[9px] font-black text-amber-400 uppercase tracking-widest">Support (Prevent Returns)</p>
                                    <p className="text-[11px] font-bold text-slate-300 leading-tight">"{asset.insertFeatures.supportRouting}"</p>
                                 </div>
                              </div>
                              <div className="flex items-start gap-3">
                                 <div className="w-8 h-8 rounded-xl bg-sky-600/20 flex items-center justify-center text-xs text-sky-400 border border-sky-500/30">🛡️</div>
                                 <div>
                                    <p className="text-[9px] font-black text-sky-400 uppercase tracking-widest">Warranty Activation</p>
                                    <p className="text-[11px] font-bold text-slate-300 leading-tight">"{asset.insertFeatures.warrantyCTA}"</p>
                                 </div>
                              </div>
                           </div>
                           <div className="space-y-4">
                              <div className="flex items-start gap-3">
                                 <div className="w-8 h-8 rounded-xl bg-rose-600/20 flex items-center justify-center text-xs text-rose-400 border border-rose-500/30">⭐</div>
                                 <div>
                                    <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest">Policy Review Request</p>
                                    <p className="text-[11px] font-bold text-slate-300 leading-tight">"{asset.insertFeatures.reviewRequestPolicy}"</p>
                                 </div>
                              </div>
                              <div className="flex items-start gap-3">
                                 <div className="w-8 h-8 rounded-xl bg-purple-600/20 flex items-center justify-center text-xs text-purple-400 border border-purple-500/30">📖</div>
                                 <div>
                                    <p className="text-[9px] font-black text-purple-400 uppercase tracking-widest">Brand Story / Mission</p>
                                    <p className="text-[11px] font-bold text-slate-300 leading-tight">"{asset.insertFeatures.brandStorySnippet}"</p>
                                 </div>
                              </div>
                              <div className="flex items-start gap-3">
                                 <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-xs text-white border border-white/20">📱</div>
                                 <div>
                                    <p className="text-[9px] font-black text-white uppercase tracking-widest">QR Code → Bonus Guide</p>
                                    <p className="text-[11px] font-bold text-slate-300 leading-tight">"{asset.insertFeatures.qrCodeStrategy}"</p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                   )}

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Technical Blueprint</p>
                        <p className="text-[10px] font-bold text-slate-500 leading-relaxed">{asset.specSummary}</p>
                      </div>
                      <div className="p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">Visual Cue Strategy</p>
                        <p className="text-[10px] font-bold text-indigo-700 leading-relaxed">{asset.visualCueStrategy}</p>
                      </div>
                   </div>

                   <div className="flex items-center gap-6 p-4 bg-slate-900 rounded-2xl">
                      <div className="flex-1">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Brand Consistency Index</p>
                         <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-indigo-500 h-full" style={{ width: `${asset.brandConsistencyScore}%` }}></div>
                         </div>
                      </div>
                      <span className="text-xs font-black text-white">{asset.brandConsistencyScore}%</span>
                   </div>
                </div>
                
                <div className="lg:w-1/2 w-full aspect-square md:aspect-video bg-slate-100 rounded-[2.5rem] overflow-hidden relative group border border-slate-200">
                   {asset.imageUrl ? (
                     <img src={asset.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={asset.title} />
                   ) : (
                     <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-slate-300">
                        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest">Synthesizing Blueprint...</span>
                     </div>
                   )}
                   <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-lg text-[9px] font-black text-white uppercase tracking-widest">
                      {asset.type} Preview
                   </div>
                </div>
             </div>
          </div>
        ))}

        {!assets.length && !isGenerating && (
          <div className="h-96 border-4 border-dashed border-slate-100 rounded-[3.5rem] flex flex-col items-center justify-center text-slate-300 bg-white/40 p-12 text-center">
            <div className="text-8xl mb-6 opacity-30 grayscale">📦📏✨</div>
            <h3 className="text-2xl font-black text-slate-400 mb-2 uppercase tracking-tighter italic">Packaging Hub Standby</h3>
            <p className="text-sm font-medium max-w-sm mx-auto leading-relaxed">Enter product specs to generate structural box designs, TOS-compliant insert cards, and visual manuals for your FBA package.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackagingStudio;
