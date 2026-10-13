import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ApplicationStatus } from '../types';
import {
  FileCheck2,
  Building,
  User,
  GraduationCap,
  Calendar,
  Filter,
  Search,
  MessageSquare,
  CheckCircle2,
  X,
  Save,
  Clock,
  Sparkles
} from 'lucide-react';

interface AdminApplicationsProps {
  initialAppIdForReview?: number | null;
}

export const AdminApplications: React.FC<AdminApplicationsProps> = ({
  initialAppIdForReview,
}) => {
  const { applications, internships, users, updateApplicationStatus } = useApp();

  const [selectedInternshipId, setSelectedInternshipId] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Review modal state
  const [reviewAppId, setReviewAppId] = useState<number | null>(initialAppIdForReview || null);
  const [newStatus, setNewStatus] = useState<ApplicationStatus>('Under Review');
  const [remarks, setRemarks] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Filter applications
  const filtered = applications.filter((app) => {
    if (selectedInternshipId !== 'All' && app.internship_id.toString() !== selectedInternshipId) {
      return false;
    }
    if (selectedStatus !== 'All' && app.status !== selectedStatus) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const student = users.find((u) => u.id === app.student_id);
      const internship = internships.find((i) => i.id === app.internship_id);
      const nameMatch = student?.full_name.toLowerCase().includes(q);
      const emailMatch = student?.email.toLowerCase().includes(q);
      const titleMatch = internship?.title.toLowerCase().includes(q);
      const companyMatch = internship?.company_name.toLowerCase().includes(q);
      if (!nameMatch && !emailMatch && !titleMatch && !companyMatch) return false;
    }
    return true;
  });

  const activeReviewApp = reviewAppId ? applications.find((a) => a.id === reviewAppId) : null;
  const reviewStudent = activeReviewApp ? users.find((u) => u.id === activeReviewApp.student_id) : null;
  const reviewInternship = activeReviewApp ? internships.find((i) => i.id === activeReviewApp.internship_id) : null;

  const handleOpenReview = (appId: number) => {
    const app = applications.find((a) => a.id === appId);
    if (app) {
      setReviewAppId(app.id);
      setNewStatus(app.status);
      setRemarks(app.admin_remarks || '');
      setSaveSuccess(false);
    }
  };

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReviewApp) return;

    const res = updateApplicationStatus(activeReviewApp.id, newStatus, remarks);
    if (res.success) {
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setReviewAppId(null);
      }, 1000);
    }
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'Accepted':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Shortlisted':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'Under Review':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Rejected':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Student Application Management
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review candidate qualifications, cover letters, update application statuses, and append administrative feedback.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate name, email, or company..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Internship Filter Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-500 uppercase text-[10px]">Internship:</span>
            <select
              value={selectedInternshipId}
              onChange={(e) => setSelectedInternshipId(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:ring-1 focus:ring-blue-500 max-w-xs"
            >
              <option value="All">All Opportunities ({internships.length})</option>
              {internships.map((i) => (
                <option key={i.id} value={i.id.toString()}>
                  {i.company_name} - {i.title}
                </option>
              ))}
            </select>
          </div>

          {/* Status buttons */}
          <div className="flex items-center gap-1">
            <span className="font-bold text-slate-500 uppercase text-[10px] mr-1">Status:</span>
            {['All', 'Pending', 'Under Review', 'Shortlisted', 'Accepted', 'Rejected'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  selectedStatus === st
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Applications Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Applicant Student</th>
                <th className="py-3.5 px-4">Applied Opportunity</th>
                <th className="py-3.5 px-4">Application Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Admin Remarks</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No applications matching the specified filters.
                  </td>
                </tr>
              ) : (
                filtered.map((app) => {
                  const student = users.find((u) => u.id === app.student_id);
                  const internship = internships.find((i) => i.id === app.internship_id);

                  return (
                    <tr key={app.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-blue-500" />
                          {student?.full_name || `Student #${app.student_id}`}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {student?.department} • {student?.email}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{internship?.title}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Building className="w-3 h-3 text-slate-400" />
                          {internship?.company_name}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {app.applied_at.substring(0, 10)}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadge(
                            app.status
                          )}`}
                        >
                          {app.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        {app.admin_remarks ? (
                          <span className="text-slate-700 truncate block text-[11px]">
                            {app.admin_remarks}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">No remarks</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleOpenReview(app.id)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition"
                        >
                          Review & Update
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {activeReviewApp && reviewStudent && reviewInternship && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Review Application #{activeReviewApp.id}
                </h2>
                <p className="text-xs text-slate-500">
                  Candidate evaluation and placement status changer
                </p>
              </div>
              <button
                onClick={() => setReviewAppId(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReview} className="p-6 space-y-5">
              {saveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Application status and remarks saved successfully in the database!</span>
                </div>
              )}

              {/* Student Profile Card */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-2 text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">
                  Candidate Information
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">
                    {reviewStudent.full_name}
                  </span>
                  <span className="text-slate-500 font-mono">{reviewStudent.email}</span>
                </div>
                <div className="text-slate-600 space-y-0.5">
                  <p>
                    <strong>College:</strong> {reviewStudent.college_name}
                  </p>
                  <p>
                    <strong>Dept & Program:</strong> {reviewStudent.department} ({reviewStudent.degree}, Class of {reviewStudent.graduation_year})
                  </p>
                  <p>
                    <strong>Contact:</strong> {reviewStudent.phone}
                  </p>
                </div>
              </div>

              {/* Internship Target */}
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs space-y-1">
                <span className="font-bold text-blue-900 block">
                  Applied Opportunity: {reviewInternship.title}
                </span>
                <p className="text-blue-700">
                  {reviewInternship.company_name} • {reviewInternship.work_mode} • {reviewInternship.stipend}
                </p>
              </div>

              {/* Student's cover letter */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 text-xs block">
                  Student's Application Statement / Cover Letter:
                </label>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed italic">
                  "{activeReviewApp.application_message}"
                </div>
              </div>

              {/* Status Selector */}
              <div>
                <label className="font-bold text-slate-700 text-xs block mb-1.5">
                  Update Application Status <span className="text-rose-500">*</span>
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ApplicationStatus)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="Pending">Pending (Queue for review)</option>
                  <option value="Under Review">Under Review (Committee evaluating)</option>
                  <option value="Shortlisted">Shortlisted (Proceed to Interview)</option>
                  <option value="Accepted">Accepted (Offer Letter Issued)</option>
                  <option value="Rejected">Rejected (Not Selected)</option>
                </select>
              </div>

              {/* Admin Remarks */}
              <div>
                <label className="font-bold text-slate-700 text-xs block mb-1.5">
                  Administrative Remarks / Reviewer Notes (Visible to Student):
                </label>
                <textarea
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Cleared technical interview round 1. Interview with VP scheduled on Friday."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-1 focus:ring-blue-500 leading-relaxed"
                ></textarea>
              </div>

              {/* Buttons */}
              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReviewAppId(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  Save Status & Remarks
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
