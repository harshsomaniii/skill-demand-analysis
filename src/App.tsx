import React, { useState } from 'react';
import { JobAd } from './types';
import { FULL_HISTORICAL_JOB_ADS } from './data/mockJobData';
import { deduplicateJobs } from './utils/deduplicate';
import { exportJobsToExcelClient } from './utils/excelExporter';
import { Header } from './components/Header';
import { NavigationTabs, TabType } from './components/NavigationTabs';
import { JobDatabaseTable } from './components/JobDatabaseTable';
import { PageVisionInspector } from './components/PageVisionInspector';
import { BatchScraperPanel } from './components/BatchScraperPanel';
import { DevToolsDiscoverer } from './components/DevToolsDiscoverer';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { JobDetailModal } from './components/JobDetailModal';
import { EditJobModal } from './components/EditJobModal';

export default function App() {
  const [jobs, setJobs] = useState<JobAd[]>(() => deduplicateJobs(FULL_HISTORICAL_JOB_ADS));
  const [activeTab, setActiveTab] = useState<TabType>('database');
  const [isExporting, setIsExporting] = useState(false);

  const [viewingJob, setViewingJob] = useState<JobAd | null>(null);
  const [editingJob, setEditingJob] = useState<JobAd | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Manual Deduplication Trigger
  const handleDeduplicate = () => {
    const originalCount = jobs.length;
    const deduped = deduplicateJobs(jobs);
    setJobs(deduped);
    const removed = originalCount - deduped.length;
    if (removed > 0) {
      alert(`Successfully removed ${removed} duplicate job entries! ${deduped.length} unique records remain.`);
    } else {
      alert(`No duplicate entries found. All ${deduped.length} records are already strictly unique.`);
    }
  };

  // Excel export trigger with server & client fallback
  const handleExportExcel = async (subsetJobs?: JobAd[]) => {
    setIsExporting(true);
    const targetList = subsetJobs && subsetJobs.length > 0 ? subsetJobs : jobs;
    try {
      const response = await fetch('/api/export-excel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobs: targetList }),
      });

      if (!response.ok) {
        throw new Error('Server export endpoint unavailable');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Prabhat_Khabar_Job_Ads_2024_to_Present_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      console.warn('Server Excel export failed or running as static deployment. Fallback to client-side Excel generation:', error);
      try {
        await exportJobsToExcelClient(targetList);
      } catch (clientErr: any) {
        console.error('Client Excel export error:', clientErr);
        alert(`Error exporting Excel: ${clientErr.message || 'Export error'}`);
      }
    } finally {
      setIsExporting(false);
    }
  };

  // Add new extracted jobs from vision scanner or batch pipeline
  const handleAddExtractedJobs = (newJobs: JobAd[]) => {
    setJobs((prev) => deduplicateJobs([...newJobs, ...prev]));
  };

  // Record CRUD
  const handleDeleteJob = (id: string) => {
    if (confirm('Are you sure you want to delete this job advertisement record?')) {
      setJobs((prev) => prev.filter((j) => j.id !== id));
    }
  };

  const handleSaveJob = (updatedJob: JobAd) => {
    setJobs((prev) => {
      const exists = prev.some((j) => j.id === updatedJob.id);
      if (exists) {
        return prev.map((j) => (j.id === updatedJob.id ? updatedJob : j));
      } else {
        return [updatedJob, ...prev];
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Header */}
      <Header
        totalCount={jobs.length}
        onExportExcel={() => handleExportExcel()}
        isExporting={isExporting}
      />

      {/* Navigation Tabs */}
      <NavigationTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        recordCount={jobs.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'database' && (
          <JobDatabaseTable
            jobs={jobs}
            onViewJob={(job) => setViewingJob(job)}
            onEditJob={(job) => setEditingJob(job)}
            onDeleteJob={handleDeleteJob}
            onAddJob={() => {
              setEditingJob(null);
              setIsAddModalOpen(true);
            }}
            onExportExcel={handleExportExcel}
            onDeduplicate={handleDeduplicate}
            isExporting={isExporting}
          />
        )}

        {activeTab === 'inspector' && (
          <PageVisionInspector onAddExtractedJobs={handleAddExtractedJobs} />
        )}

        {activeTab === 'scraper' && (
          <BatchScraperPanel
            onAddExtractedJobs={handleAddExtractedJobs}
            onExportExcel={() => handleExportExcel()}
          />
        )}

        {activeTab === 'devtools' && <DevToolsDiscoverer />}

        {activeTab === 'analytics' && <AnalyticsDashboard jobs={jobs} />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/60 border-t border-slate-800 py-4 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Prabhat Khabar E-Paper Job Ad Scraper & Vision Parser — Jharkhand Research Pipeline (2024 to Present)
          </div>
          <div className="text-slate-400 font-mono text-[11px]">
            Columns: Newspaper | Edition | Date | Page | Company | Job Title | Location | Original Ad Text
          </div>
        </div>
      </footer>

      {/* Modals */}
      <JobDetailModal
        job={viewingJob}
        onClose={() => setViewingJob(null)}
      />

      <EditJobModal
        job={editingJob}
        isOpen={isAddModalOpen || editingJob !== null}
        onClose={() => {
          setEditingJob(null);
          setIsAddModalOpen(false);
        }}
        onSave={handleSaveJob}
      />
    </div>
  );
}
