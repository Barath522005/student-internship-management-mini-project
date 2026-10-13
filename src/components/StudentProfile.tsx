import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  GraduationCap,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Building,
  Phone,
  Mail,
  Calendar,
  Save
} from 'lucide-react';

export const StudentProfile: React.FC = () => {
  const { currentUser, updateProfile, changePassword } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'academic' | 'security'>('profile');

  // Personal form
  const [fullName, setFullName] = useState(currentUser?.full_name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');

  // Academic form
  const [collegeName, setCollegeName] = useState(currentUser?.college_name || '');
  const [department, setDepartment] = useState(currentUser?.department || '');
  const [degree, setDegree] = useState(currentUser?.degree || '');
  const [graduationYear, setGraduationYear] = useState(currentUser?.graduation_year?.toString() || '2027');

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Alerts
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <p className="text-slate-600">Please log in to manage your profile.</p>
      </div>
    );
  }

  const handleUpdatePersonal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setMessage({ type: 'error', text: 'Full name cannot be blank.' });
      return;
    }
    const res = updateProfile({
      full_name: fullName.trim(),
      phone: phone.trim(),
    });
    setMessage({ type: res.success ? 'success' : 'error', text: res.message });
  };

  const handleUpdateAcademic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!collegeName.trim() || !department.trim() || !degree.trim()) {
      setMessage({ type: 'error', text: 'Please fill in all academic required fields.' });
      return;
    }
    const res = updateProfile({
      college_name: collegeName.trim(),
      department: department.trim(),
      degree: degree.trim(),
      graduation_year: parseInt(graduationYear, 10) || 2027,
    });
    setMessage({ type: res.success ? 'success' : 'error', text: res.message });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must contain at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    const res = changePassword(currentPassword, newPassword);
    if (res.success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setMessage({ type: 'success', text: res.message });
    } else {
      setMessage({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Student Profile & Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Maintain your personal information, academic qualifications, and account security.
        </p>
      </div>

      {/* Flash Alert */}
      {message && (
        <div
          className={`p-4 rounded-xl flex items-start gap-3 text-sm ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
          )}
          <div className="flex-1 font-medium">{message.text}</div>
          <button
            onClick={() => setMessage(null)}
            className="text-xs opacity-70 hover:opacity-100 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50/70">
          <button
            onClick={() => {
              setActiveTab('profile');
              setMessage(null);
            }}
            className={`flex-1 py-3.5 px-4 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            Personal Details
          </button>

          <button
            onClick={() => {
              setActiveTab('academic');
              setMessage(null);
            }}
            className={`flex-1 py-3.5 px-4 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'academic'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Academic Details
          </button>

          <button
            onClick={() => {
              setActiveTab('security');
              setMessage(null);
            }}
            className={`flex-1 py-3.5 px-4 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'security'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            Security & Password
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {/* TAB 1: PERSONAL DETAILS */}
          {activeTab === 'profile' && (
            <form onSubmit={handleUpdatePersonal} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Email Address (Registered)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="email"
                      disabled
                      value={currentUser.email}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 text-sm cursor-not-allowed"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Institutional email cannot be modified directly.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Contact Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Account Created
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      disabled
                      value={currentUser.created_at}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 text-sm cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-sm transition flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Personal Details
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: ACADEMIC DETAILS */}
          {activeTab === 'academic' && (
            <form onSubmit={handleUpdateAcademic} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    College / University Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Department / Discipline <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Computer Science and Engineering"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Degree Program <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    placeholder="e.g. B.Tech / B.E. / MCA"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Expected Graduation Year <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                    <option value="2028">2028</option>
                    <option value="2029">2029</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-sm transition flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Academic Information
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: SECURITY & PASSWORD */}
          {activeTab === 'security' && (
            <form onSubmit={handleChangePassword} className="space-y-6 max-w-lg">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="Enter current password (demo: Student@123)"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  New Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Confirm New Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Re-type new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-sm transition flex items-center gap-2"
                >
                  <KeyRound className="w-4 h-4" />
                  Update Password
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
