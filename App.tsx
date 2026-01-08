
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
import Auth from './components/Auth';

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
      case ViewType.COMPETITOR_ANALYSIS:
        return <CompetitorAnalysis />;
      case ViewType.KEYWORD_RESEARCH:
        return <KeywordResearch />;
      case ViewType.PPC_OPTIMIZER:
        return <PPCOptimizer />;
      case ViewType.INTEGRATIONS:
        return <Integrations />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        onLogout={() => setIsAuthenticated(false)} 
      />
      <main className="flex-1 ml-64 min-h-screen">
        <div className="p-4 md:p-8">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
