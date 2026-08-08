import React, { useState } from 'react';
import { JobAd } from '../types';
import { getInduPaperUrl, getOfficialEpaperUrl } from '../utils/urlHelper';
import { X, Copy, Check, MapPin, FileText, Newspaper, ExternalLink, ShieldCheck } from 'lucide-react';

interface JobDetailModalProps {
  job: JobAd | null;
  onClose: () => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({ job, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!job) return null;

  const indupaperUrl = getInduPaperUrl(job);
  const officialUrl = getOfficialEpaperUrl(job);

  const handleCopyText = () => {
    navigator.clipboard.writeText(
      `NEWSPAPER: ${job.newspaper} (${job.edition})
DATE: ${job.date} | ${job.page_number}
COMPANY: ${job.company}
ROLE: ${job.job_title}
LOCATION: ${job.job_location}
VERBATIM ADVERTISEMENT:
${job.original_advertisement}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md">
                {job.newspaper} ({job.edition})
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {job.date} | {job.page_number}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-100 mt-2">{job.company}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Source E-Paper Direct Action Banner */}
        <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <div className="font-bold text-slate-200">View Source Newspaper Page</div>
                <div className="text-[11px] text-slate-400">
                  Select your preferred reader portal:
                </div>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px] font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> No Subscription Needed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {/* InduPaper Free Link */}
            <a
              href={indupaperUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-gradient-to-r from-amber-950/60 to-yellow-950/60 hover:from-amber-900/80 hover:to-yellow-900/80 border border-amber-600/40 rounded-lg flex items-center justify-between text-amber-200 transition group cursor-pointer"
            >
              <div className="truncate">
                <div className="font-bold flex items-center gap-1 text-amber-300">
                  <span>InduPaper Reader</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded">FREE</span>
                </div>
                <div className="text-[10px] text-amber-400/80 font-mono truncate">
                  {indupaperUrl}
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-amber-400 group-hover:scale-110 transition shrink-0 ml-1" />
            </a>

            {/* Official Link */}
            <a
              href={job.imageUrl || officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg flex items-center justify-between text-slate-300 transition group cursor-pointer"
            >
              <div className="truncate">
                <div className="font-bold text-slate-200">Official Prabhat Khabar</div>
                <div className="text-[10px] text-slate-500 font-mono truncate">
                  {officialUrl}
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 group-hover:scale-110 transition shrink-0 ml-1" />
            </a>
          </div>
        </div>

        {/* Content Body */}
        <div className="space-y-4 text-xs">
          
          {/* Job Title & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
            <div>
              <span className="text-slate-500 block mb-0.5">Job Title / Designation</span>
              <span className="font-bold text-emerald-400 text-sm">{job.job_title}</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5">Job Location</span>
              <span className="font-semibold text-slate-200 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                {job.job_location}
              </span>
            </div>
          </div>

          {/* Original Verbatim Ad Text */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-slate-400 font-semibold">
              <span className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                Original Newspaper Advertisement (Verbatim Text)
              </span>
              <button
                onClick={handleCopyText}
                className="text-blue-400 hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied!' : 'Copy Snippet'}
              </button>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-serif text-slate-200 text-xs leading-relaxed whitespace-pre-wrap">
              {job.original_advertisement}
            </div>
          </div>

          {/* Extra Meta Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 space-y-0.5">
              <span className="text-slate-500 block font-medium">Category / Sector</span>
              <span className="font-bold text-slate-200">{job.category || 'Classifieds'}</span>
            </div>
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 space-y-0.5">
              <span className="text-slate-500 block font-medium">Deadline / Interview</span>
              <span className="font-bold text-amber-400">{job.deadline || 'N/A'}</span>
            </div>
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 space-y-0.5">
              <span className="text-slate-500 block font-medium">Qualification</span>
              <span className="font-bold text-slate-200">{job.qualification || 'N/A'}</span>
            </div>
          </div>

          {job.contact_info && (
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 font-mono text-[11px]">
              <span className="text-slate-500 block font-sans mb-0.5">Contact / Website / Phone</span>
              {job.contact_info}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-lg transition cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

