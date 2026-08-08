import React from 'react';
import { Database, Eye, Cpu, SearchCode, BarChart3 } from 'lucide-react';

export type TabType = 'database' | 'inspector' | 'scraper' | 'devtools' | 'analytics';

interface NavigationTabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  recordCount: number;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  setActiveTab,
  recordCount,
}) => {
  const tabs = [
    {
      id: 'database' as TabType,
      label: 'Job Ads Master Database',
      icon: Database,
      badge: recordCount,
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    },
    {
      id: 'inspector' as TabType,
      label: 'E-Paper Page Vision Scanner',
      icon: Eye,
      badge: 'Live Vision',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    },
    {
      id: 'scraper' as TabType,
      label: 'Automated Batch Scraper (2024-Present)',
      icon: Cpu,
      badge: 'Multi-Year',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    },
    {
      id: 'devtools' as TabType,
      label: 'InduPaper URL Inspector',
      icon: SearchCode,
    },
    {
      id: 'analytics' as TabType,
      label: 'Jharkhand Hiring Analytics',
      icon: BarChart3,
    },
  ];

  return (
    <div className="bg-slate-900/90 border-b border-slate-800 sticky top-[61px] z-20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-3 overflow-x-auto scrollbar-none py-2" id="navigation-tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                id={`tab-btn-${tab.id}`}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-900/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 text-[10px] font-semibold border rounded-full ${
                      isActive ? 'bg-white/20 text-white border-white/30' : tab.badgeColor
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
