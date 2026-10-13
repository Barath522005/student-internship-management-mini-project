import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Internship, WorkMode } from '../types';
import {
  Search,
  Filter,
  Building,
  MapPin,
  Clock,
  BadgeDollarSign,
  Users,
  Calendar,
  Sparkles,
  ArrowUpDown,
  CheckCircle2,
  XCircle
} from 'lucide-react';

interface InternshipListingsProps {
  onSelectInternship: (internship: Internship) => void;
  onOpenApplyModal?: (internship: Internship) => void;
}

export const InternshipListings: React.FC<InternshipListingsProps> = ({
  onSelectInternship,
  onOpenApplyModal,
}) => {
  const { internships, currentUser, hasStudentApplied, getStudentApplication } = useApp();

  // Search & filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('Active'); // default show active
  const [sortBy, setSortBy] = useState<'deadline' | 'newest' | 'stipend'>('deadline');

  const filteredInternships = useMemo(() => {
    return internships
      .filter((item) => {
        // Status filter
        if (selectedStatus !== 'All' && item.status !== selectedStatus) {
          return false;
        }

        // Work mode filter
        if (selectedWorkMode !== 'All' && item.work_mode !== selectedWorkMode) {
          return false;
        }

        // Search term (title, company, skills, location)
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchCompany = item.company_name.toLowerCase().includes(q);
          const matchSkills = item.required_skills.toLowerCase().includes(q);
          const matchLocation = item.location.toLowerCase().includes(q);
          if (!matchTitle && !matchCompany && !matchSkills && !matchLocation) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'deadline') {
          return new Date(a.application_deadline).getTime() - new Date(b.application_deadline).getTime();
        }
        if (sortBy === 'newest') {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        return b.id - a.id;
      });
  }, [internships, searchTerm, selectedWorkMode, selectedStatus, sortBy]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedWorkMode('All');
    setSelectedStatus('Active');
    setSortBy('deadline');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Opportunities Portal</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Explore Internship Opportunities
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Browse verified company postings, filter by your required technical stack or work preference, and apply before application deadlines.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-6 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by job title, company name, skill (e.g. React, Python), or city..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-slate-400 bg-slate-50/50"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-3.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Badges & Dropdowns */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px] flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Work Mode:
            </span>
            {(['All', 'Remote', 'Hybrid', 'On-site'] as (WorkMode | 'All')[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setSelectedWorkMode(mode)}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  selectedWorkMode === mode
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {mode}
              </button>
            ))}

            <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block"></div>

            <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px] hidden sm:inline">
              Status:
            </span>
            {['Active', 'All', 'Closed'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  selectedStatus === status
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500 text-[11px] flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-300 text-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:ring-1 focus:ring-blue-500"
            >
              <option value="deadline">Deadline (Urgent First)</option>
              <option value="newest">Recently Posted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong>{filteredInternships.length}</strong> of {internships.length} opportunities
        </span>
        {(searchTerm || selectedWorkMode !== 'All' || selectedStatus !== 'Active') && (
          <button
            onClick={resetFilters}
            className="text-blue-600 hover:underline font-semibold"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Grid of Internships */}
      {filteredInternships.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No matching internships found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keywords, clear filter tags, or view closed listings to inspect archived drives.
          </p>
          <button
            onClick={resetFilters}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInternships.map((internship) => {
            const isClosed = internship.status === 'Closed';
            const deadlineDate = new Date(internship.application_deadline);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const isExpired = deadlineDate < today;

            // Student applied check
            const hasApplied = currentUser?.role === 'student' && hasStudentApplied(currentUser.id, internship.id);
            const existingApp = hasApplied && currentUser ? getStudentApplication(currentUser.id, internship.id) : null;

            return (
              <div
                key={internship.id}
                className={`bg-white rounded-2xl border transition flex flex-col justify-between p-6 hover:shadow-md ${
                  isClosed || isExpired ? 'border-slate-200 opacity-80' : 'border-slate-200/90 hover:border-blue-300'
                }`}
              >
                <div className="space-y-4">
                  {/* Top Badges */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                        {internship.work_mode}
                      </span>
                      {isClosed ? (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> Closed
                        </span>
                      ) : isExpired ? (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          Expired
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </span>
                      )}
                    </div>

                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50/70 px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0">
                      <BadgeDollarSign className="w-3.5 h-3.5" />
                      {internship.stipend}
                    </span>
                  </div>

                  {/* Title & Company */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-1">
                      {internship.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-600 flex items-center gap-1 mt-0.5">
                      <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{internship.company_name}</span>
                    </p>
                  </div>

                  {/* Description snippet */}
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {internship.description}
                  </p>

                  {/* Key Skills */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Required Skills
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {internship.required_skills.split(',').map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Meta Specs */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{internship.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{internship.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{internship.available_positions} openings</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className={isExpired ? 'text-rose-600 font-semibold' : ''}>
                        Due: {internship.application_deadline}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Area */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectInternship(internship)}
                    className="text-xs font-bold text-slate-700 hover:text-blue-600 py-1.5 transition"
                  >
                    View Details →
                  </button>

                  {hasApplied ? (
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                      Applied ({existingApp?.status})
                    </span>
                  ) : isClosed || isExpired ? (
                    <span className="text-[11px] text-slate-400 font-medium">
                      Applications Closed
                    </span>
                  ) : currentUser?.role === 'student' ? (
                    <button
                      onClick={() => {
                        if (onOpenApplyModal) onOpenApplyModal(internship);
                        else onSelectInternship(internship);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition"
                    >
                      Apply Now
                    </button>
                  ) : (
                    <button
                      onClick={() => onSelectInternship(internship)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition"
                    >
                      Check Criteria
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
