import React, { useState, useEffect } from 'react';
import { JobAd } from '../types';
import { X, Save, Building2, MapPin, Calendar, FileText, Tag } from 'lucide-react';

interface EditJobModalProps {
  job: JobAd | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedJob: JobAd) => void;
}

export const EditJobModal: React.FC<EditJobModalProps> = ({
  job,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<JobAd>>({});

  useEffect(() => {
    if (job) {
      setFormData(job);
    } else {
      setFormData({
        id: `job-${Date.now()}`,
        newspaper: 'Prabhat Khabar',
        edition: 'Ranchi City',
        date: new Date().toISOString().split('T')[0],
        page_number: 'Page 8',
        company: '',
        job_title: '',
        job_location: 'Ranchi, Jharkhand',
        original_advertisement: '',
        category: 'Government / PSU',
        qualification: '',
        deadline: '',
        contact_info: '',
        extractedAt: new Date().toISOString(),
      });
    }
  }, [job, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company || !formData.job_title || !formData.original_advertisement) {
      alert('Please fill in Company, Job Title, and Original Advertisement.');
      return;
    }
    onSave(formData as JobAd);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-base font-bold text-slate-100">
            {job ? 'Edit Job Advertisement Record' : 'Add New Manual Record'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Newspaper</label>
              <input
                type="text"
                value={formData.newspaper || ''}
                onChange={(e) => setFormData({ ...formData, newspaper: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Edition</label>
              <input
                type="text"
                value={formData.edition || ''}
                onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Date (YYYY-MM-DD)</label>
              <input
                type="date"
                value={formData.date || ''}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Page Number</label>
              <input
                type="text"
                value={formData.page_number || ''}
                onChange={(e) => setFormData({ ...formData, page_number: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Company / Organization *</label>
            <input
              type="text"
              required
              value={formData.company || ''}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2"
              placeholder="e.g. Jharkhand Staff Selection Commission"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Job Title / Designation *</label>
              <input
                type="text"
                required
                value={formData.job_title || ''}
                onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2"
                placeholder="e.g. Assistant Professor"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Job Location</label>
              <input
                type="text"
                value={formData.job_location || ''}
                onChange={(e) => setFormData({ ...formData, job_location: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2"
                placeholder="e.g. Ranchi, Jharkhand"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Category / Sector</label>
            <select
              value={formData.category || 'Government / PSU'}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2"
            >
              <option value="Government / PSU">Government / PSU</option>
              <option value="Education & Academic">Education & Academic</option>
              <option value="Healthcare & Hospitals">Healthcare & Hospitals</option>
              <option value="Private Sector">Private Sector</option>
              <option value="Banking & Finance">Banking & Finance</option>
              <option value="Classifieds / Other">Classifieds / Other</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Original Advertisement (Verbatim Text) *</label>
            <textarea
              required
              rows={4}
              value={formData.original_advertisement || ''}
              onChange={(e) => setFormData({ ...formData, original_advertisement: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-3 font-serif leading-relaxed"
              placeholder="Paste or write exact printed advertisement text..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-lg transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-lg transition shadow-md shadow-blue-900/40 flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Record</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
