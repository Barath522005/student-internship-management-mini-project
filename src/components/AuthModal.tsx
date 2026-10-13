import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  User,
  Mail,
  Lock,
  Phone,
  Building,
  GraduationCap,
  Calendar,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export type AuthMode = 'student-login' | 'student-register' | 'admin-login';

interface AuthModalProps {
  initialMode: AuthMode;
  onClose: () => void;
  onSuccess: (role: 'student' | 'admin') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialMode,
  onClose,
  onSuccess,
}) => {
  const { login, registerStudent } = useApp();

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [error, setError] = useState<string | null>(null);

  // Common login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Student register fields
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [department, setDepartment] = useState('');
  const [degree, setDegree] = useState('B.Tech');
  const [graduationYear, setGraduationYear] = useState('2027');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const requiredRole = mode === 'admin-login' ? 'admin' : 'student';
    const res = login(loginEmail, loginPassword, requiredRole);

    if (res.success && res.user) {
      onSuccess(res.user.role);
      onClose();
    } else {
      setError(res.message);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (regPassword !== confirmPassword) {
      setError('Passwords do not match. Please verify and retry.');
      return;
    }
    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    const res = registerStudent({
      full_name: fullName,
      email: regEmail,
      phone,
      college_name: collegeName,
      department,
      degree,
      graduation_year: parseInt(graduationYear, 10) || 2027,
      password: regPassword,
    });

    if (res.success) {
      onSuccess('student');
      onClose();
    } else {
      setError(res.message);
    }
  };

  const fillDemoStudent = (email: string) => {
    setLoginEmail(email);
    setLoginPassword('Student@123');
    setError(null);
  };

  const fillDemoAdmin = () => {
    setLoginEmail('admin@example.com');
    setLoginPassword('Admin@123');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header Tabs */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              {mode === 'admin-login' ? (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Administrator Portal
                </span>
              ) : (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 flex items-center gap-1">
                  <GraduationCap className="w-3 h-3" /> Student Portal
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {mode === 'student-login'
                ? 'Student Sign In'
                : mode === 'admin-login'
                ? 'Admin Sign In'
                : 'Create Student Account'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* STUDENT LOGIN & ADMIN LOGIN */}
          {(mode === 'student-login' || mode === 'admin-login') && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {mode === 'admin-login' ? 'Admin Email Address' : 'Student Email Address'} *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder={mode === 'admin-login' ? 'admin@example.com' : 'rahul.sharma@college.edu'}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter account password"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Demo quick fill button */}
              <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-medium">Evaluation Preset:</span>
                {mode === 'admin-login' ? (
                  <button
                    type="button"
                    onClick={fillDemoAdmin}
                    className="font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded border border-amber-200 transition"
                  >
                    Fill Admin (Admin@123)
                  </button>
                ) : (
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => fillDemoStudent('rahul.sharma@college.edu')}
                      className="font-bold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded border border-blue-200 transition"
                    >
                      Fill Rahul
                    </button>
                    <button
                      type="button"
                      onClick={() => fillDemoStudent('priya.patel@college.edu')}
                      className="font-bold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded border border-blue-200 transition"
                    >
                      Fill Priya
                    </button>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className={`w-full py-2.5 rounded-xl font-bold text-white transition shadow-sm ${
                  mode === 'admin-login' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Sign In to {mode === 'admin-login' ? 'Admin Console' : 'Student Portal'}
              </button>

              <div className="pt-2 text-center text-slate-500 border-t border-slate-100 space-y-1">
                {mode === 'student-login' ? (
                  <>
                    <p>
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setMode('student-register');
                          setError(null);
                        }}
                        className="text-blue-600 font-bold hover:underline"
                      >
                        Register as Student
                      </button>
                    </p>
                    <p>
                      College Administrator?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setMode('admin-login');
                          setError(null);
                        }}
                        className="text-amber-700 font-semibold hover:underline"
                      >
                        Switch to Admin Login
                      </button>
                    </p>
                  </>
                ) : (
                  <p>
                    Are you a student?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('student-login');
                        setError(null);
                      }}
                      className="text-blue-600 font-bold hover:underline"
                    >
                      Go to Student Portal
                    </button>
                  </p>
                )}
              </div>
            </form>
          )}

          {/* STUDENT REGISTRATION */}
          {mode === 'student-register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs max-h-[65vh] overflow-y-auto pr-1">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. yourname@college.edu"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">College Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. National Institute of Technology"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Department *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Computer Science"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Degree Program *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. B.Tech / B.E."
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Graduation Year *</label>
                <select
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                  <option value="2029">2029</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="Min 6 chars"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Confirm Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="Re-type password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow-sm mt-2"
              >
                Complete Registration
              </button>

              <div className="pt-2 text-center text-slate-500 border-t border-slate-100">
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('student-login');
                      setError(null);
                    }}
                    className="text-blue-600 font-bold hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
