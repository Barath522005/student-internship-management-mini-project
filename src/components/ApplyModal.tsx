import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Internship } from '../types';
import {
  X,
  Send,
  Building,
  AlertCircle,
  CheckCircle2,
  User,
  GraduationCap,
  Sparkles
} from 'lucide-react';

interface ApplyModalProps {
  internship: Internship | null;
  onClose: () => void;
  onSuccessNavigate?: () => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({
  internship,
  onClose,
  onSuccessNavigate,
}) => {
  const { currentUser, applyToInternship } = useApp();
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!internship || !currentUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!message.trim()) {
      setError('Please write a brief cover letter or statement explaining your interest.');
      return;
    }

    setIsSubmitting(true);
    const res = applyToInternship(internship.id, message.trim());
    setIsSubmitting(false);

    if (res.success) {
      setIsSuccess(true);
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200/80 flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-semibold mb-1">
              <Sparkles className="w-3 h-3" />
              <span>Application Submission</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Apply to {internship.title}
            </h2>
            <p className="text-xs font-semibold text-slate-600 flex items-center gap-1 mt-0.5">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              {internship.company_name}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">
              Application Submitted!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
              Your application has been recorded in the database. The placement administrators and recruiting coordinators will review your submission shortly.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-2">
              <button
                onClick={() => {
                  onClose();
                  if (onSuccessNavigate) onSuccessNavigate();
                }}
                className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                View My Applications
              </button>
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Applicant Summary Preview */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs space-y-2">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">
                Applicant Academic Profile
              </span>
              <div className="flex items-center gap-2 text-slate-800 font-semibold">
                <User className="w-3.5 h-3.5 text-blue-500" />
                <span>{currentUser.full_name}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-600">{currentUser.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
                <span>
                  {currentUser.department} ({currentUser.degree}, Class of {currentUser.graduation_year})
                </span>
              </div>
            </div>

            {/* Cover letter message */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Cover Letter / Statement of Purpose <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your relevant skills, projects, and why you are interested in this internship opportunity..."
                className="w-full p-3.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-slate-400 leading-relaxed"
              ></textarea>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Tip: Mention your hands-on coursework and tech stack to stand out.
              </span>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
