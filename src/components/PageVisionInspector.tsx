import React, { useState } from 'react';
import { JobAd } from '../types';
import { JHARKHAND_EDITIONS } from '../data/mockJobData';
import {
  Eye,
  Bot,
  Upload,
  Sparkles,
  Calendar,
  Building2,
  FileImage,
  CheckCircle2,
  AlertCircle,
  Maximize2,
  RotateCw,
  Zap,
} from 'lucide-react';

interface PageVisionInspectorProps {
  onAddExtractedJobs: (newJobs: JobAd[]) => void;
}

export const PageVisionInspector: React.FC<PageVisionInspectorProps> = ({
  onAddExtractedJobs,
}) => {
  const [newspaper, setNewspaper] = useState('Prabhat Khabar');
  const [selectedCityId, setSelectedCityId] = useState('ranchi-city');
  const [date, setDate] = useState('2026-07-07');
  const [pageNumber, setPageNumber] = useState('Page 8');

  const [customImageBase64, setCustomImageBase64] = useState<string | null>(null);
  const [customImageMime, setCustomImageMime] = useState<string>('image/jpeg');
  const [previewSample, setPreviewSample] = useState<'p8' | 'p9' | 'p14' | 'custom'>('p8');

  const [isProcessing, setIsProcessing] = useState(false);
  const [scanResult, setScanResult] = useState<JobAd[] | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  const selectedEdition = JHARKHAND_EDITIONS.find((e) => e.id === selectedCityId) || JHARKHAND_EDITIONS[0];

  // Canvas / SVG placeholder generator for sample newspaper pages so user can visually inspect!
  const getSampleSvgDataUrl = (type: 'p8' | 'p9' | 'p14') => {
    let title = 'PRABHAT KHABAR - RANCHI CITY';
    let pNo = '8';
    let adsCount = '9 RECRUITMENT NOTICES DETECTED';

    if (type === 'p9') {
      pNo = '9';
      adsCount = '2 ACADEMIC RECRUITMENT NOTICES';
    } else if (type === 'p14') {
      pNo = '14';
      adsCount = '1 TATA STEEL FOUNDATION JOB NOTICE';
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1100" viewBox="0 0 800 1100">
      <rect width="800" height="1100" fill="#fdfbf7"/>
      <rect x="20" y="20" width="760" height="1060" fill="none" stroke="#222" stroke-width="2"/>
      
      <!-- Header -->
      <text x="400" y="60" font-family="serif" font-size="32" font-weight="bold" text-anchor="middle" fill="#0f172a">प्रभात खबर (PRABHAT KHABAR)</text>
      <line x1="40" y1="75" x2="760" y2="75" stroke="#0f172a" stroke-width="2"/>
      <text x="50" y="95" font-family="sans-serif" font-size="14" fill="#475569">RANCHI CITY EDITION | DATE: ${date} | PAGE: ${pNo}</text>
      <text x="750" y="95" font-family="sans-serif" font-size="14" text-anchor="end" fill="#0284c7">JHARKHAND NEWS &amp; RECRUITMENT</text>
      <line x1="40" y1="105" x2="760" y2="105" stroke="#0f172a" stroke-width="1"/>

      <!-- Simulated Newspaper Layout Columns -->
      ${
        type === 'p8'
          ? `
        <!-- Ad 1: JSSC -->
        <rect x="50" y="120" width="340" height="280" fill="#eff6ff" stroke="#2563eb" stroke-width="2" stroke-dasharray="4"/>
        <text x="65" y="150" font-family="sans-serif" font-size="16" font-weight="bold" fill="#1e40af">झारखंड कर्मचारी चयन आयोग (JSSC)</text>
        <text x="65" y="180" font-family="sans-serif" font-size="13" font-weight="bold" fill="#0f172a">सहायक आचार्य संयुक्त प्रतियोगिता परीक्षा-2026</text>
        <text x="65" y="210" font-family="sans-serif" font-size="12" fill="#334155">कुल पद: 1240 | योग्यता: B.Ed / D.El.Ed &amp; JTET</text>
        <text x="65" y="235" font-family="sans-serif" font-size="12" fill="#334155">आवेदन तिथि: 15 जुलाई 2026 से 14 अगस्त 2026</text>
        <text x="65" y="260" font-family="sans-serif" font-size="11" fill="#2563eb">jssc.jharkhand.gov.in</text>

        <!-- Ad 2: CCL Ranchi -->
        <rect x="410" y="120" width="340" height="280" fill="#f0fdf4" stroke="#16a34a" stroke-width="2" stroke-dasharray="4"/>
        <text x="425" y="150" font-family="sans-serif" font-size="16" font-weight="bold" fill="#15803d">CENTRAL COALFIELDS LIMITED (CCL)</text>
        <text x="425" y="180" font-family="sans-serif" font-size="13" font-weight="bold" fill="#0f172a">Junior Overman &amp; Mining Sirdar</text>
        <text x="425" y="210" font-family="sans-serif" font-size="12" fill="#334155">Vacancies: 93 Posts | Pay: ₹31,852/month</text>
        <text x="425" y="235" font-family="sans-serif" font-size="12" fill="#334155">Diploma in Mining Engineering Required</text>
        <text x="425" y="260" font-family="sans-serif" font-size="11" fill="#16a34a">centralcoalfields.in</text>

        <!-- Ad 3: DPS Ranchi -->
        <rect x="50" y="420" width="340" height="280" fill="#fefce8" stroke="#ca8a04" stroke-width="2" stroke-dasharray="4"/>
        <text x="65" y="450" font-family="sans-serif" font-size="16" font-weight="bold" fill="#854d0e">DELHI PUBLIC SCHOOL, RANCHI</text>
        <text x="65" y="480" font-family="sans-serif" font-size="13" font-weight="bold" fill="#0f172a">PGT Physics, TGT English, PRT Maths</text>
        <text x="65" y="510" font-family="sans-serif" font-size="12" fill="#334155">7th CPC Pay Scale + HRA | Experienced Faculty</text>
        <text x="65" y="535" font-family="sans-serif" font-size="11" fill="#854d0e">Email: recruitment@dpsranchi.com</text>

        <!-- Ad 4: Medica Hospital -->
        <rect x="410" y="420" width="340" height="280" fill="#fdf2f8" stroke="#db2777" stroke-width="2" stroke-dasharray="4"/>
        <text x="425" y="450" font-family="sans-serif" font-size="16" font-weight="bold" fill="#9d174d">MEDICA HOSPITALS RANCHI</text>
        <text x="425" y="480" font-family="sans-serif" font-size="13" font-weight="bold" fill="#0f172a">Cardiologist, RMO &amp; ICU Staff Nurses</text>
        <text x="425" y="510" font-family="sans-serif" font-size="12" fill="#334155">Walk-in Interview: 10th &amp; 11th July 2026</text>

        <!-- Page Footer Banner -->
        <rect x="50" y="720" width="700" height="320" fill="#f8fafc" stroke="#64748b" stroke-width="1"/>
        <text x="400" y="760" font-family="sans-serif" font-size="14" text-anchor="middle" fill="#475569">Classified Job Notices Column (5 Additional Ads Detected on Page 8)</text>
      `
          : type === 'p9'
          ? `
        <rect x="50" y="140" width="700" height="350" fill="#f5f3ff" stroke="#7c3aed" stroke-width="2"/>
        <text x="80" y="180" font-family="sans-serif" font-size="18" font-weight="bold" fill="#5b21b6">BIRSA AGRICULTURAL UNIVERSITY (BAU KANKE)</text>
        <text x="80" y="220" font-family="sans-serif" font-size="14" fill="#1e1b4b">JRF &amp; Project Assistant Walk-in Interview - July 22, 2026</text>

        <rect x="50" y="520" width="700" height="350" fill="#fff7ed" stroke="#ea580c" stroke-width="2"/>
        <text x="80" y="560" font-family="sans-serif" font-size="18" font-weight="bold" fill="#9a3412">JHARKHAND STATE HOUSING BOARD (JSHB)</text>
        <text x="80" y="600" font-family="sans-serif" font-size="14" fill="#431407">Assistant Engineers (Civil &amp; Electrical) - Last Date: Aug 5, 2026</text>
      `
          : `
        <rect x="50" y="180" width="700" height="500" fill="#f0fdfa" stroke="#0d9488" stroke-width="2"/>
        <text x="80" y="240" font-family="sans-serif" font-size="20" font-weight="bold" fill="#115e59">TATA STEEL FOUNDATION (JHARKHAND)</text>
        <text x="80" y="280" font-family="sans-serif" font-size="15" fill="#134e4a">Field Officers &amp; Community Coordinators for West Singhbhum &amp; Ranchi</text>
      `
      }
    </svg>`;

    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCustomImageMime(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setCustomImageBase64(result);
      setPreviewSample('custom');
    };
    reader.readAsDataURL(file);
  };

  const handleScanWithGeminiVision = async () => {
    setIsProcessing(true);
    setScanError(null);
    setScanResult(null);

    try {
      let imageBase64Data = '';
      let mimeType = customImageMime;

      if (previewSample === 'custom' && customImageBase64) {
        imageBase64Data = customImageBase64.split(',')[1] || customImageBase64;
      } else {
        // Generate SVG or canvas data URL for sample pages
        const svgUrl = getSampleSvgDataUrl(previewSample === 'custom' ? 'p8' : previewSample);
        imageBase64Data = svgUrl.split(',')[1];
        mimeType = 'image/svg+xml';
      }

      const response = await fetch('/api/extract-jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: imageBase64Data,
          mimeType,
          newspaper,
          edition: selectedEdition.subCity,
          date,
          pageNumber,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to scan page with Gemini Vision.');
      }

      setScanResult(data.jobs);
    } catch (err: any) {
      console.error('Vision scan error:', err);
      setScanError(err.message || 'Error occurred while running vision processing.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCommitToDatabase = () => {
    if (scanResult && scanResult.length > 0) {
      onAddExtractedJobs(scanResult);
      alert(`Successfully added ${scanResult.length} extracted job advertisement(s) to the Master Database!`);
      setScanResult(null);
    }
  };

  const currentPreviewUrl =
    previewSample === 'custom' && customImageBase64
      ? customImageBase64
      : getSampleSvgDataUrl(previewSample === 'custom' ? 'p8' : previewSample);

  return (
    <div className="space-y-6">
      {/* Page Selector & Control Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-200 pb-2 border-b border-slate-800">
          <Eye className="w-4 h-4 text-emerald-400" />
          <span>InduPaper / Prabhat Khabar E-Paper Inspector (Date → City → Sub City Structure)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Newspaper */}
          <div>
            <label className="block text-slate-400 font-medium mb-1">Newspaper</label>
            <input
              type="text"
              value={newspaper}
              onChange={(e) => setNewspaper(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 font-medium"
            />
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-slate-400 font-medium mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>Select Date</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 font-mono"
            />
          </div>

          {/* City / Edition Dropdown */}
          <div>
            <label className="block text-slate-400 font-medium mb-1 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>City / Jharkhand Edition</span>
            </label>
            <select
              value={selectedCityId}
              onChange={(e) => setSelectedCityId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2"
            >
              {JHARKHAND_EDITIONS.map((ed) => (
                <option key={ed.id} value={ed.id}>
                  {ed.displayName}
                </option>
              ))}
            </select>
          </div>

          {/* Page Number */}
          <div>
            <label className="block text-slate-400 font-medium mb-1">Page Number</label>
            <select
              value={pageNumber}
              onChange={(e) => setPageNumber(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2"
            >
              {Array.from({ length: 20 }, (_, i) => `Page ${i + 1}`).map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Sample Selector & Custom Upload */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-400 font-medium">Quick Page Presets:</span>
            <button
              onClick={() => {
                setPreviewSample('p8');
                setPageNumber('Page 8');
              }}
              className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                previewSample === 'p8'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              July 7 Page 8 (9 Jobs)
            </button>
            <button
              onClick={() => {
                setPreviewSample('p9');
                setPageNumber('Page 9');
              }}
              className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                previewSample === 'p9'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              July 7 Page 9 (2 Jobs)
            </button>
            <button
              onClick={() => {
                setPreviewSample('p14');
                setPageNumber('Page 14');
              }}
              className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                previewSample === 'p14'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              July 7 Page 14 (1 Job)
            </button>
          </div>

          {/* Upload Custom Scanned Image */}
          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg cursor-pointer transition">
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>Upload Newspaper Page Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Main Vision Workspace Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Newspaper Page Viewer */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col space-y-3">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <FileImage className="w-4 h-4 text-indigo-400" />
              Printed Newspaper Page Replica
            </span>
            <span className="text-slate-400 font-mono">
              {newspaper} | {selectedEdition.subCity} | {date} ({pageNumber})
            </span>
          </div>

          <div className="relative bg-slate-950 rounded-lg border border-slate-800 p-2 overflow-hidden flex items-center justify-center min-h-[480px]">
            <img
              src={currentPreviewUrl}
              alt="Prabhat Khabar E-Paper Page"
              className="max-h-[520px] w-auto object-contain rounded shadow-lg"
            />

            {/* Processing Overlay */}
            {isProcessing && (
              <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 space-y-3 z-10">
                <div className="relative">
                  <Bot className="w-12 h-12 text-cyan-400 animate-bounce" />
                  <Sparkles className="w-5 h-5 text-amber-400 absolute -top-1 -right-1 animate-spin" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white">Gemini 3.6 Flash Vision Scanning...</h3>
                  <p className="text-xs text-slate-400 max-w-xs">
                    Detecting recruitment notices, walk-in alerts, government vacancies, and verbatim ad texts on page image...
                  </p>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleScanWithGeminiVision}
            disabled={isProcessing}
            id="run-gemini-vision-scan-btn"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:from-blue-700 active:to-indigo-700 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition shadow-md shadow-blue-900/40 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>{isProcessing ? 'Analyzing Newspaper Page...' : 'Run Gemini Vision AI Job Extraction'}</span>
          </button>
        </div>

        {/* Right: Vision Extraction Results */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col space-y-3">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-cyan-400" />
              Extracted Job Advertisements
            </span>
            {scanResult && (
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-semibold text-[11px]">
                {scanResult.length} Ad(s) Found
              </span>
            )}
          </div>

          <div className="flex-1 min-h-[480px] bg-slate-950/60 rounded-lg border border-slate-800 p-3 overflow-y-auto space-y-3">
            {scanError && (
              <div className="p-4 bg-rose-950/40 border border-rose-800/60 rounded-lg text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Extraction Error</div>
                  <div>{scanError}</div>
                </div>
              </div>
            )}

            {!scanResult && !isProcessing && !scanError && (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500 space-y-3">
                <Bot className="w-12 h-12 text-slate-700" />
                <div>
                  <p className="text-xs font-medium text-slate-400">No active scan performed on this page yet.</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Click "Run Gemini Vision AI Job Extraction" to extract company, title, location, and original text snippets.
                  </p>
                </div>
              </div>
            )}

            {scanResult && scanResult.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-2">
                <AlertCircle className="w-10 h-10 text-slate-600" />
                <p className="text-xs font-medium">No recruitment advertisements were detected on this newspaper page.</p>
              </div>
            )}

            {scanResult && scanResult.length > 0 && (
              <div className="space-y-3">
                {scanResult.map((job, i) => (
                  <div
                    key={i}
                    className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-2 text-xs hover:border-slate-700 transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-bold text-slate-100 text-sm flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>{job.company}</span>
                      </div>
                      <span className="px-2 py-0.5 bg-blue-950 text-blue-400 border border-blue-800/60 rounded text-[10px] font-semibold shrink-0">
                        {job.category}
                      </span>
                    </div>

                    <div className="text-emerald-400 font-semibold">{job.job_title}</div>
                    
                    <div className="text-slate-400 text-[11px]">
                      Location: <span className="text-slate-200">{job.job_location}</span>
                    </div>

                    <div className="p-2 bg-slate-950 rounded border border-slate-800 text-[11px] text-slate-300 font-serif leading-relaxed">
                      {job.original_advertisement}
                    </div>

                    {job.qualification && (
                      <div className="text-[11px] text-slate-400">
                        Req: <span className="text-slate-300">{job.qualification}</span> | Deadline: <span className="text-amber-400">{job.deadline || 'N/A'}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {scanResult && scanResult.length > 0 && (
            <button
              onClick={handleCommitToDatabase}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg transition shadow-md shadow-emerald-900/40 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Add {scanResult.length} Extracted Record(s) to Master Database</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
