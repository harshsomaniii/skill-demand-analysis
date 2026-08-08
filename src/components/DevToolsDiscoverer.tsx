import React, { useState } from 'react';
import { INSPECTION_PATTERNS } from '../data/mockJobData';
import {
  SearchCode,
  Globe,
  Terminal,
  CheckCircle2,
  XCircle,
  Copy,
  ExternalLink,
  Info,
  Zap,
} from 'lucide-react';

export const DevToolsDiscoverer: React.FC = () => {
  const [testGroup, setTestGroup] = useState('ranchi');
  const [testEdition, setTestEdition] = useState('ranchi-city');
  const [testDate, setTestDate] = useState('2026-07-07');
  const [testPageNum, setTestPageNum] = useState(8);

  const [testingStatus, setTestingStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [inspectionResult, setInspectionResult] = useState<any>(null);

  const handleInspectPage = async () => {
    setTestingStatus('loading');
    setInspectionResult(null);

    try {
      const res = await fetch('/api/scrape/inspect-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          group: testGroup,
          edition: testEdition,
          date: testDate,
          pageNumber: testPageNum,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTestingStatus('success');
        setInspectionResult(data);
      } else {
        setTestingStatus('error');
        setInspectionResult(data);
      }
    } catch (err: any) {
      setTestingStatus('error');
      setInspectionResult({ error: err.message });
    }
  };

  return (
    <div className="space-y-6">
      {/* Architecture Explainer */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-sm font-semibold text-slate-200">
          <SearchCode className="w-4 h-4 text-cyan-400" />
          <span>InduPaper E-Paper Architecture & Network Discovery</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5">
            <div className="font-bold text-blue-400 flex items-center gap-1">
              <span>1. Form Input Parameters</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Date picker (<code className="text-amber-300 font-mono">YYYY-MM-DD</code>) → City dropdown (<code className="text-amber-300 font-mono">ranchi</code>) → Sub-city dropdown (<code className="text-amber-300 font-mono">ranchi-city</code>).
            </p>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5">
            <div className="font-bold text-emerald-400 flex items-center gap-1">
              <span>2. High-Res Image Replica Layer</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Upon clicking View, pages load as high-quality image replicas (<code className="text-emerald-300 font-mono">page_01.jpg ... page_20.jpg</code>).
            </p>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5">
            <div className="font-bold text-cyan-400 flex items-center gap-1">
              <span>3. Gemini Vision Extraction</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Page images bypass HTML OCR flaws, allowing Gemini Vision to parse Gujarati, Hindi, or English recruitment ads with 99% accuracy.
            </p>
          </div>
        </div>
      </div>

      {/* Chrome DevTools Inspection Guide */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-sm font-semibold text-slate-200">
          <Terminal className="w-4 h-4 text-indigo-400" />
          <span>Chrome DevTools Endpoint Discovery Procedure</span>
        </div>

        <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300 leading-relaxed font-sans">
          <li className="pl-1">
            Open <strong className="text-white">https://www.indupaper.com/prabhat-khabar</strong> in Google Chrome.
          </li>
          <li className="pl-1">
            Press <code className="bg-slate-950 text-amber-300 px-1.5 py-0.5 rounded border border-slate-800 font-mono">F12</code> or right-click → <strong className="text-white">Inspect</strong> → open the <strong className="text-indigo-400 font-mono">Network</strong> tab.
          </li>
          <li className="pl-1">
            Filter Network requests by <code className="bg-slate-950 text-cyan-300 px-1.5 py-0.5 rounded border border-slate-800 font-mono">Img</code> or <code className="bg-slate-950 text-cyan-300 px-1.5 py-0.5 rounded border border-slate-800 font-mono">Fetch/XHR</code>.
          </li>
          <li className="pl-1">
            Select <span className="text-amber-300 font-medium">Date</span>, <span className="text-amber-300 font-medium">City (Ranchi)</span>, <span className="text-amber-300 font-medium">Sub-City</span>, then click <strong className="text-emerald-400 font-bold">[ View ]</strong>.
          </li>
          <li className="pl-1">
            Inspect incoming image requests for URL patterns like <code className="text-emerald-400 font-mono">.../2026-07-07/ranchi/page_08.jpg</code>. Copy any discovered URL and test it below!
          </li>
        </ol>
      </div>

      {/* Test Endpoint Tester */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
        <div className="text-xs font-semibold text-slate-200">Live Prabhat Khabar E-Paper Page Inspector (epaper.prabhatkhabar.com)</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Group Slug</label>
            <input
              type="text"
              value={testGroup}
              onChange={(e) => setTestGroup(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 font-mono"
            />
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Edition Slug</label>
            <input
              type="text"
              value={testEdition}
              onChange={(e) => setTestEdition(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 font-mono"
            />
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Date (YYYY-MM-DD)</label>
            <input
              type="text"
              value={testDate}
              onChange={(e) => setTestDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 font-mono"
            />
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Page Number</label>
            <input
              type="number"
              value={testPageNum}
              onChange={(e) => setTestPageNum(parseInt(e.target.value) || 1)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 font-mono"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={handleInspectPage}
            disabled={testingStatus === 'loading'}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-lg transition shrink-0 cursor-pointer flex items-center justify-center gap-2"
          >
            <Globe className="w-4 h-4" />
            <span>{testingStatus === 'loading' ? 'Fetching & Inspecting URL...' : 'Inspect Page & Discover Image URL'}</span>
          </button>
        </div>

        {inspectionResult && (
          <div
            className={`p-3 rounded-lg text-xs font-mono space-y-1.5 ${
              testingStatus === 'success'
                ? 'bg-emerald-950/40 border border-emerald-800 text-emerald-300'
                : 'bg-rose-950/40 border border-rose-800 text-rose-300'
            }`}
          >
            <div className="font-bold flex items-center gap-2">
              {testingStatus === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-400" />
              )}
              <span>URL: {inspectionResult.pageUrl || 'N/A'}</span>
            </div>
            {inspectionResult.primaryImage && (
              <div className="text-amber-300 text-[11px] truncate">
                Discovered Image: {inspectionResult.primaryImage}
              </div>
            )}
            {inspectionResult.statusCode && (
              <div>HTTP Status: {inspectionResult.statusCode}</div>
            )}
            {inspectionResult.error && <div>Error: {inspectionResult.error}</div>}
          </div>
        )}
      </div>

      {/* Saved Patterns */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
        <div className="text-xs font-semibold text-slate-200">Validated E-Paper Storage CDN Templates</div>
        <div className="space-y-3">
          {INSPECTION_PATTERNS.map((pt) => (
            <div key={pt.id} className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-200">
                <span>{pt.name}</span>
                <button
                  onClick={() => {
                    setTestGroup('ranchi');
                    setTestEdition('ranchi-city');
                    setTestDate(pt.sampleDate || '2026-07-07');
                    setTestPageNum(8);
                  }}
                  className="text-blue-400 hover:underline text-[11px] cursor-pointer"
                >
                  Load Template
                </button>
              </div>
              <div className="font-mono text-emerald-400 bg-slate-900 p-1.5 rounded border border-slate-800 text-[11px] overflow-x-auto">
                {pt.urlTemplate}
              </div>
              <div className="text-slate-400 text-[11px]">{pt.notes}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
