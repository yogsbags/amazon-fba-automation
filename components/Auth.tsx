
import React, { useState, useEffect } from 'react';

interface AuthProps {
  onLogin: () => void;
}

const AstraLogoLarge = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
    <path d="M12 2L3 20H6L12 7L18 20H21L12 2Z" fill="currentColor" />
    <path d="M12 11L9 18H15L12 11Z" fill="currentColor" opacity="0.5" />
    <path d="M2 22H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="4" r="1.5" fill="white" />
  </svg>
);

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M44.5 20H24V29H35.8C34.7 33.9 30.1 37.5 24 37.5C16.5 37.5 10.5 31.5 10.5 24C10.5 16.5 16.5 10.5 24 10.5C27.4 10.5 30.5 11.7 32.9 13.7L39.6 7C35.5 3.3 30.1 1 24 1C11.3 1 1 11.3 1 24C1 36.7 11.3 47 24 47C35.7 47 46 38.4 46 24C46 22.6 45.8 21.3 44.5 20Z" fill="#EA4335"/>
    <path d="M44.5 20H24V29H35.8C34.7 33.9 30.1 37.5 24 37.5C16.5 37.5 10.5 31.5 10.5 24C10.5 16.5 16.5 10.5 24 10.5C27.4 10.5 30.5 11.7 32.9 13.7L39.6 7C35.5 3.3 30.1 1 24 1C11.3 1 1 11.3 1 24C1 36.7 11.3 47 24 47C35.7 47 46 38.4 46 24C46 22.6 45.8 21.3 44.5 20Z" fill="#FBBC05" opacity="0.1"/>
  </svg>
);

const AmazonIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.72 16.8c-.5.4-1.2.6-2 .6-.9 0-1.7-.3-2.3-.9L13 15.1c-.2-.2-.2-.5 0-.7l.7-.7c.2-.2.5-.2.7 0l.9.9c.3.3.7.4 1.1.4.3 0 .7-.1.9-.3l.7-.7c.2-.2.5-.2.7 0l.7.7c.2.2.2.5 0 .7l-1.4 1.4z" fill="#FF9900"/>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#232F3E"/>
    <path d="M15.5 11.5c.3-.5.7-1 1-1.5 1-1.5 2-1 2 0 0 .5-.5 1-1 1.5l-2 1.5-.5-1.5z" fill="#FF9900"/>
  </svg>
);

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      // @ts-ignore
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        const exists = await window.aistudio.hasSelectedApiKey();
        setHasKey(exists);
      }
    };
    checkKey();
  }, []);

  const handleKeySelect = async () => {
    // @ts-ignore
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      await window.aistudio.openSelectKey();
      setHasKey(true);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="top" className="min-h-screen bg-[#f8fafc] flex flex-col items-center selection:bg-indigo-100 selection:text-indigo-700 overflow-x-hidden">
      {/* Sticky Premium Header */}
      <nav className="sticky top-0 w-full px-6 md:px-12 py-5 flex justify-between items-center z-50 bg-[#f8fafc]/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-indigo-200">
            <AstraLogoLarge />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter">Astra FBA</span>
              <span className="px-2 py-0.5 bg-slate-900 text-white text-[10px] font-black rounded-md tracking-widest">AI</span>
            </div>
            <span className="hidden md:block text-[10px] font-bold text-indigo-500 uppercase tracking-widest leading-none mt-1">Autonomous Growth Engine</span>
          </div>
        </div>
        <div className="flex gap-6 md:gap-10 items-center">
          <button 
            onClick={() => scrollToSection('comparison')}
            className="hidden lg:block text-slate-500 font-black hover:text-indigo-600 transition-colors text-[10px] uppercase tracking-widest"
          >
            The Edge
          </button>
          <button 
            onClick={() => scrollToSection('features')}
            className="hidden lg:block text-slate-500 font-black hover:text-indigo-600 transition-colors text-[10px] uppercase tracking-widest"
          >
            Solutions
          </button>
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 md:px-8 py-3 bg-white border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-indigo-600 hover:text-indigo-600 transition-all active:scale-95 shadow-sm"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="w-full max-w-[1600px] px-6 md:px-12 pt-12 md:pt-16 lg:pt-24 grid grid-cols-1 lg:grid-cols-2 gap-24 items-start min-h-[85vh]">
        <div className="space-y-12 relative z-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
               <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
               Neural Core: Active
            </div>
            <h1 className="text-6xl md:text-7xl xl:text-8xl font-black text-slate-900 leading-[1.05] tracking-tighter">
              The World's Best <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Amazon AI.</span>
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed font-medium max-w-xl">
              Astra AI is the first enterprise-grade autonomous engine for FBA. We use proprietary neural architectures to build listings, render studio photography, and optimize PPC while you scale.
            </p>
          </div>
          
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-indigo-100/50 border border-slate-100 max-w-lg relative">
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white text-3xl shadow-xl shadow-indigo-200 rotate-12">🧠</div>
            
            <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">{isLogin ? 'Access AI Dashboard' : 'Deploy Your AI Fleet'}</h2>
            
            {!hasKey ? (
              <div className="space-y-6">
                <p className="text-sm text-slate-400 font-medium leading-relaxed">
                  Astra AI requires a high-throughput API handshake. Link your Gemini Pro key to activate the neural pipelines.
                </p>
                <button 
                  onClick={handleKeySelect}
                  className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-black shadow-2xl shadow-slate-200 transition-all flex items-center justify-center gap-4 group"
                >
                  Link AI Access Key
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </button>
                <div className="text-center">
                  <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-[10px] text-slate-400 font-black uppercase tracking-widest hover:text-indigo-600 underline">AI Billing Docs</a>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Social Login Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                    onClick={onLogin}
                    className="flex items-center justify-center gap-3 px-6 py-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-indigo-200 transition-all group shadow-sm active:scale-95"
                  >
                    <GoogleIcon />
                    <span className="text-sm font-black text-slate-700 uppercase tracking-tighter whitespace-nowrap">Continue with Gmail</span>
                  </button>
                  <button 
                    onClick={onLogin}
                    className="flex items-center justify-center gap-3 px-6 py-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-amber-200 transition-all group shadow-sm active:scale-95"
                  >
                    <AmazonIcon />
                    <span className="text-sm font-black text-slate-700 uppercase tracking-tighter whitespace-nowrap">Login with Amazon</span>
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-slate-100"></div>
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">or continue with email</span>
                  <div className="flex-1 h-px bg-slate-100"></div>
                </div>

                <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">email</label>
                    <input 
                      type="email" 
                      required 
                      className="w-full px-6 py-4 bg-slate-50 text-slate-900 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-300 transition-all font-semibold" 
                      placeholder="sarah@astra.fba.ai" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">password</label>
                    <input 
                      type="password" 
                      required 
                      className="w-full px-6 py-4 bg-slate-50 text-slate-900 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-300 transition-all font-semibold" 
                      placeholder="••••••••" 
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 shadow-2xl shadow-indigo-100 transition-all mt-4 active:scale-95"
                  >
                    {isLogin ? 'Initiate AI Interface' : 'Deploy Global AI'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        <div className="relative hidden lg:block perspective-1000 mt-12">
          <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-indigo-100 rounded-full blur-[120px] opacity-40 animate-pulse"></div>
          <div className="relative z-10 p-4 bg-white/50 backdrop-blur-2xl border border-white rounded-[4rem] shadow-2xl overflow-hidden group">
            <img 
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2000&auto=format&fit=crop" 
              className="rounded-[3.5rem] shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
              alt="Hero Visual"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/40 to-transparent"></div>
            
            <div className="absolute top-12 left-12 glass-panel p-6 rounded-3xl shadow-2xl animate-bounce duration-[3000ms]">
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-1">AI ROAS Score</p>
              <p className="text-4xl font-black text-slate-900">8.4x</p>
            </div>
            
            <div className="absolute bottom-12 right-12 glass-panel p-6 rounded-3xl shadow-2xl animate-pulse">
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-1">Autonomous AI Health</p>
              <div className="flex gap-1">
                 {[1,2,3,4,5].map(i => <div key={i} className="w-2 h-8 bg-indigo-500 rounded-full"></div>)}
                 <div className="w-2 h-8 bg-slate-200 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section (Astra vs Helium 10) */}
      <section id="comparison" className="w-full bg-slate-900 py-32 border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="max-w-[1600px] px-6 md:px-12 mx-auto space-y-24 relative z-10">
           <div className="text-center space-y-6">
              <h2 className="text-xs font-black text-indigo-400 uppercase tracking-[0.5em]">The Neural Advantage</h2>
              <h3 className="text-5xl md:text-7xl font-black text-white tracking-tighter">Astra AI vs. Legacy Tooling</h3>
              <p className="text-slate-400 font-medium text-xl max-w-2xl mx-auto">Stop using data spreadsheets from 2015. Move to autonomous neural architectures.</p>
           </div>

           <div className="grid grid-cols-1 gap-4">
              {/* Header Row */}
              <div className="hidden md:grid grid-cols-12 gap-8 px-12 py-6 border-b border-white/10 text-slate-500 font-black uppercase tracking-widest text-[10px]">
                 <div className="col-span-4">Enterprise Capability</div>
                 <div className="col-span-4 text-indigo-400">Astra FBA AI (Neural)</div>
                 <div className="col-span-4">Helium 10 (Legacy)</div>
              </div>

              {[
                {
                  feat: "Product Visualization",
                  astra: "Autonomous 7-Image Studio + 4K Veo Video from a single seed photo. Generative AI technology.",
                  h10: "No generative capabilities. Requires external photographer and manual editing tools.",
                  status: "winner"
                },
                {
                  feat: "SEO & Listing Copy",
                  astra: "Multimodal Vision (AI sees your product) + Real-time search grounding for viral trends.",
                  h10: "Static keyword stuffing using historical data only. No visual awareness of product features.",
                  status: "winner"
                },
                {
                  feat: "PPC Optimization",
                  astra: "Autonomous Neural Autopilot. Bid adjustments every 5s based on real-time ROAS telemetry.",
                  h10: "Manual rule-based system (Adtomic). Requires human input to define bidding thresholds.",
                  status: "winner"
                },
                {
                  feat: "Market Intel",
                  astra: "Automated Strategy Summaries. AI summarizes competitor gaps into executable actions.",
                  h10: "Raw data spreadsheets. Requires hours of manual 'Xray' analysis to find insights.",
                  status: "winner"
                }
              ].map((row, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-8 px-12 py-12 bg-white/5 rounded-[2rem] border border-white/5 hover:bg-white/10 transition-colors group">
                   <div className="md:col-span-4">
                      <h4 className="text-xl font-black text-white mb-2">{row.feat}</h4>
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(dot => <div key={dot} className={`w-1.5 h-1.5 rounded-full ${dot <= 5-i ? 'bg-indigo-500' : 'bg-white/10'}`}></div>)}
                      </div>
                   </div>
                   <div className="md:col-span-4 border-l border-white/10 md:pl-8 space-y-4">
                      <div className="flex items-center gap-2 text-indigo-400 font-black text-[10px] uppercase tracking-widest">
                         <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                         Autonomous Neural Mode
                      </div>
                      <p className="text-white font-bold leading-relaxed">{row.astra}</p>
                   </div>
                   <div className="md:col-span-4 border-l border-white/10 md:pl-8 space-y-4 opacity-40 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-2 text-slate-500 font-black text-[10px] uppercase tracking-widest">
                         Manual Tooling
                      </div>
                      <p className="text-slate-400 font-medium leading-relaxed">{row.h10}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full max-w-[1600px] px-6 md:px-12 py-32 space-y-24">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.4em]">Autonomous Ecosystem</h2>
          <h3 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter">Everything you need to <br/> dominate the marketplace.</h3>
          <p className="text-slate-500 font-medium text-lg">Astra AI integrates every critical FBA function into a single, cohesive neural network.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "AI Asset Studio",
              desc: "Generate 7 high-res product images and a 4K cinematic video using Veo 3.1 & Gemini 3 Vision. Professional studio quality without the studio.",
              icon: "📸",
              accent: "bg-indigo-600"
            },
            {
              title: "SEO Listing Wizard",
              desc: "Write high-converting, SEO-rich titles and bullets automatically. Our AI reads search trends in real-time to ensure maximum visibility.",
              icon: "✍️",
              accent: "bg-violet-600"
            },
            {
              title: "PPC Optimization Engine",
              desc: "Let our autonomous engine manage your bids. Achieve target ACoS without lifting a finger by leveraging live keyword telemetry.",
              icon: "📊",
              accent: "bg-slate-900"
            },
            {
              title: "Competitor Intelligence",
              desc: "Uncover hidden competitor strategies. Our AI scans the top 50 ASINs in your category to find keyword gaps and visual advantages.",
              icon: "🕵️",
              accent: "bg-indigo-500"
            },
            {
              title: "Inventory Forecasting",
              desc: "Never go out of stock again. Predictive modeling ensures your inventory levels match seasonal peaks and trending spikes.",
              icon: "📦",
              accent: "bg-emerald-600"
            },
            {
              title: "Global Marketplace Sync",
              desc: "One click to rule them all. Push your AI-optimized assets across Amazon US, UK, EU, and JP marketplaces instantly.",
              icon: "🌍",
              accent: "bg-amber-500"
            }
          ].map((feat, i) => (
            <div key={i} className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500 group relative overflow-hidden">
               <div className={`absolute top-0 right-0 w-32 h-32 opacity-5 blur-[40px] rounded-full translate-x-10 -translate-y-10 ${feat.accent}`}></div>
               <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                 {feat.icon}
               </div>
               <h4 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{feat.title}</h4>
               <p className="text-slate-500 font-medium leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Modern Deep Footer */}
      <footer className="w-full bg-white border-t border-slate-200/60 mt-20">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-16 lg:py-24">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 lg:gap-8">
            {/* Branding Column */}
            <div className="col-span-2 md:col-span-3 lg:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <AstraLogoLarge />
                </div>
                <span className="text-2xl font-black text-slate-900 tracking-tighter cursor-pointer" onClick={() => scrollToSection('top')}>Astra FBA</span>
              </div>
              <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xs">
                The world's most advanced autonomous neural engine for Amazon FBA entrepreneurs. Scaling profit through predictive AI.
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  Neural System: Operational
                </div>
              </div>
            </div>

            {/* Link Columns */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Platform</h4>
              <ul className="space-y-4">
                {[
                  { name: 'Overview', id: 'top' },
                  { name: 'Asset Studio', id: 'features' },
                  { name: 'PPC Engine', id: 'features' },
                  { name: 'Listing Wizard', id: 'features' }
                ].map(link => (
                  <li key={link.name}>
                    <button 
                      onClick={() => scrollToSection(link.id)}
                      className="text-sm text-slate-500 hover:text-indigo-600 font-medium transition-colors text-left"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Resources</h4>
              <ul className="space-y-4">
                {[
                  { name: 'Documentation', url: 'https://ai.google.dev/gemini-api/docs' },
                  { name: 'API Guide', url: 'https://ai.google.dev/gemini-api/docs/quickstart' },
                  { name: 'FBA Case Studies', url: 'https://sell.amazon.com/blog' },
                  { name: 'Neural Roadmap', id: 'comparison' }
                ].map(link => (
                  <li key={link.name}>
                    {link.url ? (
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-sm text-slate-500 hover:text-indigo-600 font-medium transition-colors"
                      >
                        {link.name}
                      </a>
                    ) : (
                      <button 
                        onClick={() => link.id && scrollToSection(link.id)}
                        className="text-sm text-slate-500 hover:text-indigo-600 font-medium transition-colors text-left"
                      >
                        {link.name}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Connect</h4>
              <ul className="space-y-4">
                {[
                  { name: 'Twitter / X', url: 'https://twitter.com' },
                  { name: 'LinkedIn', url: 'https://linkedin.com' },
                  { name: 'Support Hub', url: 'mailto:support@astra-fba.ai' },
                  { name: 'Market News', url: 'https://techcrunch.com' }
                ].map(link => (
                  <li key={link.name}>
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm text-slate-500 hover:text-indigo-600 font-medium transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Legal</h4>
              <ul className="space-y-4">
                {[
                  { name: 'Privacy Policy', url: 'https://www.google.com/policies/privacy/' },
                  { name: 'Terms of Service', url: 'https://www.google.com/policies/terms/' },
                  { name: 'Cookie Usage', url: 'https://www.google.com/policies/technologies/cookies/' },
                  { name: 'Data Security', url: 'https://ai.google.dev/gemini-api/docs/security' }
                ].map(link => (
                  <li key={link.name}>
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm text-slate-500 hover:text-indigo-600 font-medium transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-16 lg:mt-24 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              © 2025 Astra FBA AI. Built with Gemini 3 Neural Architectures.
            </p>
            <div className="flex items-center gap-8">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global FBA Compliance V2.4</span>
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-slate-50 rounded-lg border border-slate-200"></div>
                <div className="w-8 h-8 bg-slate-50 rounded-lg border border-slate-200"></div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Auth;
