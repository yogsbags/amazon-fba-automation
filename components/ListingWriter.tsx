
import React, { useState, useRef, useEffect } from 'react';
import { generateListing, generateAPlusContent, generateProductImage } from '../services/geminiService';
import { amazonService } from '../services/amazonService';
import { ListingContent, MARKETPLACES, Marketplace, APlusModule } from '../types';

const ListingWriter: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'single' | 'bulk'>('single');
  const [productName, setProductName] = useState('');
  const [features, setFeatures] = useState('');
  const [sku, setSku] = useState('');
  const [selectedMarket, setSelectedMarket] = useState<Marketplace>(MARKETPLACES[0]);
  const [productImage, setProductImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [listing, setListing] = useState<ListingContent | null>(null);
  const [aplusModules, setAplusModules] = useState<APlusModule[]>([]);
  const [syncDone, setSyncDone] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const STORAGE_KEY = 'astra_listing_writer_backup';

  // Load backup on mount
  useEffect(() => {
    const backup = localStorage.getItem(STORAGE_KEY);
    if (backup) {
      try {
        const data = JSON.parse(backup);
        setProductName(data.productName || '');
        setFeatures(data.features || '');
        setSku(data.sku || '');
        setListing(data.listing || null);
        setAplusModules(data.aplusModules || []);
        if (data.selectedMarketId) {
          const m = MARKETPLACES.find(mark => mark.id === data.selectedMarketId);
          if (m) setSelectedMarket(m);
        }
      } catch (e) {
        console.error("Failed to load Listing Writer backup", e);
      }
    }
  }, []);

  // Auto-save interval (every 5 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      const dataToSave = {
        productName,
        features,
        sku,
        listing,
        aplusModules,
        selectedMarketId: selectedMarket.id,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      const now = new Date().toLocaleTimeString();
      setLastSaved(now);
      setStatus(`Progress auto-saved at ${now}`);
      setTimeout(() => setStatus(prev => prev.includes('auto-saved') ? '' : prev), 3000);
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, [productName, features, sku, listing, aplusModules, selectedMarket]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProductImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!productName || !features) return;
    setIsGenerating(true);
    setSyncDone(false);
    setStatus('Generating neural listing...');
    try {
      const listingData = await generateListing(
        productName, 
        features, 
        selectedMarket.lang, 
        selectedMarket.name,
        productImage?.split(',')[1]
      );
      setListing(listingData);

      setStatus('Mapping A+ content modules...');
      const aplus = await generateAPlusContent(productName, features, selectedMarket.lang);
      setAplusModules(aplus);

      // Generate imagery for A+ modules
      const updatedAplus = [...aplus];
      for(let i=0; i < aplus.length; i++) {
        setStatus(`Rendering A+ Visual ${i+1}/${aplus.length}...`);
        const img = await generateProductImage(aplus[i].imagePrompt, '16:9', 'Modern', 'General', selectedMarket.lang);
        if (img) updatedAplus[i].imageUrl = img;
        setAplusModules([...updatedAplus]);
      }
      setStatus('Catalog package complete.');
    } catch (error) {
      console.error(error);
      setStatus('Neural generation interrupted.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePushToAmazon = async () => {
    if (!listing || !sku) return;
    setIsSyncing(true);
    try {
      await amazonService.syncListing(`MKT_ID_${selectedMarket.id}`, sku, listing);
      setSyncDone(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="sticky top-0 z-40 py-6 mb-4 bg-slate-50/80 backdrop-blur-md flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Global Neural Wizard</h1>
            <p className="text-slate-500 mt-1 font-medium italic">Autonomous localization & A+ Enhanced Brand Content.</p>
          </div>
          <div className="inline-flex p-1 bg-slate-100 rounded-2xl">
             <button 
               onClick={() => setActiveMode('single')}
               className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeMode === 'single' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
             >
               Single SKU
             </button>
             <button 
               onClick={() => setActiveMode('bulk')}
               className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeMode === 'bulk' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
             >
               Bulk Expansion
             </button>
          </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Marketplace & Catalog</h3>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Marketplace</label>
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-4 gap-2">
                {MARKETPLACES.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMarket(m)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center transition-all ${
                      selectedMarket.id === m.id 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-600' 
                      : 'border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xl mb-1">{m.flag}</span>
                    <span className="text-[9px] font-black uppercase">{m.id}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity (Source)</label>
              <input 
                type="text" 
                className="w-full px-5 py-3.5 bg-slate-50 text-slate-900 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                placeholder="e.g. Ultrasonic Humidifier"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Core Features</label>
              <textarea 
                className="w-full px-5 py-3.5 bg-slate-50 text-slate-900 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 h-28 font-semibold text-sm"
                placeholder="List main selling points..."
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
              />
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !productName}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 shadow-2xl shadow-indigo-200 transition-all active:scale-95"
            >
              {isGenerating ? `Synthesizing Neural Catalog...` : `Generate Global Package`}
            </button>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-12">
          {listing ? (
            <>
              <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="p-8 border-b bg-slate-50 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{selectedMarket.flag}</span>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">Main Listing ({selectedMarket.lang})</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Amazon {selectedMarket.id} Standard Pack</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <input 
                      type="text" 
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      placeholder="SKU"
                      className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-1 focus:ring-indigo-500 w-24"
                    />
                    <button 
                      onClick={handlePushToAmazon}
                      disabled={isSyncing || !sku}
                      className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg ${
                        syncDone ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {isSyncing ? 'Pushing...' : syncDone ? '✓ Live' : 'Push All'}
                    </button>
                  </div>
                </div>
                <div className="p-10 space-y-10" dir={selectedMarket.dir || 'ltr'}>
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Optimized Title</h4>
                    <p className="text-2xl font-black text-slate-900 leading-tight tracking-tight">{listing.title}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Bullets</h4>
                        <ul className="space-y-3">
                           {listing.bullets.map((b, i) => <li key={i} className="text-sm font-medium text-slate-600">• {b}</li>)}
                        </ul>
                     </div>
                     <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Localized SEO Keywords</h4>
                        <div className="flex flex-wrap gap-2">
                           {listing.seoKeywords.map((kw, i) => <span key={i} className="px-2 py-1 bg-slate-50 border border-slate-100 rounded text-[10px] font-bold text-slate-400 italic">{kw}</span>)}
                        </div>
                     </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2 px-4">
                   <span className="text-2xl">🖼️</span> A+ Enhanced Brand Content
                </h3>
                <div className="space-y-8">
                   {aplusModules.map((module, i) => (
                     <div key={i} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-4 border-b bg-slate-50/50 flex justify-between items-center">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Module Type: {module.type}</span>
                        </div>
                        <div className="p-8 space-y-6">
                           <div className="flex flex-col lg:flex-row gap-8 items-center">
                              <div className="lg:w-1/2 space-y-4">
                                 <h4 className="text-xl font-black text-slate-900">{module.heading}</h4>
                                 <p className="text-sm text-slate-500 leading-relaxed italic">"{module.body}"</p>
                              </div>
                              <div className="lg:w-1/2 w-full aspect-video bg-slate-100 rounded-3xl overflow-hidden relative">
                                 {module.imageUrl ? (
                                   <img src={module.imageUrl} className="w-full h-full object-cover" alt="A+ Asset" />
                                 ) : (
                                   <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-slate-300 uppercase animate-pulse">
                                      Generating Module Visual...
                                   </div>
                                 )}
                              </div>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            </>
          ) : (
            <div className="h-full min-h-[600px] border-4 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center text-slate-300 bg-white/40 p-12 text-center">
              <div className="text-7xl mb-6 opacity-40 grayscale">📦🌍✨</div>
              <h3 className="text-2xl font-black text-slate-400 mb-2 uppercase tracking-tighter italic">Neural Catalog Hub Standby</h3>
              <p className="text-sm font-medium max-w-sm mx-auto leading-relaxed">Enter your product details to generate a localized listing, backend SEO, and professional A+ content visuals.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingWriter;
