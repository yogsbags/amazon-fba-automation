
import React, { useState } from 'react';
import { generateStorePage, generateProductImage } from '../services/geminiService';
import { StorePageSection } from '../types';

const StorePageBuilder: React.FC = () => {
  const [brandName, setBrandName] = useState('');
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sections, setSections] = useState<StorePageSection[]>([]);
  const [status, setStatus] = useState('');

  const handleBuildStore = async () => {
    if (!brandName || !category) return;
    setIsLoading(true);
    setStatus('Architecting storefront neural layout...');
    try {
      const layout = await generateStorePage(brandName, category);
      setSections(layout);

      setStatus('Synthesizing high-res store assets...');
      const updatedSections = [...layout];
      for (let i = 0; i < layout.length; i++) {
        setStatus(`Rendering ${layout[i].layout} module: ${layout[i].title}...`);
        // Fix: Added missing target language argument 'English' to satisfy generateProductImage signature
        const img = await generateProductImage(layout[i].imagePrompt, '16:9', 'Modern', 'General', 'English');
        if (img) updatedSections[i].imageUrl = img;
        setSections([...updatedSections]);
      }
      
      setStatus('Amazon Storefront Draft Ready.');
    } catch (err) {
      console.error(err);
      setStatus('Store pipeline interrupted.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Store Page Builder</h1>
          <p className="text-slate-500 mt-1 font-medium italic">Autonomous Storefront Architect for Amazon Brand Registry.</p>
        </div>
        {status && (
          <div className="flex items-center gap-3 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
            {status}
          </div>
        )}
      </header>

      <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Brand Name</label>
              <input 
                type="text" 
                className="w-full px-8 py-5 bg-slate-50 text-slate-900 border-none rounded-3xl outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                placeholder="e.g. Astra Fitness"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
              />
           </div>
           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Main Category</label>
              <input 
                type="text" 
                className="w-full px-8 py-5 bg-slate-50 text-slate-900 border-none rounded-3xl outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                placeholder="e.g. Tech Accessories"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
           </div>
        </div>
        <button 
          onClick={handleBuildStore}
          disabled={isLoading || !brandName}
          className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-lg hover:bg-black transition-all shadow-2xl shadow-slate-200 active:scale-95"
        >
          {isLoading ? 'Directing Neural Storefront Layout...' : 'Architect Brand Storefront'}
        </button>
      </div>

      <div className="space-y-12">
        {sections.map((section, i) => (
          <div key={i} className="bg-white rounded-[3.5rem] overflow-hidden border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-8 duration-700">
             <div className="p-8 border-b bg-slate-50 flex justify-between items-center">
                <div>
                   <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest mb-1 inline-block">
                      Module: {section.layout}
                   </span>
                   <h3 className="text-2xl font-black text-slate-900 tracking-tight">{section.title}</h3>
                </div>
                <div className="flex gap-2">
                   <button className="px-4 py-2 bg-white text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200 hover:bg-slate-50 transition-all">Edit Component</button>
                   <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg">Push to Store</button>
                </div>
             </div>
             
             <div className={`p-10 flex flex-col lg:flex-row gap-10 items-center ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                <div className="lg:w-1/2 space-y-6">
                   <p className="text-xl text-slate-600 font-medium leading-relaxed italic">"{section.description}"</p>
                   <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Neural Layout Strategy</p>
                      <p className="text-xs font-bold text-slate-500 leading-relaxed">This {section.layout} block is optimized for Amazon's desktop and mobile A9 conversion heuristics, targeting high-dwell time via visual storytelling.</p>
                   </div>
                </div>
                <div className="lg:w-1/2 w-full aspect-video bg-slate-100 rounded-[2.5rem] overflow-hidden relative group">
                   {section.imageUrl ? (
                     <img src={section.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={section.title} />
                   ) : (
                     <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-slate-300">
                        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest">Synthesizing Visual...</span>
                     </div>
                   )}
                </div>
             </div>
          </div>
        ))}

        {!sections.length && !isLoading && (
          <div className="h-96 border-4 border-dashed border-slate-100 rounded-[3.5rem] flex flex-col items-center justify-center text-slate-300 bg-white/40 p-12 text-center">
            <div className="text-8xl mb-6 opacity-30 grayscale">🏢📦</div>
            <h3 className="text-2xl font-black text-slate-400 mb-2 uppercase tracking-tighter italic">Store Builder Standby</h3>
            <p className="text-sm font-medium max-w-sm mx-auto">Input brand name and category to generate an end-to-end Amazon Storefront architecture with custom AI visual assets.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StorePageBuilder;
