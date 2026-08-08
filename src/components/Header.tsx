import React from 'react';
import { Newspaper, FileSpreadsheet, Bot, ExternalLink, Database } from 'lucide-react';

interface HeaderProps {
  totalCount: number;
  onExportExcel: () => void;
  isExporting: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  totalCount,
  onExportExcel,
  isExporting,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 shrink-0">
              <Newspaper className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-100">
                  Prabhat Khabar E-Paper Job Extraction
                </h1>
                <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Jharkhand Pipeline
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Automated Recruitment Scraper & Gemini Vision AI Parser (2024 – Present)
              </p>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-3 bg-slate-800/80 px-3.5 py-1.5 rounded-lg border border-slate-700/60 text-xs">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Database className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-slate-400">Total Ads:</span>
                <span className="font-bold text-white text-sm">{totalCount}</span>
              </div>
              <div className="h-4 w-px bg-slate-700"></div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Bot className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-slate-400">AI:</span>
                <span className="font-semibold text-cyan-300">Gemini 3.6 Vision</span>
              </div>
            </div>

            {/* InduPaper Free E-Paper Portal Button */}
            <a
              href="https://www.indupaper.com/"
              target="_blank"
              rel="noopener noreferrer"
              id="indupaper-portal-btn"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-sm shadow-amber-900/30 cursor-pointer"
              title="Open InduPaper Portal - Subscription-free online e-paper viewer"
            >
              <Newspaper className="w-4 h-4 text-slate-950" />
              <span>InduPaper (Free Portal)</span>
              <ExternalLink className="w-3 h-3 text-slate-900" />
            </a>

            <button
              onClick={onExportExcel}
              disabled={isExporting || totalCount === 0}
              id="export-excel-header-btn"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50 text-white font-medium text-xs rounded-lg transition-all shadow-sm shadow-emerald-900/30 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              {isExporting ? 'Generating Excel...' : 'Export to Excel (.xlsx)'}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

