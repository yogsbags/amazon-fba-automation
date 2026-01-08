
import React, { useState } from 'react';

const Integrations: React.FC = () => {
  const [isAmazonConnected, setIsAmazonConnected] = useState(false);
  const [isAdsConnected, setIsAdsConnected] = useState(false);
  const [merchantId, setMerchantId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAdsLoading, setIsAdsLoading] = useState(false);

  const handleConnect = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsAmazonConnected(true);
      setMerchantId('AMZN-MKT-9283-FBA');
      setIsLoading(false);
    }, 1500);
  };

  const handleAdsConnect = () => {
    setIsAdsLoading(true);
    setTimeout(() => {
      setIsAdsConnected(true);
      setIsAdsLoading(false);
    }, 1200);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-12">
      <header className="mb-8">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">API Integrations</h1>
        <p className="text-slate-500 font-medium italic">Link your Amazon credentials to unlock the Autonomous Neural Loop.</p>
      </header>

      <div className="space-y-6">
        {/* Amazon Selling Partner API */}
        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-10 items-center transition-all hover:shadow-xl">
          <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center flex-shrink-0">
             <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" className="w-12" alt="Amazon" />
          </div>
          <div className="flex-1 space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Selling Partner (SP-API)</h3>
            <p className="text-slate-500 text-sm font-medium">Allows Astra to push high-res assets, A+ content, and bullet updates directly to your catalog.</p>
            {isAmazonConnected && (
              <div className="flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase tracking-widest mt-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                Linked: {merchantId}
              </div>
            )}
          </div>
          <div className="flex-shrink-0">
            {isAmazonConnected ? (
              <button onClick={() => setIsAmazonConnected(false)} className="px-6 py-3 border border-red-100 text-red-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-50 transition-all">Disconnect</button>
            ) : (
              <button onClick={handleConnect} disabled={isLoading} className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-100">{isLoading ? 'Syncing...' : 'Link Store'}</button>
            )}
          </div>
        </div>

        {/* Amazon Advertising API */}
        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-10 items-center transition-all hover:shadow-xl">
          <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center flex-shrink-0 text-4xl">
             📢
          </div>
          <div className="flex-1 space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Advertising Reports API</h3>
            <p className="text-slate-500 text-sm font-medium">Enables the AI PPC Engine to ingest Search Term Reports and execute bid changes autonomously.</p>
            {isAdsConnected && (
              <div className="flex items-center gap-2 text-indigo-600 text-[10px] font-black uppercase tracking-widest mt-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                Report Streaming Active
              </div>
            )}
          </div>
          <div className="flex-shrink-0">
            {isAdsConnected ? (
              <button onClick={() => setIsAdsConnected(false)} className="px-6 py-3 border border-red-100 text-red-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-50 transition-all">Disconnect</button>
            ) : (
              <button onClick={handleAdsConnect} disabled={isAdsLoading} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">{isAdsLoading ? 'Authenticating...' : 'Link Ads'}</button>
            )}
          </div>
        </div>

        {/* Helium 10 Connector */}
        <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl flex flex-col md:flex-row gap-10 items-center text-white">
          <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 font-black text-2xl shadow-xl">
             H10
          </div>
          <div className="flex-1 space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-black tracking-tight">Helium 10 Neural Sync</h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">Import Cerebro and Magnet keyword targets. Astra merges H10 search volume with live PPC report telemetry.</p>
          </div>
          <div className="flex-shrink-0">
             <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-50 transition-all">Connect Cerebro</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Integrations;
