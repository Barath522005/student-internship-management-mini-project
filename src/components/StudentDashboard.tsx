import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Briefcase,
  Send,
  Clock,
  CheckCircle2,
  Building,
  MapPin,
  ArrowRight,
  User,
  BadgeDollarSign,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Internship } from '../types';

interface StudentDashboardProps {
  onNavigate: (view: string) => void;
  onSelectInternship: (internship: Internship) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onNavigate,
  onSelectInternship,
}) => {
  const { currentUser, internships, applications } = useApp();

  if (!currentUser || currentUser.role !== 'student') {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-800">Student Access Only</h2>
        <p className="text-slate-600 mt-2">Please log in with a student account to view this dashboard.</p>
        <button
          onClick={() => onNavigate('home')}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold"
        >
          Go to Home
        </button>
      </div>
    );
  }

  // Student specific statistics
  const studentApplications = applications.filter((a) => a.student_id === currentUser.id);
  const totalAvailable = internships.filter((i) => i.status === 'Active').length;
  const submittedCount = studentApplications.length;
  const pendingCount = studentApplications.filter(
    (a) => a.status === 'Pending' || a.status === 'Under Review'
  ).length;
  const acceptedCount = studentApplications.filter((a) => a.status === 'Accepted').length;

  // Recently added active internships
  const recentInternships = [...internships]
    .filter((i) => i.status === 'Active')
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4);

  // Recent applications by student
  const recentStudentApps = [...studentApplications]
    .sort((a, b) => new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime())
    .slice(0, 3);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Shortlisted':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Under Review':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Rejected':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/30 text-blue-200 text-xs font-semibold">
            <span>Student Dashboard</span>
            <span>•</span>
            <span>{currentUser.department}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {currentUser.full_name}! 👋
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm max-w-xl">
            {currentUser.college_name} | {currentUser.degree} (Batch of {currentUser.graduation_year})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('internships')}
            className="px-4 py-2.5 bg-white text-blue-700 rounded-xl text-xs sm:text-sm font-bold shadow-md hover:bg-blue-50 transition flex items-center gap-1.5"
          >
            <Briefcase className="w-4 h-4" />
            Find Internships
          </button>
          <button
            onClick={() => onNavigate('student-profile')}
            className="px-4 py-2.5 bg-blue-600/60 hover:bg-blue-600 border border-blue-400/40 text-white rounded-xl text-xs sm:text-sm font-medium transition flex items-center gap-1.5"
          >
            <User className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Database Driven Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Available */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {totalAvailable}
            </div>
            <div className="text-xs text-slate-500 font-medium">Available Internships</div>
          </div>
        </div>

        {/* Applications Submitted */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Send className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {submittedCount}
            </div>
            <div className="text-xs text-slate-500 font-medium">Submitted Applications</div>
          </div>
        </div>

        {/* Pending Applications */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {pendingCount}
            </div>
            <div className="text-xs text-slate-500 font-medium">Pending Review</div>
          </div>
        </div>

        {/* Accepted Applications */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {acceptedCount}
            </div>
            <div className="text-xs text-slate-500 font-medium">Accepted Offers</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Recently Added Opportunities (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recently Added Internships</h2>
              <p className="text-xs text-slate-500">Fresh openings from top recruiting organizations</p>
            </div>
            <button
              onClick={() => onNavigate('internships')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recentInternships.map((internship) => (
              <div
                key={internship.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-blue-300 transition flex flex-col justify-between group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                      {internship.work_mode}
                    </span>
                    <span className="text-xs font-bold text-emerald-700">
                      {internship.stipend}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition line-clamp-1">
                    {internship.title}
                  </h3>

                  <p className="text-xs font-medium text-slate-600 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    {internship.company_name}
                  </p>

                  <p className="text-xs text-slate-500 line-clamp-2">
                    {internship.description}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate max-w-[120px]">{internship.location}</span>
                  </div>
                  <button
                    onClick={() => onSelectInternship(internship)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: My Recent Applications Status Tracker (1 col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Application Status</h2>
              <p className="text-xs text-slate-500">Your recent submissions</p>
            </div>
            <button
              onClick={() => onNavigate('student-applications')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              See all <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 divide-y divide-slate-100">
            {recentStudentApps.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <Send className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-500">You haven't applied to any internships yet.</p>
                <button
                  onClick={() => onNavigate('internships')}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold"
                >
                  Browse Now
                </button>
              </div>
            ) : (
              recentStudentApps.map((app) => {
                const internship = internships.find((i) => i.id === app.internship_id);
                return (
                  <div key={app.id} className="py-3 first:pt-0 last:pb-0 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">
                        {internship ? internship.title : `Internship #${app.internship_id}`}
                      </h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(
                          app.status
                        )}`}
                      >
                        {app.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Building className="w-3 h-3 text-slate-400" />
                      {internship?.company_name}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Applied: {app.applied_at.substring(0, 10)}
                      </span>
                      {app.admin_remarks && (
                        <span className="text-blue-600 font-medium">Remarks added</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}

            <div className="pt-4 text-center">
              <button
                onClick={() => onNavigate('student-applications')}
                className="w-full py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-700 transition"
              >
                Track All Applications ({submittedCount})
              </button>
            </div>
          </div>

          {/* Quick Academic Profile Summary Card */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Academic Profile
              </span>
              <button
                onClick={() => onNavigate('student-profile')}
                className="text-xs text-blue-600 font-semibold hover:underline"
              >
                Update
              </button>
            </div>
            <div className="text-xs space-y-1.5 text-slate-600">
              <p>
                <strong>College:</strong> {currentUser.college_name}
              </p>
              <p>
                <strong>Dept:</strong> {currentUser.department}
              </p>
              <p>
                <strong>Degree & Year:</strong> {currentUser.degree} • Class of{' '}
                {currentUser.graduation_year}
              </p>
              <p>
                <strong>Email:</strong> {currentUser.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
