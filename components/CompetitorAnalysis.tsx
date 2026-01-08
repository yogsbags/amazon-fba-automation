
import React, { useState } from 'react';
import { analyzeCompetitors } from '../services/geminiService';
import { CompetitorData } from '../types';

const CompetitorAnalysis: React.FC = () => {
  const [productType, setProductType] = useState('');
  const [competitors, setCompetitors] = useState<CompetitorData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!productType) return;
    setIsLoading(true);
    try {
      const data = await analyzeCompetitors(productType);
      setCompetitors(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Competitor Intelligence</h1>
        <p className="text-slate-500">Analyze top performing listings to discover keywords, USP strategies, and image tactics.</p>
      </header>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-semibold text-slate-700">Competitor Product or Category</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 bg-white text-slate-900 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
              placeholder="e.g. Weighted Blankets"
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
            />
          </div>
          <button 
            onClick={handleAnalyze}
            disabled={isLoading || !productType}
            className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 shadow-lg shadow-indigo-100 transition-all h-fit border border-transparent disabled:border-slate-200"
          >
            {isLoading ? 'Scanning Market...' : 'Run Analysis'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-medium">Extracting data from top Amazon listings...</p>
          </div>
        ) : competitors.length > 0 ? (
          competitors.map((comp, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{comp.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm font-bold text-slate-600">{comp.rating} Rating</span>
                  </div>
                </div>
                <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-bold text-slate-500">COMPETITOR #{i+1}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-wider">Top Keywords Used</h4>
                  <div className="flex flex-wrap gap-2">
                    {comp.topKeywords.map((kw, j) => (
                      <span key={j} className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-md">{kw}</span>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-green-600 uppercase tracking-wider">Unique Selling Points (USPs)</h4>
                  <ul className="space-y-2">
                    {comp.usps.map((usp, j) => (
                      <li key={j} className="text-sm text-slate-600 flex gap-2">
                        <span className="text-green-500 font-bold">✓</span> {usp}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-orange-600 uppercase tracking-wider">Image Strategy</h4>
                  <ul className="space-y-2">
                    {comp.imageStrategy.map((img, j) => (
                      <li key={j} className="text-sm text-slate-600 flex gap-2">
                        <span className="text-orange-500 font-bold">•</span> {img}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
             <div className="text-5xl mb-4">🕵️</div>
             <p className="text-lg font-medium">Input a product name to see competitor insights</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompetitorAnalysis;
