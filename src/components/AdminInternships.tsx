import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Internship, WorkMode, InternshipStatus } from '../types';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Building,
  MapPin,
  Calendar,
  Users,
  AlertCircle,
  X,
  Save,
  Clock,
  BadgeDollarSign
} from 'lucide-react';

interface AdminInternshipsProps {
  onOpenAddModal: () => void;
}

export const AdminInternships: React.FC<AdminInternshipsProps> = ({
  onOpenAddModal,
}) => {
  const {
    internships,
    applications,
    updateInternship,
    deleteInternship,
    toggleInternshipStatus,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterMode, setFilterMode] = useState<string>('All');

  // Edit modal state
  const [editingInternship, setEditingInternship] = useState<Internship | null>(null);
  const [editForm, setEditForm] = useState<Partial<Internship>>({});
  const [editError, setEditError] = useState<string | null>(null);

  // Delete confirmation modal state
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const filtered = internships.filter((item) => {
    if (filterStatus !== 'All' && item.status !== filterStatus) return false;
    if (filterMode !== 'All' && item.work_mode !== filterMode) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchCompany = item.company_name.toLowerCase().includes(q);
      const matchSkills = item.required_skills.toLowerCase().includes(q);
      if (!matchTitle && !matchCompany && !matchSkills) return false;
    }
    return true;
  });

  const handleStartEdit = (item: Internship) => {
    setEditingInternship(item);
    setEditForm({ ...item });
    setEditError(null);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInternship) return;

    if (
      !editForm.title?.trim() ||
      !editForm.company_name?.trim() ||
      !editForm.description?.trim() ||
      !editForm.required_skills?.trim() ||
      !editForm.application_deadline
    ) {
      setEditError('Please fill in all mandatory fields.');
      return;
    }

    const res = updateInternship(editingInternship.id, editForm);
    if (res.success) {
      setEditingInternship(null);
    } else {
      setEditError(res.message);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingId !== null) {
      deleteInternship(deletingId);
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Internship Postings Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Create, edit, toggle visibility, and maintain application deadlines for all campus drives.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add New Internship
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, company, or skills..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-500 uppercase text-[10px]">Status:</span>
            {['All', 'Active', 'Closed'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  filterStatus === st
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-500 uppercase text-[10px]">Mode:</span>
            {['All', 'Remote', 'Hybrid', 'On-site'].map((m) => (
              <button
                key={m}
                onClick={() => setFilterMode(m)}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  filterMode === m
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table of Internships */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Opportunity</th>
                <th className="py-3.5 px-4">Work Mode</th>
                <th className="py-3.5 px-4">Stipend & Duration</th>
                <th className="py-3.5 px-4">Positions</th>
                <th className="py-3.5 px-4">Deadline</th>
                <th className="py-3.5 px-4">Applicants</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No internship postings found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const applicantCount = applications.filter((a) => a.internship_id === item.id).length;
                  const isClosed = item.status === 'Closed';

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 line-clamp-1">{item.title}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Building className="w-3 h-3 text-slate-400" />
                          {item.company_name} • {item.location}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {item.work_mode}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-emerald-700">{item.stipend}</div>
                        <div className="text-[11px] text-slate-400">{item.duration}</div>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-700">
                        {item.available_positions}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-mono text-slate-600">
                          {item.application_deadline}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          {applicantCount} applied
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => toggleInternshipStatus(item.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition ${
                            isClosed
                              ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          }`}
                          title="Click to toggle Active / Closed status"
                        >
                          {isClosed ? (
                            <>
                              <XCircle className="w-3 h-3" /> Closed
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3 h-3" /> Active
                            </>
                          )}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => handleStartEdit(item)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition"
                          title="Edit Internship"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(item.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Delete Internship"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Edit Internship Modal */}
      {editingInternship && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                Edit Internship Posting #{editingInternship.id}
              </h2>
              <button
                onClick={() => setEditingInternship(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {editError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
                  {editError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Internship Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.title || ''}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.company_name || ''}
                    onChange={(e) => setEditForm({ ...editForm, company_name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">
                    Description & Responsibilities *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={editForm.description || ''}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-blue-500"
                  ></textarea>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Required Skills (comma-separated) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.required_skills || ''}
                    onChange={(e) => setEditForm({ ...editForm, required_skills: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Eligibility Criteria *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.eligibility || ''}
                    onChange={(e) => setEditForm({ ...editForm, eligibility: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    value={editForm.location || ''}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Work Mode *</label>
                  <select
                    value={editForm.work_mode || 'On-site'}
                    onChange={(e) => setEditForm({ ...editForm, work_mode: e.target.value as WorkMode })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Duration *</label>
                  <input
                    type="text"
                    required
                    value={editForm.duration || ''}
                    onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Stipend *</label>
                  <input
                    type="text"
                    required
                    value={editForm.stipend || ''}
                    onChange={(e) => setEditForm({ ...editForm, stipend: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Available Positions *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={editForm.available_positions || 1}
                    onChange={(e) => setEditForm({ ...editForm, available_positions: parseInt(e.target.value, 10) || 1 })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Application Deadline *</label>
                  <input
                    type="date"
                    required
                    value={editForm.application_deadline || ''}
                    onChange={(e) => setEditForm({ ...editForm, application_deadline: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Status *</label>
                  <select
                    value={editForm.status || 'Active'}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as InternshipStatus })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingInternship(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingId !== null && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Delete Internship Listing?</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to permanently delete this opportunity? Any student applications linked to this posting will also be removed.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
