
import React, { useState } from 'react';
import { generateProductImage, generateProductVideo } from '../services/geminiService';

const ImageStudio: React.FC = () => {
  const [productName, setProductName] = useState('');
  const [style, setStyle] = useState('Professional');
  const [demographic, setDemographic] = useState('General');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAssets, setGeneratedAssets] = useState<{type: string, url: string, isSynced?: boolean}[]>([]);
  const [status, setStatus] = useState('');
  const [syncingIndex, setSyncingIndex] = useState<number | null>(null);

  const styles = ['Professional', 'Modern', 'Luxury', 'Eco-Conscious', 'Family-Friendly', 'Minimalist', 'Industrial'];
  const demographics = ['General', 'Millennials', 'Gen Z', 'Seniors', 'Parents', 'Outdoor Enthusiasts', 'Office Workers'];

  const imageTypes = [
    { type: 'Main Image', prompt: 'Amazon main product image, white background, studio lighting, high resolution, centered, professional product photography of: ' },
    { type: 'Lifestyle', prompt: 'Lifestyle photography, product being used in a relevant environment, cinematic lighting, high resolution, professional, aesthetic: ' },
    { type: 'Infographic', prompt: 'Product infographic, clean icons, highlighting features, high resolution, professional design for: ' },
    { type: 'In-Use', prompt: 'Extreme close up of product features being used, high resolution, 4k, professional photography: ' },
    { type: 'Comparison', prompt: 'Comparison chart style image showing product benefits vs competitors, professional design for: ' },
    { type: 'Specifications', prompt: 'Technical specifications image, dimensions shown, clean technical drawing style for: ' },
    { type: 'Product Usage', prompt: 'A series of steps showing how to use the product effectively, clean background: ' },
  ];

  const handleGenerate = async () => {
    if (!productName) return;
    setIsGenerating(true);
    setGeneratedAssets([]);
    
    try {
      setStatus('Starting AI generation engine...');
      const assets: {type: string, url: string}[] = [];
      
      for (const item of imageTypes) {
        setStatus(`Generating ${item.type}...`);
        const url = await generateProductImage(`${item.prompt} ${productName}`, '1:1', style, demographic);
        if (url) {
          assets.push({ type: item.type, url });
          setGeneratedAssets([...assets]);
        }
      }

      setStatus('Directing AI Video Studio...');
      const videoUrl = await generateProductVideo(`Cinematic product reveal video for ${productName}, ${style} aesthetic, ${demographic} target vibe, professional 4k camera movements.`);
      if (videoUrl) {
        assets.push({ type: 'Product Video', url: videoUrl });
        setGeneratedAssets([...assets]);
      }

      setStatus('Generation complete! All assets ready for Amazon FBA upload.');
    } catch (error) {
      console.error(error);
      setStatus('Error during generation. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSyncToAmazon = (index: number) => {
    setSyncingIndex(index);
    setTimeout(() => {
      setGeneratedAssets(prev => prev.map((a, i) => i === index ? { ...a, isSynced: true } : a));
      setSyncingIndex(null);
    }, 2000);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">AI Asset Studio</h1>
        <p className="text-slate-500">Generate high-converting Amazon gallery assets in minutes.</p>
      </header>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-2">
            <label className="text-sm font-semibold text-slate-700">Product Name</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 bg-white text-slate-900 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
              placeholder="e.g. Ergonomic Office Chair"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Style / Mood</label>
            <select 
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full px-4 py-3 bg-white text-slate-900 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              {styles.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Target Demographic</label>
            <select 
              value={demographic}
              onChange={(e) => setDemographic(e.target.value)}
              className="w-full px-4 py-3 bg-white text-slate-900 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              {demographics.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
        
        <button 
          onClick={handleGenerate}
          disabled={isGenerating || !productName}
          className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-3 border border-transparent disabled:border-slate-200"
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Generating Studio Assets...
            </>
          ) : 'Generate 7+1 High-Res Assets'}
        </button>
        {status && <p className="text-center text-sm font-medium text-indigo-600 animate-pulse">{status}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {generatedAssets.map((asset, i) => (
          <div key={i} className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden relative">
              {asset.type === 'Product Video' ? (
                <video src={asset.url} controls className="w-full h-full object-cover" />
              ) : (
                <img src={asset.url} alt={asset.type} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              )}
              {asset.isSynced && (
                <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full shadow-lg">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
              )}
            </div>
            <div className="p-4 bg-white">
              <p className="text-sm font-bold text-slate-800">{asset.type}</p>
              <div className="flex gap-2 mt-3">
                <button className="flex-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors">Download</button>
                <button 
                  onClick={() => handleSyncToAmazon(i)}
                  disabled={syncingIndex === i || asset.isSynced}
                  className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    asset.isSynced 
                      ? 'bg-green-50 text-green-600 cursor-default' 
                      : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600'
                  }`}
                >
                  {syncingIndex === i ? 'Pushing...' : asset.isSynced ? 'Synced to FBA' : 'Amazon Sync'}
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
