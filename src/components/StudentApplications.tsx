import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ApplicationStatus } from '../types';
import {
  FileCheck2,
  Building,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  Briefcase
} from 'lucide-react';

interface StudentApplicationsProps {
  onNavigateToInternships: () => void;
}

export const StudentApplications: React.FC<StudentApplicationsProps> = ({
  onNavigateToInternships,
}) => {
  const { currentUser, applications, internships } = useApp();
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  if (!currentUser || currentUser.role !== 'student') {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <p className="text-slate-600">Please log in as a student to view your applications.</p>
      </div>
    );
  }

  // Get current student applications
  const myApplications = applications.filter((app) => app.student_id === currentUser.id);

  const filteredApps = myApplications.filter((app) => {
    if (selectedStatus !== 'All' && app.status !== selectedStatus) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const internship = internships.find((i) => i.id === app.internship_id);
      const titleMatch = internship?.title.toLowerCase().includes(q);
      const companyMatch = internship?.company_name.toLowerCase().includes(q);
      if (!titleMatch && !companyMatch) return false;
    }
    return true;
  });

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'Accepted':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-500',
          desc: 'Congratulations! Your application has been accepted.',
        };
      case 'Shortlisted':
        return {
          bg: 'bg-purple-50 text-purple-800 border-purple-200',
          dot: 'bg-purple-500',
          desc: 'Shortlisted for next evaluation / interview round.',
        };
      case 'Under Review':
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-200',
          dot: 'bg-blue-500',
          desc: 'Your application is currently being evaluated by the committee.',
        };
      case 'Pending':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
          desc: 'Application received and queued for review.',
        };
      case 'Rejected':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          dot: 'bg-rose-500',
          desc: 'Application was not selected for this cycle.',
        };
      default:
        return {
          bg: 'bg-slate-50 text-slate-800 border-slate-200',
          dot: 'bg-slate-500',
          desc: 'Status unknown.',
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Application Tracking</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            My Internship Applications
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time status updates and administrative feedback on your submissions.
          </p>
        </div>

        <button
          onClick={onNavigateToInternships}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-2 self-start sm:self-auto"
        >
          <Briefcase className="w-4 h-4" />
          Find More Internships
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px] mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Status:
          </span>
          {['All', 'Pending', 'Under Review', 'Shortlisted', 'Accepted', 'Rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                selectedStatus === st
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by company or title..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Applications List */}
      {filteredApps.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No applications match your criteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {myApplications.length === 0
              ? 'You have not submitted any applications yet. Explore our open listings to apply.'
              : 'Try clearing status filters to view all your submissions.'}
          </p>
          {myApplications.length === 0 && (
            <button
              onClick={onNavigateToInternships}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition"
            >
              Browse Open Opportunities
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApps.map((app) => {
            const internship = internships.find((i) => i.id === app.internship_id);
            const badgeMeta = getStatusBadge(app.status);

            return (
              <div
                key={app.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition p-6 space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {internship?.title || `Internship #${app.internship_id}`}
                    </h3>
                    <div className="flex items-center gap-3 text-xs font-semibold text-slate-600 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        {internship?.company_name}
                      </span>
                      <span>•</span>
                      <span>{internship?.work_mode}</span>
                      <span>•</span>
                      <span className="text-emerald-700">{internship?.stipend}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badgeMeta.bg}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${badgeMeta.dot}`}></span>
                      {app.status}
                    </span>
                  </div>
                </div>

                {/* Status Explanation Bar */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {badgeMeta.desc}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Applied on: {app.applied_at}
                  </span>
                </div>

                {/* Submitted Message */}
                <div className="space-y-1 text-xs">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">
                    Your Application Statement / Cover Letter
                  </span>
                  <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/60 text-slate-700 leading-relaxed italic">
                    "{app.application_message}"
                  </div>
                </div>

                {/* Admin Remarks (If provided) */}
                {app.admin_remarks ? (
                  <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-1 text-xs">
                    <span className="font-bold text-amber-900 flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-amber-700" />
                      Placement Coordinator Remarks:
                    </span>
                    <p className="text-amber-800 leading-relaxed">
                      {app.admin_remarks}
                    </p>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-400 italic">
                    No administrator comments recorded yet.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
