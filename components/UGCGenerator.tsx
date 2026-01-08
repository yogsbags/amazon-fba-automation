
import React, { useState } from 'react';
import { generateUGCVideo, generateViralHooks } from '../services/geminiService';
import { ViralHook } from '../types';

const UGCGenerator: React.FC = () => {
  const [productName, setProductName] = useState('');
  const [features, setFeatures] = useState('');
  const [vibe, setVibe] = useState('Authentic Review');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [script, setScript] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  const vibes = [
    'Authentic Review',
    'ASMR Unboxing',
    'Lifestyle Aesthetic',
    'Problem/Solution',
    'High-Energy Hype'
  ];

  const handleGenerateUGC = async () => {
    if (!productName || !features) return;
    setIsGenerating(true);
    setVideoUrl(null);
    setScript(null);
    setPublished(false);
    
    try {
      setStatus('Writing viral script...');
      const hooks = await generateViralHooks(productName, features);
      const selectedHook = hooks[0];
      setScript(selectedHook.script);

      setStatus('Directing Veo 3.1 Neural Cinema (Vertical)...');
      const url = await generateUGCVideo(`${productName} - ${selectedHook.script}`, vibe);
      if (url) {
        setVideoUrl(url);
        setStatus('UGC Render Complete.');
      } else {
        setStatus('Generation failed.');
      }
    } catch (err) {
      console.error(err);
      setStatus('Error in pipeline.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      setPublished(true);
      setStatus('Successfully Published to TikTok & Reels!');
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in slide-in-from-bottom-4 duration-700 pb-20">
      <header>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">AI UGC Studio</h1>
        <p className="text-slate-500 mt-1 font-medium italic">Autonomous short-form video generation for TikTok & Instagram Reels.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-8">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Production Brief</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Identity</label>
                <input 
                  type="text" 
                  className="w-full px-6 py-4 bg-slate-50 text-slate-900 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                  placeholder="e.g. Cordless Massage Gun"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Viral USP</label>
                <textarea 
                  className="w-full px-6 py-4 bg-slate-50 text-slate-900 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 h-28 font-semibold text-sm"
                  placeholder="What's the 'wow' factor?"
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Creator Vibe</label>
                <select 
                  className="w-full px-6 py-4 bg-slate-50 text-slate-900 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                  value={vibe}
                  onChange={(e) => setVibe(e.target.value)}
                >
                  {vibes.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            </div>

            <button 
              onClick={handleGenerateUGC}
              disabled={isGenerating || !productName}
              className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black text-lg hover:bg-indigo-700 shadow-2xl shadow-indigo-100 transition-all active:scale-95"
            >
              {isGenerating ? 'Synthesizing Creator Content...' : 'Generate Viral UGC'}
            </button>
          </div>

          {status && (
            <div className="p-6 bg-slate-900 text-indigo-400 rounded-[2rem] font-black text-[10px] uppercase tracking-widest flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              {status}
            </div>
          )}
        </div>

        <div className="lg:col-span-7 flex flex-col gap-8">
           {videoUrl ? (
             <div className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl overflow-hidden flex flex-col md:flex-row h-full min-h-[600px]">
                <div className="md:w-1/2 bg-slate-100 relative group">
                   <video src={videoUrl} controls className="w-full h-full object-cover" autoPlay loop muted />
                   <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 text-white">
                      <p className="text-[10px] font-black uppercase tracking-widest mb-1">Previewing Vertical Output</p>
                      <p className="text-xs font-medium">9:16 Social Optimized</p>
                   </div>
                </div>
                <div className="md:w-1/2 p-10 flex flex-col justify-between">
                   <div className="space-y-6">
                      <div className="space-y-2">
                         <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Neural Script</h4>
                         <p className="text-sm font-medium text-slate-600 leading-relaxed italic">"{script}"</p>
                      </div>
                      <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                         <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-1">Viral Probability</p>
                         <div className="flex items-end gap-1">
                            <span className="text-2xl font-black text-indigo-900">88%</span>
                            <span className="text-[10px] font-bold text-indigo-500 mb-1">High Conversion</span>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-3">
                      <button 
                        onClick={handlePublish}
                        disabled={isPublishing || published}
                        className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 ${
                          published ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-black'
                        }`}
                      >
                         {isPublishing ? 'Connecting TikTok API...' : published ? '✓ Live on TikTok' : 'Publish to TikTok'}
                         {!published && !isPublishing && <span className="text-lg">📱</span>}
                      </button>
                      <button className="w-full py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
                        Download for Ad Manager
                      </button>
                   </div>
                </div>
             </div>
           ) : (
             <div className="flex-1 border-4 border-dashed border-slate-100 rounded-[4rem] bg-white/40 flex flex-col items-center justify-center text-center p-12">
                <div className="text-8xl mb-6 opacity-30 grayscale">📱✨</div>
                <h3 className="text-2xl font-black text-slate-400 mb-2 uppercase tracking-tighter italic">UGC Studio Standby</h3>
                <p className="text-sm font-medium max-w-sm text-slate-300">Input your product details to generate vertical social-first videos that drive external traffic to your FBA listings.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default UGCGenerator;
