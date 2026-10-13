import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Briefcase,
  Building,
  FileCheck2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  FileText
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (view: string) => void;
  onOpenAddInternship: () => void;
  onSelectApplicationForReview?: (appId: number) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigate,
  onOpenAddInternship,
  onSelectApplicationForReview,
}) => {
  const { stats, internships, applications, users, currentUser } = useApp();

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-800">Administrator Access Required</h2>
        <p className="text-sm text-slate-500 mt-1">
          Please log in through the Administrator Portal to view placement control metrics.
        </p>
      </div>
    );
  }

  // Pending applications queue
  const pendingApplications = applications.filter(
    (a) => a.status === 'Pending' || a.status === 'Under Review'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Placement Officer Administration Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Placement Management Dashboard
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
            Logged in as <strong>{currentUser.full_name}</strong> ({currentUser.email}) • Real-time database synchronizer active.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenAddInternship}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-500/25 transition flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Post New Internship
          </button>
          <button
            onClick={() => onNavigate('admin-applications')}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-xs sm:text-sm font-medium transition flex items-center gap-2"
          >
            <FileCheck2 className="w-4 h-4 text-amber-400" />
            Review Applications ({pendingApplications.length})
          </button>
        </div>
      </div>

      {/* Database Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Students */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-indigo-600">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Students
            </span>
            <Users className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {stats.totalStudents}
          </div>
          <p className="text-[11px] text-slate-500">Registered candidates</p>
        </div>

        {/* Total Internships */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-blue-600">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Postings
            </span>
            <Briefcase className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {stats.totalInternships}
          </div>
          <p className="text-[11px] text-slate-500">All corporate drives</p>
        </div>

        {/* Active Internships */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Openings
            </span>
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-700">
            {stats.activeInternships}
          </div>
          <p className="text-[11px] text-slate-500">Currently accepting applications</p>
        </div>

        {/* Total Applications */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-purple-600">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Applications
            </span>
            <FileText className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {stats.totalApplications}
          </div>
          <p className="text-[11px] text-slate-500">Submissions received</p>
        </div>

        {/* Pending Review */}
        <div className="bg-white rounded-2xl p-5 border border-amber-200 bg-amber-50/20 shadow-xs space-y-2 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Pending Review
            </span>
            <Clock className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold text-amber-700">
            {stats.pendingApplications}
          </div>
          <p className="text-[11px] text-amber-700 font-medium">Awaiting evaluation</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Applications Queue (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Action Items: Applications Awaiting Review
              </h2>
              <p className="text-xs text-slate-500">
                Review candidate statements, evaluate profiles, and assign status.
              </p>
            </div>
            <button
              onClick={() => onNavigate('admin-applications')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              All applications <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            {pendingApplications.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className="text-xs font-semibold text-slate-700">All caught up!</p>
                <p className="text-xs text-slate-500">No applications currently pending evaluation.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {pendingApplications.slice(0, 5).map((app) => {
                  const student = users.find((u) => u.id === app.student_id);
                  const internship = internships.find((i) => i.id === app.internship_id);

                  return (
                    <div key={app.id} className="p-4 sm:p-5 hover:bg-slate-50/60 transition space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="text-xs font-bold text-slate-900">
                            {student?.full_name || `Student #${app.student_id}`}
                          </span>
                          <span className="text-xs text-slate-500 ml-2">
                            ({student?.department || 'Department'})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              app.status === 'Pending'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {app.status}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {app.applied_at.substring(0, 10)}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-700 font-medium flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span>Applied for: <strong>{internship?.title}</strong> ({internship?.company_name})</span>
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-2 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                        "{app.application_message}"
                      </p>

                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => {
                            if (onSelectApplicationForReview) {
                              onSelectApplicationForReview(app.id);
                            } else {
                              onNavigate('admin-applications');
                            }
                          }}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition"
                        >
                          Review & Update Status →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Quick Administration Actions & System Health */}
        <div className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">Quick Administrative Tools</h2>
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <button
                onClick={onOpenAddInternship}
                className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                Add New Internship Listing
              </button>

              <button
                onClick={() => onNavigate('admin-internships')}
                className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2"
              >
                <Building className="w-4 h-4 text-slate-500" />
                Manage All Internships ({internships.length})
              </button>

              <button
                onClick={() => onNavigate('admin-students')}
                className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2"
              >
                <Users className="w-4 h-4 text-slate-500" />
                Directory of Students ({stats.totalStudents})
              </button>
            </div>
          </div>

          {/* Placement Distribution Overview */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Work Mode Distribution
            </h3>

            <div className="space-y-2 text-xs">
              {['Remote', 'Hybrid', 'On-site'].map((mode) => {
                const count = internships.filter((i) => i.work_mode === mode).length;
                const pct = internships.length ? Math.round((count / internships.length) * 100) : 0;
                return (
                  <div key={mode} className="space-y-1">
                    <div className="flex justify-between text-slate-600 font-medium">
                      <span>{mode}</span>
                      <span>{count} ({pct}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
