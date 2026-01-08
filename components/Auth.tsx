
import React, { useState, useEffect } from 'react';

interface AuthProps {
  onLogin: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      // @ts-ignore
      const exists = await window.aistudio.hasSelectedApiKey();
      setHasKey(exists);
    };
    checkKey();
  }, []);

  const handleKeySelect = async () => {
    // @ts-ignore
    await window.aistudio.openSelectKey();
    setHasKey(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      {/* Navbar */}
      <nav className="w-full px-8 py-6 flex justify-between items-center max-w-7xl">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">A</div>
          <span className="text-2xl font-bold text-slate-800">Astra FBA</span>
        </div>
        <div className="flex gap-6 items-center">
          <a href="#" className="text-slate-600 font-medium hover:text-indigo-600">Pricing</a>
          <a href="#" className="text-slate-600 font-medium hover:text-indigo-600">Features</a>
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="px-6 py-2 border-2 border-slate-200 rounded-xl font-bold hover:border-indigo-600 hover:text-indigo-600 transition-all"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl px-8 pt-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center flex-1">
        <div className="space-y-8">
          <h1 className="text-6xl font-extrabold text-slate-900 leading-tight">
            The AI-First Suite for <span className="text-indigo-600">Amazon FBA Success.</span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Eliminate hours of manual work. High-res product photography, SEO-rich listings, and automated PPC optimization — all in one powerful dashboard.
          </p>
          
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 max-w-md">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">{isLogin ? 'Welcome Back' : 'Get Started Free'}</h2>
            
            {!hasKey ? (
              <div className="space-y-4">
                <p className="text-sm text-slate-500 mb-4">
                  Astra FBA uses high-performance Gemini 3 & Veo models. Please connect your API key to proceed.
                  <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-indigo-600 underline ml-1">Learn about billing</a>
                </p>
                <button 
                  onClick={handleKeySelect}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-3"
                >
                  Connect API Key to Unlock Suite
                </button>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    className="w-full px-4 py-3 bg-white text-slate-900 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 transition-all" 
                    placeholder="sarah@fba.com" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Password</label>
                  <input 
                    type="password" 
                    required 
                    className="w-full px-4 py-3 bg-white text-slate-900 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 transition-all" 
                    placeholder="••••••••" 
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all mt-4"
                >
                  {isLogin ? 'Login to Dashboard' : 'Create My Account'}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-100 rounded-full blur-3xl opacity-50"></div>
          <img 
            src="https://picsum.photos/seed/amazon/1000/1200" 
            className="rounded-[40px] shadow-2xl relative z-10 border-8 border-white"
            alt="Hero Visual"
          />
          <div className="absolute bottom-10 -left-10 bg-white p-6 rounded-2xl shadow-xl z-20 border border-gray-50 max-w-[200px]">
            <p className="text-slate-500 text-xs font-bold uppercase mb-2">ROAS Boost</p>
            <p className="text-3xl font-black text-indigo-600">+145%</p>
            <p className="text-xs text-slate-400 mt-1">AI Optimized PPC</p>
          </div>
        </div>
      </div>

      <footer className="w-full py-12 text-center text-slate-400 text-sm mt-20 border-t">
        © 2025 Astra FBA. Built with Gemini 3 for Amazon Sellers.
      </footer>
    </div>
  );
};

export default Auth;
