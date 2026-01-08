
import React, { useState } from 'react';
import { ViewType } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ImageStudio from './components/ImageStudio';
import ListingWriter from './components/ListingWriter';
import CompetitorAnalysis from './components/CompetitorAnalysis';
import KeywordResearch from './components/KeywordResearch';
import PPCOptimizer from './components/PPCOptimizer';
import Integrations from './components/Integrations';
import SourcingLab from './components/SourcingLab';
import InnovationLab from './components/InnovationLab';
import ViralAgent from './components/ViralAgent';
import TrendSniper from './components/TrendSniper';
import BrandingStudio from './components/BrandingStudio';
import StorePageBuilder from './components/StorePageBuilder';
import UGCGenerator from './components/UGCGenerator';
import TikTokFinder from './components/TikTokFinder';
import Settings from './components/Settings';
import PackagingStudio from './components/PackagingStudio';
import Auth from './components/Auth';
import ChatAgent from './components/ChatAgent';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.DASHBOARD);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <Auth onLogin={() => setIsAuthenticated(true)} />;
  }

  const renderView = () => {
    switch (currentView) {
      case ViewType.DASHBOARD:
        return <Dashboard />;
      case ViewType.IMAGE_STUDIO:
        return <ImageStudio />;
      case ViewType.LISTING_WRITER:
        return <ListingWriter />;
      case ViewType.BRANDING_STUDIO:
        return <BrandingStudio />;
      case ViewType.STORE_BUILDER:
        return <StorePageBuilder />;
      case ViewType.UGC_GENERATOR:
        return <UGCGenerator />;
      case ViewType.TIKTOK_FINDER:
        return <TikTokFinder />;
      case ViewType.SOURCING_LAB:
        return <SourcingLab />;
      case ViewType.INNOVATION_LAB:
        return <InnovationLab />;
      case ViewType.VIRAL_AGENT:
        return <ViralAgent />;
      case ViewType.TREND_SNIPER:
        return <TrendSniper />;
      case ViewType.COMPETITOR_ANALYSIS:
        return <CompetitorAnalysis />;
      case ViewType.KEYWORD_RESEARCH:
        return <KeywordResearch />;
      case ViewType.PPC_OPTIMIZER:
        return <PPCOptimizer />;
      case ViewType.INTEGRATIONS:
        return <Integrations />;
      case ViewType.SETTINGS:
        return <Settings />;
      case ViewType.PACKAGING_STUDIO:
        return <PackagingStudio />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        onLogout={() => setIsAuthenticated(false)} 
      />
      
      <main className="flex-1 ml-72 min-h-screen relative overflow-x-hidden">
        {/* Internal Sticky Top Bar (Global for Dashboard) */}
        <div className="sticky top-0 z-40 w-full px-8 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200/50 flex justify-between items-center">
           <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Current Logic Path:</span>
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">{currentView.replace('_', ' ')}</span>
           </div>
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Neural Sync: Live</span>
              </div>
              <div className="h-4 w-px bg-slate-200"></div>
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-black text-white">SF</div>
                 <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Sarah F.</span>
              </div>
           </div>
        </div>

        <div className="p-8 pb-32">
          {renderView()}
        </div>
        
        <ChatAgent />
      </main>
    </div>
  );
};

export default App;
