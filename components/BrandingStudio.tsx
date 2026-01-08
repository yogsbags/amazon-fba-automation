
import React, { useState } from 'react';
import { identifyTargetAudience, generateBrandingCollateral, generateLogo } from '../services/geminiService';
import { Persona, BrandingCollateral } from '../types';

const BrandingStudio: React.FC = () => {
  const [productName, setProductName] = useState('');
  const [features, setFeatures] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [collateral, setCollateral] = useState<BrandingCollateral[]>([]);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  
  // Logo Settings
  const [logoStyle, setLogoStyle] = useState('Minimalist');
  const [logoColor, setLogoColor] = useState('Charcoal & Silver');
  const [isLogoLoading, setIsLogoLoading] = useState(false);

  const logoStyles = ['Minimalist', 'Abstract', 'Pictorial Mark', 'Typographic', 'Retro / Vintage', 'Luxury / High-End'];
  const logoColors = ['Charcoal & Silver', 'Eco Green & Earth', 'Deep Ocean Blue', 'Luxury Gold & Black', 'Vibrant Startup Orange', 'Pastel Softness'];

  const handleDeepBranding = async () => {
    if (!productName || !features) return;
    setIsLoading(true);
    setStatus('Mapping target audience neural networks...');
    try {
      const identifiedPersonas = await identifyTargetAudience(productName, features);
      setPersonas(identifiedPersonas);
      
      setStatus('Generating branding collateral...');
      const generatedCollateral = await generateBrandingCollateral(productName, identifiedPersonas);
      setCollateral(generatedCollateral);

      await handleGenerateLogo();

      setStatus('Brand Identity Handshake Complete.');
    } catch (err) {
      console.error(err);
      setStatus('Branding pipeline error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateLogo = async () => {
    if (!productName) return;
    setIsLogoLoading(true);
    setStatus('Synthesizing high-fidelity brand mark...');
    try {
      const generatedLogo = await generateLogo(
        productName,
        logoStyle,
        logoColor,
        features || 'General Lifestyle'
      );
      if (generatedLogo) setLogoUrl(generatedLogo);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLogoLoading(false);
      setStatus('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Branding Studio</h1>
          <p className="text-slate-500 mt-1 font-medium italic">Autonomous Audience Discovery & Visual Identity.</p>
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
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Brand Name / Product</label>
             <input 
               type="text" 
               className="w-full px-8 py-5 bg-slate-50 text-slate-900 border-none rounded-3xl outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
               placeholder="e.g. Lumos Wellness"
               value={productName}
               onChange={(e) => setProductName(e.target.value)}
             />
          </div>
          <div className="space-y-4">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Key Value Propositions</label>
             <input 
               type="text" 
               className="w-full px-8 py-5 bg-slate-50 text-slate-900 border-none rounded-3xl outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
               placeholder="What makes you unique?"
               value={features}
               onChange={(e) => setFeatures(e.target.value)}
             />
          </div>
        </div>
        <button 
          onClick={handleDeepBranding}
          disabled={isLoading || !productName}
          className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-lg hover:bg-black transition-all shadow-2xl shadow-slate-200 active:scale-95"
        >
          {isLoading ? 'Processing Neural Persona Map...' : 'Generate Full Brand Identity'}
        </button>
      </div>

      {personas.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
             {/* Logo Studio Section */}
             <section className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                     <span className="text-2xl">🎨</span> Neural Logo Lab
                  </h3>
                  <button 
                    onClick={handleGenerateLogo}
                    disabled={isLogoLoading}
                    className="px-6 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all"
                  >
                    {isLogoLoading ? 'Rendering...' : 'Regenerate Mark'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Aesthetic Selection</label>
                         <div className="grid grid-cols-2 gap-2">
                            {logoStyles.map(s => (
                              <button 
                                key={s}
                                onClick={() => setLogoStyle(s)}
                                className={`px-4 py-3 rounded-xl text-[10px] font-bold border transition-all ${logoStyle === s ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100'}`}
                              >
                                {s}
                              </button>
                            ))}
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Color Psychology</label>
                         <div className="grid grid-cols-2 gap-2">
                            {logoColors.map(c => (
                              <button 
                                key={c}
                                onClick={() => setLogoColor(c)}
                                className={`px-4 py-3 rounded-xl text-[10px] font-bold border transition-all ${logoColor === c ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100'}`}
                              >
                                {c}
                              </button>
                            ))}
                         </div>
                      </div>
                   </div>

                   <div className="aspect-square bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center justify-center relative overflow-hidden group">
                      {logoUrl ? (
                        <img src={logoUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Generated Logo" />
                      ) : (
                        <div className="text-center space-y-4 text-slate-300">
                           <div className="text-5xl opacity-20">🪄</div>
                           <p className="text-[10px] font-black uppercase tracking-widest">Logo Studio Preview</p>
                        </div>
                      )}
                      {isLogoLoading && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                           <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                   </div>
                </div>
             </section>

             <section className="space-y-6">
                <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                   <span className="text-2xl">👥</span> Identified Target Personas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {personas.map((p, i) => (
                     <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-4">Persona #{i+1}</p>
                        <h4 className="text-xl font-black text-slate-900 mb-1">{p.name}</h4>
                        <p className="text-xs font-bold text-slate-400 mb-6">{p.ageRange} • {p.lifestyle}</p>
                        
                        <div className="space-y-4">
                           <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Pain Points</p>
                              <div className="flex flex-wrap gap-1.5">
                                 {p.painPoints.map((pp, j) => (
                                   <span key={j} className="px-2 py-1 bg-red-50 text-red-600 rounded-lg text-[10px] font-bold">-{pp}</span>
                                 ))}
                              </div>
                           </div>
                           <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Buying Triggers</p>
                              <div className="flex flex-wrap gap-1.5">
                                 {p.buyingTriggers.map((bt, j) => (
                                   <span key={j} className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold">+{bt}</span>
                                 ))}
                              </div>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             </section>

             <section className="space-y-6">
                <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                   <span className="text-2xl">📢</span> Brand Collateral Package
                </h3>
                <div className="space-y-4">
                   {collateral.map((c, i) => (
                     <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8">
                        <div className="flex-1">
                           <span className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest mb-4 inline-block">
                              {c.type}
                           </span>
                           <h4 className="text-2xl font-black text-slate-900 mb-2 leading-tight">{c.headline}</h4>
                           <p className="text-slate-500 text-sm leading-relaxed font-medium">{c.copy}</p>
                        </div>
                        <div className="md:w-64 space-y-2">
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">AI Visual Instruction</p>
                           <p className="text-[10px] text-slate-500 italic bg-slate-50 p-4 rounded-2xl border border-slate-100">"{c.visualPrompt}"</p>
                           <button className="w-full py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-colors">Generate Mockup</button>
                        </div>
                     </div>
                   ))}
                </div>
             </section>
          </div>

          <div className="lg:col-span-4 space-y-8">
             <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-8 sticky top-8">
                <h4 className="text-xl font-black text-slate-900 tracking-tight">Identity Hub</h4>
                
                <div className="p-6 bg-slate-900 rounded-[2rem] border border-white/5 space-y-6">
                   <div>
                     <h5 className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-1">Brand Registry Sync</h5>
                     <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">Global visual handshake ready.</p>
                   </div>

                   <div className="space-y-3">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs">✓</div>
                         <p className="text-[10px] font-bold text-slate-300">Target Audience Personas</p>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs">✓</div>
                         <p className="text-[10px] font-bold text-slate-300">Localized SEO Ad Copy</p>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs">✓</div>
                         <p className="text-[10px] font-bold text-slate-300">High-Res Brand Mark</p>
                      </div>
                   </div>

                   <button className="w-full py-4 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20">
                     Export Brand Bible
                   </button>
                   <button className="w-full py-4 bg-white/10 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-all">
                     Push to Amazon Store
                   </button>
                </div>

                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Neural Strategy Note</p>
                   <p className="text-[10px] font-bold text-slate-500 leading-relaxed italic">The current visual identity is optimized for Amazon's Mobile App rendering engines, ensuring your brand mark stays legible at small icon scales.</p>
                </div>
             </div>
          </div>
        </div>
      )}

      {!personas.length && !isLoading && (
        <div className="h-96 border-4 border-dashed border-slate-100 rounded-[3.5rem] flex flex-col items-center justify-center text-slate-300 bg-white/40 p-12 text-center">
          <div className="text-8xl mb-6 opacity-30 grayscale">🏷️✨</div>
          <h3 className="text-2xl font-black text-slate-400 mb-2 uppercase tracking-tighter italic">Identity Engine Standby</h3>
          <p className="text-sm font-medium max-w-sm mx-auto">Input brand data to automatically identify audiences, generate social collateral, and design your visual identity.</p>
        </div>
      )}
    </div>
  );
};

export default BrandingStudio;
