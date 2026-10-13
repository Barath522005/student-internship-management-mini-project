import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Briefcase,
  Users,
  Building,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  FileCheck,
  Award,
  Sparkles,
  MapPin,
  Clock,
  BadgeDollarSign
} from 'lucide-react';
import { Internship } from '../types';

interface LandingPageProps {
  onNavigate: (view: string) => void;
  onOpenAuth: (mode: 'student-login' | 'student-register' | 'admin-login') => void;
  onSelectInternship: (internship: Internship) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onOpenAuth,
  onSelectInternship,
}) => {
  const { stats, internships, currentUser } = useApp();

  const activeInternships = internships.filter((i) => i.status === 'Active');
  const featured = activeInternships.slice(0, 3);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50 border-b border-slate-200/70 py-16 sm:py-24">
        {/* Subtle background blur accents */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 text-blue-800 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Official University Training & Placement Cell Portal</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Empowering Students with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700">
                Industry Internships
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Discover verified corporate internship opportunities, submit streamlined applications with custom cover letters, and track your recruitment status directly through the centralized college placement system.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('internships')}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/25 transition flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Briefcase className="w-4 h-4" />
                Explore Internships
              </button>

              {!currentUser ? (
                <button
                  onClick={() => onOpenAuth('student-register')}
                  className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-300 shadow-xs transition flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Get Started (Register)
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>
              ) : (
                <button
                  onClick={() => onNavigate(currentUser.role === 'admin' ? 'admin-dashboard' : 'student-dashboard')}
                  className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-300 shadow-xs transition flex items-center gap-2"
                >
                  Go to {currentUser.role === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>
              )}
            </div>
          </div>

          {/* Database-driven Live Statistics Bar */}
          <div className="mt-14 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/80 p-6 sm:p-8">
              <div className="text-center mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Live System Metrics (Direct from Relational Database)
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                <div className="text-center pt-3 md:pt-0">
                  <div className="flex items-center justify-center text-blue-600 mb-2">
                    <Building className="w-6 h-6" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                    {stats.activeInternships}
                  </div>
                  <div className="text-xs font-medium text-slate-500 mt-1">
                    Active Opportunities
                  </div>
                </div>

                <div className="text-center pt-3 md:pt-0">
                  <div className="flex items-center justify-center text-indigo-600 mb-2">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                    {stats.totalStudents}
                  </div>
                  <div className="text-xs font-medium text-slate-500 mt-1">
                    Registered Students
                  </div>
                </div>

                <div className="text-center pt-3 md:pt-0">
                  <div className="flex items-center justify-center text-amber-600 mb-2">
                    <FileCheck className="w-6 h-6" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                    {stats.totalApplications}
                  </div>
                  <div className="text-xs font-medium text-slate-500 mt-1">
                    Applications Processed
                  </div>
                </div>

                <div className="text-center pt-3 md:pt-0">
                  <div className="flex items-center justify-center text-emerald-600 mb-2">
                    <Award className="w-6 h-6" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                    {stats.acceptedApplications}
                  </div>
                  <div className="text-xs font-medium text-slate-500 mt-1">
                    Confirmed Selections
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Active Internships */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Handpicked Openings
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Featured Corporate Internships
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Top corporate drives currently accepting student applications.
            </p>
          </div>
          <button
            onClick={() => onNavigate('internships')}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 transition self-start sm:self-auto"
          >
            View all {internships.length} listings
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition flex flex-col justify-between p-6 group hover:border-blue-300"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                    {item.work_mode}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
                    <BadgeDollarSign className="w-3.5 h-3.5" />
                    {item.stipend}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-sm font-semibold text-slate-700 flex items-center gap-1 mt-0.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    {item.company_name}
                  </p>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.required_skills.split(',').slice(0, 3).map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                  {item.required_skills.split(',').length > 3 && (
                    <span className="text-[11px] text-slate-400 py-0.5 px-1">
                      +{item.required_skills.split(',').length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[11px] text-slate-500 space-y-0.5">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span className="truncate max-w-[130px]">{item.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Closes {item.application_deadline}</span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectInternship(item)}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white font-semibold text-xs transition"
                >
                  View & Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Clear & Transparent
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight">
              How the Placement Portal Works
            </h2>
            <p className="text-sm text-slate-400">
              A structured 4-step workflow connecting students, academic advisors, and corporate recruiters.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700/80 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-base">
                1
              </div>
              <h3 className="font-bold text-base text-white">Create Student Profile</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Register with your college email, graduation year, degree, and department. Academic information is securely verified.
              </p>
            </div>

            <div className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700/80 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-base">
                2
              </div>
              <h3 className="font-bold text-base text-white">Explore & Filter Openings</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Filter by technical skills, work mode (Remote/Hybrid/On-site), duration, stipend, and strict eligibility thresholds.
              </p>
            </div>

            <div className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700/80 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold text-base">
                3
              </div>
              <h3 className="font-bold text-base text-white">Submit Cover Letter</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Apply with a tailored message directly through the portal. The system prevents duplicate applications automatically.
              </p>
            </div>

            <div className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700/80 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-base">
                4
              </div>
              <h3 className="font-bold text-base text-white">Track Application Status</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Receive live status updates (Pending, Under Review, Shortlisted, Accepted) and review feedback remarks from admins.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* System Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Engineered for Academic Excellence
          </span>
          <h2 className="text-3xl font-bold text-slate-900">
            Comprehensive Platform Features
          </h2>
          <p className="text-sm text-slate-600">
            Equipped with modern UI/UX design, relational integrity, and strict role separation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Dedicated Student Portal</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Students manage personal profiles, maintain academic credentials, explore internship opportunities, and view submitted applications with reviewer remarks.
            </p>
            <ul className="text-xs text-slate-600 space-y-1.5 pt-2">
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                Real-time dashboard metrics
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                Duplicate application prevention
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                Custom application statements
              </li>
            </ul>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Placement Admin Controls</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Complete administrative authority to publish and edit corporate internships, review student submissions, short-list candidates, and record administrative remarks.
            </p>
            <ul className="text-xs text-slate-600 space-y-1.5 pt-2">
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                Full CRUD for internship postings
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                Multi-stage status updater
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                Student directory & audit log
              </li>
            </ul>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Building className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Relational Database Core</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Built on a normalized MySQL schema with foreign key constraints, cascading rules, unique composite keys, and index-optimized query performance.
            </p>
            <ul className="text-xs text-slate-600 space-y-1.5 pt-2">
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                Unique constraint on (student_id, internship_id)
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                PHP 8+ PDO prepared statements
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                100% compatible with standard XAMPP
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to begin your career journey?
            </h3>
            <p className="text-blue-100 text-sm">
              Register your student profile today or sign in as an administrator to explore the complete placement management workflow.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenAuth('student-register')}
              className="px-6 py-3 rounded-xl bg-white text-blue-700 font-bold text-sm shadow-md hover:bg-blue-50 transition"
            >
              Register Now
            </button>
            <button
              onClick={() => onOpenAuth('admin-login')}
              className="px-5 py-3 rounded-xl bg-blue-800/80 hover:bg-blue-800 text-white font-medium text-sm border border-blue-400/40 transition flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Access
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
