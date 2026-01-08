
import React from 'react';
import { ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, onLogout }) => {
  const navItems = [
    { id: ViewType.DASHBOARD, label: 'Dashboard', icon: '📊' },
    { id: ViewType.IMAGE_STUDIO, label: 'AI Image Studio', icon: '🎨' },
    { id: ViewType.LISTING_WRITER, label: 'Listing Wizard', icon: '✍️' },
    { id: ViewType.COMPETITOR_ANALYSIS, label: 'Competitor Intelligence', icon: '🕵️' },
    { id: ViewType.KEYWORD_RESEARCH, label: 'Keyword Research', icon: '🔍' },
    { id: ViewType.PPC_OPTIMIZER, label: 'PPC Engine', icon: '💰' },
    { id: ViewType.INTEGRATIONS, label: 'Integrations', icon: '🔌' },
  ];

  return (
    <div className="w-64 bg-white border-r h-screen flex flex-col fixed left-0 top-0 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
          <span className="text-xl font-bold text-slate-800">Astra FBA</span>
        </div>
        
        <nav className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                currentView === item.id 
                  ? 'bg-indigo-50 text-indigo-700 font-semibold' 
                  : 'text-slate-500 hover:bg-gray-50'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t">
        <button 
          onClick={onLogout}
          className="w-full px-4 py-2 text-slate-500 hover:text-red-600 flex items-center gap-2 transition-colors"
        >
          <span>🚪</span> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
