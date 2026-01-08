
import React, { useState, useRef, useEffect } from 'react';
import { generateProductImage, generateProductVideo } from '../services/geminiService';
import { amazonService } from '../services/amazonService';
import { MARKETPLACES, Marketplace } from '../types';

const ImageStudio: React.FC = () => {
  const [productName, setProductName] = useState('');
  const [style, setStyle] = useState('Professional');
  const [demographic, setDemographic] = useState('General');
  const [selectedMarket, setSelectedMarket] = useState<Marketplace>(MARKETPLACES[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [generatedAssets, setGeneratedAssets] = useState<{type: string, url: string, isSynced?: boolean, isTesting?: boolean, syncStatus?: string}[]>([]);
  const [status, setStatus] = useState('');
  const [syncingIndex, setSyncingIndex] = useState<number | null>(null);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const STORAGE_KEY = 'astra_image_studio_backup';

  useEffect(() => {
    const backup = localStorage.getItem(STORAGE_KEY);
    if (backup) {
      try {
        const data = JSON.parse(backup);
        setProductName(data.productName || '');
        setStyle(data.style || 'Professional');
        setDemographic(data.demographic || 'General');
        setGeneratedAssets(data.generatedAssets || []);
        if (data.selectedMarketId) {
          const m = MARKETPLACES.find(mark => mark.id === data.selectedMarketId);
          if (m) setSelectedMarket(m);
        }
      } catch (e) {
        console.error("Failed to load Image Studio backup", e);
      }
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const dataToSave = {
        productName,
        style,
        demographic,
        generatedAssets,
        selectedMarketId: selectedMarket.id,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      const now = new Date().toLocaleTimeString();
      setLastSaved(now);
      setStatus(`Progress auto-saved at ${now}`);
      setTimeout(() => setStatus(prev => prev.includes('auto-saved') ? '' : prev), 3000);
    }, 300000);

    return () => clearInterval(interval);
  }, [productName, style, demographic, generatedAssets, selectedMarket]);

  const styles = ['Professional', 'Modern', 'Luxury', 'Minimalist', 'Industrial', 'Eco-Tech'];
  const demographics = ['General', 'Premium Buyers', 'Young Professionals', 'Homeowners', 'Middle Eastern Families', 'EU Sustainability Focused'];

  const imageTypes = [
    { type: 'Hero Main', prompt: 'Amazon main product image, white background, studio lighting, high resolution, centered, professional product photography of: ' },
    { type: 'Lifestyle Context', prompt: 'Lifestyle photography, product in a culturally relevant setting. Use high-end architectural cues matching target market language ' },
    { type: 'Infographic Features', prompt: 'Product features infographic, professional layout. Include localized call-out text in ' },
    { type: 'Localized Tech Specs', prompt: 'Technical specs diagram, localized metric units and text descriptions in ' },
    { type: 'Regional Comparison', prompt: 'Competitive advantage comparison table, localized copy in ' },
    { type: 'Macro Utility', prompt: 'Macro shot of product textures and build quality, cinematic lighting: ' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setReferenceImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!productName) return;
    setIsGenerating(true);
    setGeneratedAssets([]);
    
    try {
      setStatus(`Configuring Neural Studio for ${selectedMarket.name}...`);
      const assets: {type: string, url: string}[] = [];
      
      for (const item of imageTypes) {
        setStatus(`Synthesizing ${item.type} (${selectedMarket.lang})...`);
        const finalPrompt = item.type.includes('Infographic') || item.type.includes('Comparison') || item.type.includes('Tech') 
          ? `${item.prompt} ${selectedMarket.lang}. Product: ${productName}`
          : `${item.prompt} ${productName}. Locale Context: ${selectedMarket.name}. Demographic: ${demographic}`;
          
        const url = await generateProductImage(finalPrompt, '1:1', style, demographic, selectedMarket.lang);
        if (url) {
          assets.push({ type: item.type, url });
          setGeneratedAssets([...assets]);
        }
      }

      setStatus(`Directing localized Veo 3.1 Cinema (${selectedMarket.lang})...`);
      const videoUrl = await generateProductVideo(`Premium cinematic product reveal for ${productName} in ${selectedMarket.name} market`, selectedMarket.lang);
      if (videoUrl) {
        assets.push({ type: 'Regional Product Video', url: videoUrl });
        setGeneratedAssets([...assets]);
      }

      setStatus('Global Asset Production Complete.');
    } catch (error) {
      console.error(error);
      setStatus('Workflow interrupted.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSyncToAmazon = async (index: number) => {
    setSyncingIndex(index);
    try {
      const asset = generatedAssets[index];
      await amazonService.uploadAsset(asset.url);
      setGeneratedAssets(prev => prev.map((a, i) => i === index ? { ...a, isSynced: true } : a));
    } catch (err) {
      console.error(err);
    } finally {
      setSyncingIndex(null);
    }
  };

  const toggleTest = (index: number) => {
    setGeneratedAssets(prev => prev.map((a, i) => i === index ? { ...a, isTesting: !a.isTesting } : a));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="sticky top-0 z-40 py-6 mb-4 bg-slate-50/80 backdrop-blur-md flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Localized Asset Studio</h1>
          <p className="text-slate-500 mt-1 font-medium italic">High-fidelity visual localization & A/B Experimentation.</p>
        </div>
        <div className="flex items-center gap-4">
          {lastSaved && (
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">
              Auto-saved: {lastSaved}
            </span>
          )}
          {status && (
            <div className="flex items-center gap-3 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
              {status}
            </div>
          )}
        </div>
      </header>

      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
          <div className="lg:col-span-1 space-y-4">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Reference Photo</label>
             <div 
               onClick={() => fileInputRef.current?.click()}
               className="aspect-square bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-all overflow-hidden relative group"
             >
               {referenceImage ? (
                 <img src={referenceImage} className="w-full h-full object-cover" alt="Ref" />
               ) : (
                 <span className="text-[10px] font-black text-slate-400 uppercase">Seed Image</span>
               )}
               <input type="file" hidden ref={fileInputRef} onChange={handleFileChange} />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Marketplace Targeting</label>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5">
                  {MARKETPLACES.map(m => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMarket(m)}
                      className={`p-2 rounded-xl border text-base flex items-center justify-center transition-all ${
                        selectedMarket.id === m.id ? 'border-indigo-600 bg-indigo-50 shadow-sm' : 'border-slate-100 bg-slate-50 opacity-50 hover:opacity-100'
                      }`}
                      title={`${m.name} (${m.lang})`}
                    >
                      {m.flag}
                    </button>
                  ))}
                </div>
             </div>
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Description</label>
              <input 
                type="text" 
                className="w-full px-6 py-4 bg-slate-50 text-slate-900 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                placeholder="e.g. Minimalist Coffee Maker"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Visual Style</label>
                  <select 
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl font-semibold outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {styles.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cultural Demo</label>
                  <select 
                    value={demographic}
                    onChange={(e) => setDemographic(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl font-semibold outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {demographics.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
               </div>
            </div>
          </div>

          <div className="lg:col-span-2 h-full flex flex-col justify-end gap-4">
             <div className="p-6 bg-slate-900 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">{selectedMarket.flag}</span>
                  <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Global Handshake Active</p>
                </div>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">Assets will reflect {selectedMarket.lang} text and {selectedMarket.dir === 'rtl' ? 'Right-to-Left' : 'Modern'} visual hierarchy common in {selectedMarket.name}.</p>
             </div>
             <button 
                onClick={handleGenerate}
                disabled={isGenerating || !productName}
                className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 shadow-2xl shadow-indigo-200 transition-all active:scale-95"
              >
                {isGenerating ? 'Synthesizing Market Package...' : `Synthesize Assets for ${selectedMarket.id}`}
              </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-12">
        {generatedAssets.map((asset, i) => (
          <div key={i} className="group relative bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 hover:shadow-2xl transition-all duration-500">
            <div className="aspect-square bg-slate-50 flex items-center justify-center overflow-hidden relative">
              {asset.type.includes('Video') ? (
                <video src={asset.url} controls className="w-full h-full object-cover" />
              ) : (
                <img src={asset.url} alt={asset.type} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              )}
              
              <div className="absolute top-4 right-4 flex gap-2">
                {asset.isSynced && (
                  <div className="bg-emerald-500 text-white p-2 rounded-xl shadow-lg animate-in zoom-in duration-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                )}
                <div className="bg-slate-900/90 backdrop-blur-md text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-xl">
                  {selectedMarket.flag} {selectedMarket.id}
                </div>
              </div>

              {asset.isTesting && (
                <div className="absolute inset-0 bg-indigo-600/20 backdrop-blur-[2px] flex flex-col items-center justify-center text-white p-6 text-center animate-in fade-in duration-300">
                   <p className="text-4xl mb-2">🧪</p>
                   <p className="text-sm font-black uppercase tracking-widest">A/B Experiment Active</p>
                   <p className="text-[10px] font-bold mt-1">Collecting CTR & Session Delta via SP-API</p>
                </div>
              )}
            </div>
            <div className="p-6 bg-white border-t border-slate-50">
               <div className="flex justify-between items-start mb-4">
                  <h4 className="text-sm font-black text-slate-900">{asset.type}</h4>
                  <button 
                    onClick={() => toggleTest(i)}
                    className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${
                      asset.isTesting ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-400 border-slate-100 hover:border-indigo-100 hover:text-indigo-600'
                    }`}
                  >
                    {asset.isTesting ? 'Testing...' : 'A/B Test'}
                  </button>
               </div>
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors">Download</button>
                <button 
                  onClick={() => handleSyncToAmazon(i)}
                  disabled={syncingIndex === i || asset.isSynced}
                  className={`flex-1 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${
                    asset.isSynced 
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {syncingIndex === i ? 'Syncing...' : asset.isSynced ? 'Synced' : 'Push Global'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageStudio;
