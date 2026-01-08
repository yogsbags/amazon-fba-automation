
import React, { useState } from 'react';
import { generateListing } from '../services/geminiService';
import { ListingContent } from '../types';

const ListingWriter: React.FC = () => {
  const [productName, setProductName] = useState('');
  const [features, setFeatures] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [listing, setListing] = useState<ListingContent | null>(null);

  const handleGenerate = async () => {
    if (!productName || !features) return;
    setIsGenerating(true);
    try {
      const data = await generateListing(productName, features);
      setListing(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">SEO Listing Wizard</h1>
        <p className="text-slate-500">Transform raw features into a high-converting Amazon product listing.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800">Product Details</h3>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Product Title / Name</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 bg-white text-slate-900 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
                placeholder="Portable Power Station 300W"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Main Features (comma separated)</label>
              <textarea 
                className="w-full px-4 py-2 bg-white text-slate-900 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all h-32 placeholder:text-slate-400"
                placeholder="Lightweight, fast charging, solar compatible, multiple outputs..."
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
              />
            </div>
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 transition-all shadow-lg shadow-indigo-100"
            >
              {isGenerating ? 'Writing SEO Content...' : 'Generate Listing'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          {listing ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Generated Listing</h3>
                <button className="text-sm font-bold text-indigo-600">Copy to Clipboard</button>
              </div>
              <div className="p-6 space-y-8">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Optimized Title</h4>
                  <p className="text-lg font-semibold text-slate-800">{listing.title}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Bullet Points (FBA Best Practice)</h4>
                  <ul className="space-y-3">
                    {listing.bullets.map((bullet, i) => (
                      <li key={i} className="flex gap-3 text-slate-700 leading-relaxed">
                        <span className="text-indigo-500 font-bold">•</span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Product Description</h4>
                  <div className="prose prose-sm text-slate-700 bg-gray-50 p-4 rounded-xl" dangerouslySetInnerHTML={{ __html: listing.description }} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">SEO Backend Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {listing.seoKeywords.map((kw, i) => (
                      <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">{kw}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 p-8 text-center">
              <div className="text-4xl mb-4">✍️</div>
              <p className="font-medium text-lg">Your generated listing will appear here</p>
              <p className="text-sm">Input your product details on the left to start</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingWriter;
