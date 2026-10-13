import React from 'react';
import { GraduationCap, Database, Server, Code2, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenXamppModal: () => void;
  onOpenAuth: (mode: 'student-login' | 'student-register' | 'admin-login') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenXamppModal, onOpenAuth }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: System Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-bold text-white text-base">SIPMS Portal</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Student Internship and Placement Management System. A complete relational database driven solution for college placement drives and student career progression.
            </p>
            <div className="pt-1 flex flex-wrap gap-1.5 text-[11px]">
              <span className="bg-slate-800 text-blue-300 px-2 py-0.5 rounded border border-slate-700 font-mono">
                PHP 8+
              </span>
              <span className="bg-slate-800 text-emerald-300 px-2 py-0.5 rounded border border-slate-700 font-mono">
                MySQL (PDO)
              </span>
              <span className="bg-slate-800 text-purple-300 px-2 py-0.5 rounded border border-slate-700 font-mono">
                Bootstrap 5
              </span>
              <span className="bg-slate-800 text-amber-300 px-2 py-0.5 rounded border border-slate-700 font-mono">
                XAMPP
              </span>
            </div>
          </div>

          {/* Col 2: Student Services */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Student Services
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('internships')}
                  className="hover:text-white transition text-left"
                >
                  Explore Active Internships
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenAuth('student-register')}
                  className="hover:text-white transition text-left"
                >
                  Create Student Account
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenAuth('student-login')}
                  className="hover:text-white transition text-left"
                >
                  Student Login Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('student-applications')}
                  className="hover:text-white transition text-left"
                >
                  Application Status Tracking
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Admin & Placement Cell */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Placement Cell
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onOpenAuth('admin-login')}
                  className="hover:text-white transition text-left flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  Admin Sign In
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin-dashboard')}
                  className="hover:text-white transition text-left"
                >
                  Placement Metrics
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin-internships')}
                  className="hover:text-white transition text-left"
                >
                  Corporate Listings
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin-applications')}
                  className="hover:text-white transition text-left"
                >
                  Candidate Review
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Project Deliverables */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Project Deliverables
            </h4>
            <p className="text-xs text-slate-400">
              Includes full source code, database migrations, and security protections for evaluation.
            </p>
            <div className="space-y-1.5">
              <button
                onClick={onOpenXamppModal}
                className="w-full text-left bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-xs px-3 py-2 rounded-lg text-indigo-300 hover:text-white flex items-center justify-between transition"
              >
                <span className="flex items-center gap-1.5 font-medium">
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  student_internship_db.sql
                </span>
                <span className="text-[10px] text-slate-400">Schema</span>
              </button>

              <button
                onClick={onOpenXamppModal}
                className="w-full text-left bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-xs px-3 py-2 rounded-lg text-indigo-300 hover:text-white flex items-center justify-between transition"
              >
                <span className="flex items-center gap-1.5 font-medium">
                  <Code2 className="w-3.5 h-3.5 text-blue-400" />
                  XAMPP PHP Codebase
                </span>
                <span className="text-[10px] text-slate-400">Inspect</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2026 Student Internship & Placement Management System. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with precision for College Mini Project</span>
            <Server className="w-3 h-3 text-emerald-400 mx-1" />
            <span>Ready for XAMPP deployment</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
