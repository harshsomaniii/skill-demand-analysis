import React from 'react';
import { JobAd } from '../types';
import { BarChart3, Building2, MapPin, Calendar, PieChart, ShieldCheck } from 'lucide-react';

interface AnalyticsDashboardProps {
  jobs: JobAd[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ jobs }) => {
  // Category counts
  const categoryCounts = jobs.reduce((acc, job) => {
    const cat = job.category || 'Classifieds / Other';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // City counts
  const cityCounts = jobs.reduce((acc, job) => {
    const ed = job.edition || 'Unknown Edition';
    acc[ed] = (acc[ed] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Year counts
  const yearCounts = jobs.reduce((acc, job) => {
    const yr = job.date ? job.date.substring(0, 4) : 'Unknown';
    acc[yr] = (acc[yr] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Top hiring organizations
  const companyCounts = jobs.reduce((acc, job) => {
    const comp = job.company || 'Unknown';
    acc[comp] = (acc[comp] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedCompanies = Object.entries(companyCounts)
    .sort((a, b) => Number(b[1]) - Number(a[1]))
    .slice(0, 8);

  const totalJobsCount = Math.max(jobs.length, 1);

  return (
    <div className="space-y-6">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Extracted Ads</span>
            <BarChart3 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{jobs.length}</div>
          <div className="text-[11px] text-emerald-400">Jharkhand Newspaper Pipeline</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>2026 Year-to-Date Ads</span>
            <Calendar className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{yearCounts['2026'] || 0}</div>
          <div className="text-[11px] text-slate-400">Current Year Records</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>2025 Historical Records</span>
            <Calendar className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{yearCounts['2025'] || 0}</div>
          <div className="text-[11px] text-slate-400">Archived E-Paper Scans</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>2024 Historical Records</span>
            <Calendar className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{yearCounts['2024'] || 0}</div>
          <div className="text-[11px] text-slate-400">Archived E-Paper Scans</div>
        </div>
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Organizations */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-semibold text-slate-200">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-indigo-400" />
              Top Hiring Bodies in Jharkhand (2024-Present)
            </span>
            <span className="text-slate-400">Frequency</span>
          </div>

          <div className="space-y-2 text-xs">
            {sortedCompanies.map(([comp, count], i) => {
              const numCount = Number(count);
              const pct = Math.min((numCount / totalJobsCount) * 100 * 3, 100);
              return (
                <div key={i} className="flex items-center justify-between p-2 bg-slate-950 rounded-lg border border-slate-800/80">
                  <div className="font-medium text-slate-200 truncate max-w-xs">{comp}</div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold shrink-0">{numCount}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sector Category Distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-semibold text-slate-200">
            <span className="flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-cyan-400" />
              Recruitment Sector Distribution
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {Object.entries(categoryCounts).map(([cat, count], i) => {
              const numCount = Number(count);
              const pct = Math.round((numCount / totalJobsCount) * 100);
              return (
                <div key={i} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                  <div className="flex justify-between font-medium text-slate-200">
                    <span>{cat}</span>
                    <span className="font-mono text-cyan-400 font-bold">{numCount} ads ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
