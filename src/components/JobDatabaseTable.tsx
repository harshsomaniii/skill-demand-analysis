import React, { useState, useMemo, useEffect } from 'react';
import { JobAd } from '../types';
import { getInduPaperUrl, getOfficialEpaperUrl } from '../utils/urlHelper';
import {
  Search,
  Filter,
  FileSpreadsheet,
  Eye,
  Trash2,
  Edit2,
  Plus,
  Building2,
  MapPin,
  Calendar,
  FileText,
  Tag,
  CheckSquare,
  Square,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ExternalLink,
  Newspaper,
  ShieldCheck,
} from 'lucide-react';

interface JobDatabaseTableProps {
  jobs: JobAd[];
  onViewJob: (job: JobAd) => void;
  onEditJob: (job: JobAd) => void;
  onDeleteJob: (id: string) => void;
  onAddJob: () => void;
  onExportExcel: (selectedJobs?: JobAd[]) => void;
  onDeduplicate: () => void;
  isExporting: boolean;
}

export const JobDatabaseTable: React.FC<JobDatabaseTableProps> = ({
  jobs,
  onViewJob,
  onEditJob,
  onDeleteJob,
  onAddJob,
  onExportExcel,
  onDeduplicate,
  isExporting,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedEdition, setSelectedEdition] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);

  // Filter logic
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Year filter
      if (selectedYear !== 'all') {
        if (!job.date || !job.date.startsWith(selectedYear)) return false;
      }

      // Edition filter
      if (selectedEdition !== 'all') {
        if (!job.edition || !job.edition.toLowerCase().includes(selectedEdition.toLowerCase())) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'all') {
        if (!job.category || job.category !== selectedCategory) return false;
      }

      // Search term
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchCompany = job.company?.toLowerCase().includes(query);
        const matchTitle = job.job_title?.toLowerCase().includes(query);
        const matchLocation = job.job_location?.toLowerCase().includes(query);
        const matchAd = job.original_advertisement?.toLowerCase().includes(query);
        const matchEdition = job.edition?.toLowerCase().includes(query);
        const matchDate = job.date?.toLowerCase().includes(query);
        const matchPage = job.page_number?.toLowerCase().includes(query);

        if (!matchCompany && !matchTitle && !matchLocation && !matchAd && !matchEdition && !matchDate && !matchPage) {
          return false;
        }
      }

      return true;
    });
  }, [jobs, searchTerm, selectedYear, selectedEdition, selectedCategory]);

  // Reset to page 1 on search or filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedYear, selectedEdition, selectedCategory, pageSize]);

  // Calculate paginated slice
  const totalPages = useMemo(() => {
    if (pageSize === -1) return 1;
    return Math.max(1, Math.ceil(filteredJobs.length / pageSize));
  }, [filteredJobs.length, pageSize]);

  const paginatedJobs = useMemo(() => {
    if (pageSize === -1) return filteredJobs;
    const start = (currentPage - 1) * pageSize;
    return filteredJobs.slice(start, start + pageSize);
  }, [filteredJobs, currentPage, pageSize]);

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedIds.size === filteredJobs.length && filteredJobs.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredJobs.map((j) => j.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const handleExportSelected = () => {
    if (selectedIds.size === 0) {
      onExportExcel(filteredJobs);
    } else {
      const selectedList = jobs.filter((j) => selectedIds.has(j.id));
      onExportExcel(selectedList);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search company, job title, location, text..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              id="job-search-input"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={onDeduplicate}
              id="deduplicate-jobs-btn"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs rounded-lg transition cursor-pointer"
              title="Remove any duplicate job postings based on title and company"
            >
              <Trash2 className="w-4 h-4 text-rose-400" />
              Remove Duplicates
            </button>

            <button
              onClick={onAddJob}
              id="add-manual-job-btn"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs rounded-lg transition cursor-pointer"
            >
              <Plus className="w-4 h-4 text-blue-400" />
              Add Record
            </button>

            <button
              onClick={handleExportSelected}
              disabled={isExporting || filteredJobs.length === 0}
              id="export-filtered-excel-btn"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50 text-white font-medium text-xs rounded-lg transition cursor-pointer shadow-sm shadow-emerald-900/40"
            >
              <FileSpreadsheet className="w-4 h-4" />
              {selectedIds.size > 0
                ? `Export Selected (${selectedIds.size}) to Excel`
                : `Export Filtered (${filteredJobs.length}) to Excel`}
            </button>
          </div>

        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-3 flex-wrap pt-2 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 font-medium">
            <Filter className="w-3.5 h-3.5 text-blue-400" />
            <span>Filters:</span>
          </div>

          {/* Year Filter */}
          <div className="flex items-center gap-1">
            <span className="text-slate-500">Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              id="filter-year-select"
              className="bg-slate-950 border border-slate-800 text-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Years (2024-2026)</option>
              <option value="2026">2026 (Current)</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>

          {/* Edition Filter */}
          <div className="flex items-center gap-1">
            <span className="text-slate-500">Edition:</span>
            <select
              value={selectedEdition}
              onChange={(e) => setSelectedEdition(e.target.value)}
              id="filter-edition-select"
              className="bg-slate-950 border border-slate-800 text-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Jharkhand Editions</option>
              <option value="ranchi">Ranchi</option>
              <option value="dhanbad">Dhanbad</option>
              <option value="jamshedpur">Jamshedpur</option>
              <option value="deoghar">Deoghar / Santhal</option>
              <option value="bokaro">Bokaro</option>
              <option value="hazaribagh">Hazaribagh</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1">
            <span className="text-slate-500">Sector:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              id="filter-category-select"
              className="bg-slate-950 border border-slate-800 text-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Sectors</option>
              <option value="Government / PSU">Government / PSU</option>
              <option value="Education & Academic">Education & Academic</option>
              <option value="Healthcare & Hospitals">Healthcare & Hospitals</option>
              <option value="Private Sector">Private Sector</option>
              <option value="Banking & Finance">Banking & Finance</option>
            </select>
          </div>

          {/* Stats indicator */}
          <div className="ml-auto text-slate-400 text-xs font-mono">
            Showing <span className="text-white font-semibold">{filteredJobs.length}</span> of {jobs.length} records
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse" id="job-master-table">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="p-3 w-10 text-center">
                  <button
                    onClick={toggleSelectAll}
                    id="select-all-checkbox"
                    className="text-slate-400 hover:text-white cursor-pointer"
                    title="Select all"
                  >
                    {selectedIds.size === filteredJobs.length && filteredJobs.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-blue-400" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="p-3 min-w-[130px]">Newspaper & Edition</th>
                <th className="p-3 min-w-[100px]">Date & Page</th>
                <th className="p-3 min-w-[180px]">Company / Organization</th>
                <th className="p-3 min-w-[180px]">Job Title / Role</th>
                <th className="p-3 min-w-[130px]">Location</th>
                <th className="p-3 min-w-[280px]">Original Advertisement</th>
                <th className="p-3 min-w-[120px]">Category</th>
                <th className="p-3 text-right w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="w-8 h-8 text-slate-600" />
                      <p className="text-sm font-medium text-slate-400">No recruitment advertisements found matching your filter criteria.</p>
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedYear('all');
                          setSelectedEdition('all');
                          setSelectedCategory('all');
                        }}
                        className="text-xs text-blue-400 hover:underline mt-1 cursor-pointer"
                      >
                        Reset all filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedJobs.map((job) => {
                  const isSelected = selectedIds.has(job.id);
                  return (
                    <tr
                      key={job.id}
                      className={`hover:bg-slate-800/50 transition-colors ${
                        isSelected ? 'bg-blue-950/20' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="p-3 text-center">
                        <button
                          onClick={() => toggleSelect(job.id)}
                          className="text-slate-400 hover:text-white cursor-pointer"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-blue-400" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-600" />
                          )}
                        </button>
                      </td>

                      {/* Newspaper & Edition */}
                      <td className="p-3">
                        <div className="font-semibold text-slate-200">{job.newspaper}</div>
                        <div className="text-[11px] text-blue-400 font-medium">{job.edition}</div>
                      </td>

                      {/* Date & Page & Paper Links */}
                      <td className="p-3 whitespace-nowrap">
                        <div className="flex items-center gap-1 font-mono text-slate-300">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          {job.date}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 font-semibold">
                          {job.page_number}
                        </div>
                        <div className="flex items-center gap-1 mt-1 flex-wrap">
                          <a
                            href={getInduPaperUrl(job)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] text-amber-300 hover:text-amber-200 hover:underline font-bold bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-600/50"
                            title="Open in InduPaper Reader (Subscription Free)"
                          >
                            <Newspaper className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                            <span>InduPaper</span>
                            <ExternalLink className="w-2 h-2 shrink-0" />
                          </a>
                          <a
                            href={job.imageUrl || getOfficialEpaperUrl(job)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-cyan-300 hover:underline font-medium bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800"
                            title="Open official Prabhat Khabar e-paper page"
                          >
                            <span>Official</span>
                            <ExternalLink className="w-2 h-2 shrink-0" />
                          </a>
                        </div>
                      </td>

                      {/* Company */}
                      <td className="p-3">
                        <div className="flex items-start gap-1.5 font-medium text-slate-100">
                          <Building2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                          <span>{job.company}</span>
                        </div>
                      </td>

                      {/* Job Title */}
                      <td className="p-3">
                        <div className="font-semibold text-emerald-400 leading-snug">
                          {job.job_title}
                        </div>
                        {job.qualification && (
                          <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                            Req: {job.qualification}
                          </div>
                        )}
                      </td>

                      {/* Location */}
                      <td className="p-3">
                        <div className="flex items-center gap-1 text-slate-300">
                          <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                          <span>{job.job_location}</span>
                        </div>
                      </td>

                      {/* Verbatim Ad Text */}
                      <td className="p-3 max-w-xs">
                        <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2 bg-slate-950/60 p-1.5 rounded border border-slate-800 font-serif">
                          {job.original_advertisement}
                        </p>
                      </td>

                      {/* Category Badge */}
                      <td className="p-3">
                        <span className="inline-block px-2 py-0.5 text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700 rounded-md whitespace-nowrap">
                          {job.category || 'Classifieds'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onViewJob(job)}
                            className="p-1 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded transition cursor-pointer"
                            title="View Full Ad Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onEditJob(job)}
                            className="p-1 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded transition cursor-pointer"
                            title="Edit Record"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteJob(job.id)}
                            className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition cursor-pointer"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls Footer */}
        {filteredJobs.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-slate-950 border-t border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="bg-slate-900 border border-slate-800 text-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={250}>250</option>
                <option value={500}>500</option>
                <option value={-1}>All ({filteredJobs.length})</option>
              </select>

              <span className="ml-2 text-slate-500 hidden sm:inline">
                Showing {pageSize === -1 ? 1 : (currentPage - 1) * pageSize + 1} to{' '}
                {pageSize === -1
                  ? filteredJobs.length
                  : Math.min(currentPage * pageSize, filteredJobs.length)}{' '}
                of <strong className="text-slate-200">{filteredJobs.length}</strong> entries
              </span>
            </div>

            {pageSize !== -1 && totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="p-1 rounded bg-slate-900 hover:bg-slate-800 disabled:opacity-30 border border-slate-800 text-slate-300 cursor-pointer"
                  title="First Page"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1 rounded bg-slate-900 hover:bg-slate-800 disabled:opacity-30 border border-slate-800 text-slate-300 cursor-pointer"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="px-3 font-medium text-slate-200">
                  Page <span className="text-blue-400">{currentPage}</span> of {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded bg-slate-900 hover:bg-slate-800 disabled:opacity-30 border border-slate-800 text-slate-300 cursor-pointer"
                  title="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded bg-slate-900 hover:bg-slate-800 disabled:opacity-30 border border-slate-800 text-slate-300 cursor-pointer"
                  title="Last Page"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
