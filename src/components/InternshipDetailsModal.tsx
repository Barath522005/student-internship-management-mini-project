import React from 'react';
import { useApp } from '../context/AppContext';
import { Internship } from '../types';
import {
  X,
  Building,
  MapPin,
  Clock,
  BadgeDollarSign,
  Users,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  FileCheck2,
  ShieldCheck,
  Send
} from 'lucide-react';

interface InternshipDetailsModalProps {
  internship: Internship | null;
  onClose: () => void;
  onOpenApply: (internship: Internship) => void;
  onOpenAuth: (mode: 'student-login' | 'student-register') => void;
  onNavigateToApplications?: () => void;
}

export const InternshipDetailsModal: React.FC<InternshipDetailsModalProps> = ({
  internship,
  onClose,
  onOpenApply,
  onOpenAuth,
  onNavigateToApplications,
}) => {
  const { currentUser, hasStudentApplied, getStudentApplication } = useApp();

  if (!internship) return null;

  const isClosed = internship.status === 'Closed';
  const deadlineDate = new Date(internship.application_deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isExpired = deadlineDate < today;

  const studentApplied = currentUser?.role === 'student' && hasStudentApplied(currentUser.id, internship.id);
  const existingApplication = studentApplied && currentUser ? getStudentApplication(currentUser.id, internship.id) : null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200/80 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                {internship.work_mode}
              </span>
              {isClosed ? (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800">
                  Closed
                </span>
              ) : isExpired ? (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  Deadline Passed
                </span>
              ) : (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Active Opening
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {internship.title}
            </h2>
            <p className="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-slate-400" />
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

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Key Quick Facts Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                Stipend
              </span>
              <span className="font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                <BadgeDollarSign className="w-3.5 h-3.5" />
                {internship.stipend}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                Duration
              </span>
              <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {internship.duration}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                Positions
              </span>
              <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                {internship.available_positions} Vacancies
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                Deadline
              </span>
              <span
                className={`font-bold flex items-center gap-1 mt-0.5 ${
                  isExpired ? 'text-rose-600' : 'text-slate-800'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {internship.application_deadline}
              </span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
            <span>
              <strong>Location:</strong> {internship.location} ({internship.work_mode})
            </span>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Role Description & Responsibilities
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {internship.description}
            </p>
          </div>

          {/* Required Skills */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Required Technical Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {internship.required_skills.split(',').map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200/80 rounded-lg text-xs font-semibold"
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>

          {/* Eligibility Criteria */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Academic Eligibility & Prerequisites
            </h3>
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
              {internship.eligibility}
            </div>
          </div>

          {/* Existing Application Notice */}
          {studentApplied && existingApplication && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-blue-600" />
                  You have already applied for this role
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white text-blue-700 border border-blue-200">
                  Status: {existingApplication.status}
                </span>
              </div>
              <p className="text-[11px] text-blue-700">
                Applied on: {existingApplication.applied_at}
              </p>
              {existingApplication.admin_remarks && (
                <p className="text-xs text-blue-900 font-medium bg-white/70 p-2 rounded-lg border border-blue-100">
                  <strong>Admin Remarks:</strong> {existingApplication.admin_remarks}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer / Actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition"
          >
            Close Details
          </button>

          <div>
            {!currentUser ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 hidden sm:inline">
                  Log in to apply:
                </span>
                <button
                  onClick={() => {
                    onClose();
                    onOpenAuth('student-login');
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition"
                >
                  Student Sign In & Apply
                </button>
              </div>
            ) : currentUser.role === 'admin' ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-amber-800 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Placement Admin View
                </span>
              </div>
            ) : studentApplied ? (
              <button
                onClick={() => {
                  onClose();
                  if (onNavigateToApplications) onNavigateToApplications();
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center gap-1.5"
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                Track Application Status
              </button>
            ) : isClosed || isExpired ? (
              <button
                disabled
                className="px-4 py-2 rounded-xl bg-slate-200 text-slate-400 font-bold text-xs cursor-not-allowed flex items-center gap-1.5"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                Applications Closed
              </button>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onOpenApply(internship);
                }}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/30 transition flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Apply for this Internship
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
