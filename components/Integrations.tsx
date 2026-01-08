
import React, { useState } from 'react';

const Integrations: React.FC = () => {
  const [isAmazonConnected, setIsAmazonConnected] = useState(false);
  const [merchantId, setMerchantId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = () => {
    setIsLoading(true);
    // Simulate Amazon OAuth flow
    setTimeout(() => {
      setIsAmazonConnected(true);
      setMerchantId('AMZN-MKT-9283-FBA');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">API Integrations</h1>
        <p className="text-slate-500">Connect your Amazon Seller accounts to enable direct syncing of AI assets and PPC optimization.</p>
      </header>

      <div className="space-y-6">
        {/* Amazon Selling Partner API */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-8 items-center">
          <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center flex-shrink-0">
             <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" className="w-12" alt="Amazon" />
          </div>
          <div className="flex-1 space-y-2 text-center md:text-left">
            <h3 className="text-xl font-bold text-slate-800">Amazon Selling Partner (SP-API)</h3>
            <p className="text-slate-500 text-sm">Required for pushing high-res images, infographics, and SEO listing content directly to FBA.</p>
            {isAmazonConnected && (
              <div className="flex items-center gap-2 text-green-600 text-xs font-bold uppercase tracking-wider mt-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Connected: {merchantId}
              </div>
            )}
          </div>
          <div className="flex-shrink-0">
            {isAmazonConnected ? (
              <button 
                onClick={() => setIsAmazonConnected(false)}
                className="px-6 py-2 border-2 border-red-100 text-red-600 rounded-xl font-bold hover:bg-red-50 transition-all"
              >
                Disconnect
              </button>
            ) : (
              <button 
                onClick={handleConnect}
                disabled={isLoading}
                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
              >
                {isLoading ? 'Connecting...' : 'Link Store'}
              </button>
            )}
          </div>
        </div>

        {/* Amazon Advertising API */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-8 items-center">
          <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0 text-3xl">
             📢
          </div>
          <div className="flex-1 space-y-2 text-center md:text-left">
            <h3 className="text-xl font-bold text-slate-800">Amazon Advertising API</h3>
            <p className="text-slate-500 text-sm">Required for the AI PPC Engine to read keyword performance and adjust bids in real-time.</p>
          </div>
          <div className="flex-shrink-0">
             <button className="px-8 py-3 bg-slate-100 text-slate-400 rounded-xl font-bold cursor-not-allowed">
                Coming Soon
             </button>
          </div>
        </div>

        {/* Helium 10 Connector */}
        <div className="bg-slate-900 p-8 rounded-2xl shadow-xl flex flex-col md:flex-row gap-8 items-center text-white">
          <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 font-black text-2xl">
             H10
          </div>
          <div className="flex-1 space-y-2 text-center md:text-left">
            <h3 className="text-xl font-bold">Helium 10 Sync</h3>
            <p className="text-slate-400 text-sm">Import your Cerebro keyword lists and Magnet research directly into Astra AI.</p>
          </div>
          <div className="flex-shrink-0">
             <button className="px-8 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-indigo-50 transition-all">
                Connect H10
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Integrations;
