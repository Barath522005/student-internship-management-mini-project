import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WorkMode, InternshipStatus } from '../types';
import { X, Plus, AlertCircle, Sparkles } from 'lucide-react';

interface AddInternshipModalProps {
  onClose: () => void;
}

export const AddInternshipModal: React.FC<AddInternshipModalProps> = ({ onClose }) => {
  const { createInternship } = useApp();

  const [title, setTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [description, setDescription] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [location, setLocation] = useState('');
  const [workMode, setWorkMode] = useState<WorkMode>('Hybrid');
  const [duration, setDuration] = useState('6 Months');
  const [stipend, setStipend] = useState('₹25,000 / month');
  const [availablePositions, setAvailablePositions] = useState(3);
  const [applicationDeadline, setApplicationDeadline] = useState('2026-12-31');
  const [status, setStatus] = useState<InternshipStatus>('Active');

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !companyName.trim() || !description.trim() || !requiredSkills.trim() || !location.trim()) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    const res = createInternship({
      title: title.trim(),
      company_name: companyName.trim(),
      description: description.trim(),
      required_skills: requiredSkills.trim(),
      eligibility: eligibility.trim() || 'Open to all eligible undergraduate students with no active backlogs.',
      location: location.trim(),
      work_mode: workMode,
      duration: duration.trim(),
      stipend: stipend.trim(),
      available_positions: Number(availablePositions) || 1,
      application_deadline: applicationDeadline,
      status,
    });

    if (res.success) {
      onClose();
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Post New Internship Opportunity</h2>
              <p className="text-xs text-slate-500">Corporate drive listing form</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Internship Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Cloud Security Analyst Intern"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Company Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Microsoft India"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">
                Detailed Job Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                required
                placeholder="Provide comprehensive details on projects, responsibilities, team structure, and expectations..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-blue-500"
              ></textarea>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Required Technical Skills (comma-separated) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Python, SQL, Docker, AWS"
                value={requiredSkills}
                onChange={(e) => setRequiredSkills(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Eligibility Thresholds <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. B.Tech CS/IT with min 7.5 CGPA"
                value={eligibility}
                onChange={(e) => setEligibility(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Location (City / State) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Bengaluru, Karnataka"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Work Mode <span className="text-rose-500">*</span>
              </label>
              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value as WorkMode)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-blue-500"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Duration <span className="text-rose-500">*</span></label>
              <input
                type="text"
                required
                placeholder="e.g. 6 Months"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Monthly Stipend <span className="text-rose-500">*</span></label>
              <input
                type="text"
                required
                placeholder="e.g. ₹30,000 / month"
                value={stipend}
                onChange={(e) => setStipend(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Available Positions <span className="text-rose-500">*</span></label>
              <input
                type="number"
                min={1}
                required
                value={availablePositions}
                onChange={(e) => setAvailablePositions(parseInt(e.target.value, 10) || 1)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Application Deadline <span className="text-rose-500">*</span></label>
              <input
                type="date"
                required
                value={applicationDeadline}
                onChange={(e) => setApplicationDeadline(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Initial Visibility Status <span className="text-rose-500">*</span></label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as InternshipStatus)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-blue-500"
              >
                <option value="Active">Active (Accepting Applications)</option>
                <option value="Closed">Closed (Draft / Inactive)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Publish Internship
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
