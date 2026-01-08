
import React, { useState } from 'react';
import { researchKeywords } from '../services/geminiService';
import { KeywordResearchResult } from '../types';

const KeywordResearch: React.FC = () => {
  const [seed, setSeed] = useState('');
  const [results, setResults] = useState<KeywordResearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('All');

  const handleSearch = async () => {
    if (!seed) return;
    setIsLoading(true);
    try {
      const data = await researchKeywords(seed);
      setResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredResults = results.filter(r => filter === 'All' || r.relevance === filter);

  const handleExport = () => {
    const csv = [
      ['Keyword', 'Volume', 'CPC', 'Relevance'],
      ...filteredResults.map(r => [r.keyword, r.volume, r.cpc, r.relevance])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `keywords_${seed}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Keyword Research</h1>
        <p className="text-slate-500">Find high-volume, low-competition keywords for your Amazon listings and PPC.</p>
      </header>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-semibold text-slate-700">Seed Keyword</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 bg-white text-slate-900 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
              placeholder="e.g. Camping Gear"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
            />
          </div>
          <button 
            onClick={handleSearch}
            disabled={isLoading || !seed}
            className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 transition-all h-fit border border-transparent shadow-lg shadow-indigo-100"
          >
            {isLoading ? 'Researching...' : 'Fetch Keywords'}
          </button>
        </div>

        {results.length > 0 && (
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex gap-4">
               {['All', 'High', 'Medium', 'Low'].map(f => (
                 <button 
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${filter === f ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-slate-600'}`}
                 >
                   {f} Relevance
                 </button>
               ))}
            </div>
            <button 
              onClick={handleExport}
              className="text-sm font-bold text-indigo-600 flex items-center gap-2"
            >
              📥 Export CSV
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Keyword</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Search Volume</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Est. CPC</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Relevance</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Add to List</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                  Searching related terms and volume data...
                </td>
              </tr>
            ) : filteredResults.length > 0 ? (
              filteredResults.map((kw, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-700">{kw.keyword}</td>
                  <td className="px-6 py-4 text-center text-slate-600">{kw.volume.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center text-slate-600">${kw.cpc.toFixed(2)}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded-lg font-bold text-xs ${
                      kw.relevance === 'High' ? 'bg-green-50 text-green-700' : 
                      kw.relevance === 'Medium' ? 'bg-yellow-50 text-yellow-700' : 'bg-gray-50 text-gray-700'
                    }`}>
                      {kw.relevance}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-indigo-600 font-bold hover:underline">Select</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                  {results.length > 0 ? "No results match the current filter." : "Enter a seed keyword to start."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KeywordResearch;
