import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, UserCheck, RotateCcw, FileCode, CheckCircle2 } from 'lucide-react';

interface DemoQuickBarProps {
  onOpenXamppModal: () => void;
  onNavigate: (view: string) => void;
}

export const DemoQuickBar: React.FC<DemoQuickBarProps> = ({ onOpenXamppModal, onNavigate }) => {
  const { currentUser, quickSwitchUser, resetToSampleData } = useApp();
  const [resetNotice, setResetNotice] = React.useState(false);

  const handleReset = () => {
    if (window.confirm('Reset all databases (Users, Internships, Applications) to original sample records?')) {
      resetToSampleData();
      setResetNotice(true);
      setTimeout(() => setResetNotice(false), 3000);
    }
  };

  return (
    <div className="bg-slate-900 text-slate-300 border-b border-slate-800 text-xs px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 z-50">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-white flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          College Mini Project Demo Bar:
        </span>
        <span className="text-slate-400 hidden sm:inline">
          Active Role: <strong className="text-white">{currentUser ? `${currentUser.full_name} (${currentUser.role})` : 'Guest / Visitor'}</strong>
        </span>
      </div>

      <div className="flex items-center flex-wrap gap-1.5">
        <span className="text-slate-400 text-[11px] hidden md:inline">Quick Test Switch:</span>

        {/* Student 1 */}
        <button
          onClick={() => {
            quickSwitchUser('rahul.sharma@college.edu');
            onNavigate('student-dashboard');
          }}
          className={`px-2 py-0.5 rounded flex items-center gap-1 transition ${
            currentUser?.email === 'rahul.sharma@college.edu'
              ? 'bg-blue-600 text-white font-medium'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
          title="Switch to Student Rahul Sharma"
        >
          <UserCheck className="w-3 h-3" />
          <span>Student: Rahul</span>
        </button>

        {/* Student 2 */}
        <button
          onClick={() => {
            quickSwitchUser('priya.patel@college.edu');
            onNavigate('student-dashboard');
          }}
          className={`px-2 py-0.5 rounded flex items-center gap-1 transition ${
            currentUser?.email === 'priya.patel@college.edu'
              ? 'bg-blue-600 text-white font-medium'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
          title="Switch to Student Priya Patel"
        >
          <UserCheck className="w-3 h-3" />
          <span>Student: Priya</span>
        </button>

        {/* Admin */}
        <button
          onClick={() => {
            quickSwitchUser('admin@example.com');
            onNavigate('admin-dashboard');
          }}
          className={`px-2 py-0.5 rounded flex items-center gap-1 transition ${
            currentUser?.role === 'admin'
              ? 'bg-amber-600 text-white font-medium'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
          title="Switch to Placement Administrator"
        >
          <ShieldCheck className="w-3 h-3 text-amber-300" />
          <span>Placement Admin</span>
        </button>

        <div className="h-3 w-px bg-slate-700 mx-1 hidden sm:block"></div>

        {/* XAMPP / PHP Code button */}
        <button
          onClick={onOpenXamppModal}
          className="bg-indigo-600/90 hover:bg-indigo-600 text-white px-2 py-0.5 rounded flex items-center gap-1 transition font-medium"
          title="View & Download PHP 8 / MySQL Source Code for XAMPP"
        >
          <FileCode className="w-3 h-3" />
          <span>XAMPP PHP & SQL Code</span>
        </button>

        {/* Reset Database */}
        <button
          onClick={handleReset}
          className="bg-slate-800 hover:bg-rose-950 hover:text-rose-200 text-slate-400 px-2 py-0.5 rounded flex items-center gap-1 transition"
          title="Reset database to initial records"
        >
          <RotateCcw className="w-3 h-3" />
          <span className="hidden sm:inline">Reset DB</span>
        </button>

        {resetNotice && (
          <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
            <CheckCircle2 className="w-3 h-3" /> DB Reset!
          </span>
        )}
      </div>
    </div>
  );
};
