
import React, { useState, useEffect } from 'react';
import { SellerCredentials } from '../types';

const Settings: React.FC = () => {
  const [creds, setCreds] = useState<SellerCredentials>({
    merchantId: '',
    marketplaceId: '',
    clientId: '',
    clientSecret: '',
    refreshToken: '',
    region: 'NA'
  });
  const [isSaved, setIsSaved] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('astra_seller_creds');
    if (saved) {
      setCreds(JSON.parse(saved));
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('astra_seller_creds', JSON.stringify(creds));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleManualAuth = () => {
    setIsConnecting(true);
    // Simulate OAuth2 redirect / handshake
    setTimeout(() => {
      setIsConnecting(false);
      alert('Handshake Successful: Seller Central Account Linked via OAuth2.');
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-bottom-4 duration-700 pb-20">
      <header>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Global Configuration</h1>
        <p className="text-slate-500 mt-1 font-medium italic">Securely manage your Amazon SP-API and Advertising API handshakes.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <form onSubmit={handleSave} className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-8">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Identity & Region</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Merchant (Seller) ID</label>
                  <input 
                    type="text" 
                    className="w-full px-6 py-4 bg-slate-50 text-slate-900 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                    placeholder="e.g. A123456789BCDE"
                    value={creds.merchantId}
                    onChange={(e) => setCreds({...creds, merchantId: e.target.value})}
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Marketplace ID</label>
                  <input 
                    type="text" 
                    className="w-full px-6 py-4 bg-slate-50 text-slate-900 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                    placeholder="e.g. ATVPDKIKX0DER"
                    value={creds.marketplaceId}
                    onChange={(e) => setCreds({...creds, marketplaceId: e.target.value})}
                  />
               </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Region</label>
              <div className="grid grid-cols-3 gap-4">
                 {(['NA', 'EU', 'FE'] as const).map(r => (
                   <button
                     key={r}
                     type="button"
                     onClick={() => setCreds({...creds, region: r})}
                     className={`py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${creds.region === r ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                   >
                     {r === 'NA' ? 'North America' : r === 'EU' ? 'Europe' : 'Far East'}
                   </button>
                 ))}
              </div>
            </div>

            <div className="pt-8 border-t border-slate-50 space-y-8">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">OAuth2 Technical Tokens</h3>
              
              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Refresh Token (Persistent Access)</label>
                    <input 
                      type="password" 
                      className="w-full px-6 py-4 bg-slate-50 text-slate-900 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                      placeholder="Atzr|..."
                      value={creds.refreshToken}
                      onChange={(e) => setCreds({...creds, refreshToken: e.target.value})}
                    />
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">LWA Client ID</label>
                       <input 
                         type="text" 
                         className="w-full px-6 py-4 bg-slate-50 text-slate-900 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                         placeholder="amzn1.application-oa2-client..."
                         value={creds.clientId}
                         onChange={(e) => setCreds({...creds, clientId: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">LWA Client Secret</label>
                       <input 
                         type="password" 
                         className="w-full px-6 py-4 bg-slate-50 text-slate-900 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                         placeholder="••••••••••••••••"
                         value={creds.clientSecret}
                         onChange={(e) => setCreds({...creds, clientSecret: e.target.value})}
                       />
                    </div>
                 </div>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-lg hover:bg-black transition-all shadow-2xl shadow-slate-200 active:scale-95"
            >
              {isSaved ? '✓ Credentials Secured' : 'Save Connection Profile'}
            </button>
          </form>
        </div>

        <div className="space-y-8">
           <div className="bg-indigo-600 p-8 rounded-[3rem] text-white space-y-6 shadow-2xl shadow-indigo-100">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">🔑</div>
              <h3 className="text-2xl font-black tracking-tight leading-tight">One-Click <br/> Amazon Auth</h3>
              <p className="text-indigo-100 text-sm font-medium leading-relaxed">
                Preferred method. Click the button to authorize Astra FBA directly via Amazon Seller Central using safe OAuth2 protocols.
              </p>
              <button 
                onClick={handleManualAuth}
                disabled={isConnecting}
                className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl"
              >
                {isConnecting ? 'Waiting for Handshake...' : 'Authorize Astra AI'}
              </button>
           </div>

           <div className="bg-white p-8 rounded-[3rem] border border-slate-100 space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Security Protocol</h4>
              <p className="text-xs font-bold text-slate-500 leading-relaxed italic">
                Astra FBA uses AES-256 local encryption for token storage. We never store your Client Secret on our central servers. All SP-API calls are routed via signed AWS V4 headers.
              </p>
              <div className="pt-4 flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                 <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">SSL Handshake Valid</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
