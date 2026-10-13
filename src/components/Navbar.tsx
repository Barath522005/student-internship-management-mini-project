import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Briefcase,
  GraduationCap,
  LayoutDashboard,
  FileCheck2,
  User,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Building2,
  FileCode2,
  Users
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAuth: (mode: 'student-login' | 'student-register' | 'admin-login') => void;
  onOpenXamppModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenAuth,
  onOpenXamppModal,
}) => {
  const { currentUser, logout, applications } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingAppsCount = applications.filter(
    (a) => a.status === 'Pending' || a.status === 'Under Review'
  ).length;

  const studentMyAppsCount = currentUser
    ? applications.filter((a) => a.student_id === currentUser.id).length
    : 0;

  const handleNavClick = (view: string) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none group"
            onClick={() => handleNavClick(currentUser?.role === 'admin' ? 'admin-dashboard' : currentUser?.role === 'student' ? 'student-dashboard' : 'home')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-lg group-hover:text-blue-600 transition">
                  SIPMS
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  College Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-none hidden sm:block">
                Internship & Placement Management System
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {/* If NOT logged in (Guest) */}
            {!currentUser && (
              <>
                <button
                  onClick={() => handleNavClick('home')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    currentView === 'home'
                      ? 'text-blue-600 bg-blue-50/70 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => handleNavClick('internships')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                    currentView === 'internships'
                      ? 'text-blue-600 bg-blue-50/70 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-blue-500" />
                  Explore Internships
                </button>
              </>
            )}

            {/* If STUDENT */}
            {currentUser && currentUser.role === 'student' && (
              <>
                <button
                  onClick={() => handleNavClick('student-dashboard')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                    currentView === 'student-dashboard'
                      ? 'text-blue-600 bg-blue-50/80 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </button>
                <button
                  onClick={() => handleNavClick('internships')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                    currentView === 'internships'
                      ? 'text-blue-600 bg-blue-50/80 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  Browse Internships
                </button>
                <button
                  onClick={() => handleNavClick('student-applications')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                    currentView === 'student-applications'
                      ? 'text-blue-600 bg-blue-50/80 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <FileCheck2 className="w-4 h-4" />
                  My Applications
                  {studentMyAppsCount > 0 && (
                    <span className="ml-1 text-[11px] font-bold px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700">
                      {studentMyAppsCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => handleNavClick('student-profile')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                    currentView === 'student-profile'
                      ? 'text-blue-600 bg-blue-50/80 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <User className="w-4 h-4" />
                  My Profile
                </button>
              </>
            )}

            {/* If ADMIN */}
            {currentUser && currentUser.role === 'admin' && (
              <>
                <button
                  onClick={() => handleNavClick('admin-dashboard')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                    currentView === 'admin-dashboard'
                      ? 'text-amber-700 bg-amber-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-amber-600" />
                  Admin Overview
                </button>
                <button
                  onClick={() => handleNavClick('admin-internships')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                    currentView === 'admin-internships'
                      ? 'text-amber-700 bg-amber-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-amber-600" />
                  Manage Internships
                </button>
                <button
                  onClick={() => handleNavClick('admin-applications')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                    currentView === 'admin-applications'
                      ? 'text-amber-700 bg-amber-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <FileCheck2 className="w-4 h-4 text-amber-600" />
                  Applications
                  {pendingAppsCount > 0 && (
                    <span className="ml-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 animate-pulse">
                      {pendingAppsCount} pending
                    </span>
                  )}
                </button>
                <button
                  onClick={() => handleNavClick('admin-students')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                    currentView === 'admin-students'
                      ? 'text-amber-700 bg-amber-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Users className="w-4 h-4 text-amber-600" />
                  Students
                </button>
              </>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-2">
            {!currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('student-login')}
                  className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition border border-slate-200"
                >
                  Student Login
                </button>
                <button
                  onClick={() => onOpenAuth('student-register')}
                  className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs shadow-blue-600/30 transition"
                >
                  Register
                </button>
                <button
                  onClick={() => onOpenAuth('admin-login')}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition flex items-center gap-1"
                  title="Administrator Portal Login"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  Admin Portal
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                    currentUser.role === 'admin' ? 'bg-amber-600 text-white' : 'bg-blue-600 text-white'
                  }`}>
                    {currentUser.full_name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-slate-900 leading-tight">
                      {currentUser.full_name}
                    </p>
                    <p className="text-[10px] text-slate-500 capitalize">
                      {currentUser.role === 'admin' ? 'Placement Officer' : `${currentUser.degree || 'Student'}`}
                    </p>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-1 md:hidden">
            <button
              onClick={onOpenXamppModal}
              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition text-xs font-medium flex items-center gap-1"
            >
              <FileCode2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          {!currentUser ? (
            <div className="space-y-2">
              <button
                onClick={() => handleNavClick('home')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick('internships')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <Briefcase className="w-4 h-4 text-blue-500" />
                Explore Internships
              </button>
              <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('student-login');
                  }}
                  className="w-full py-2 text-center rounded-lg text-sm font-medium border border-slate-300 text-slate-800"
                >
                  Student Login
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('student-register');
                  }}
                  className="w-full py-2 text-center rounded-lg text-sm font-semibold bg-blue-600 text-white"
                >
                  Register New Student
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('admin-login');
                  }}
                  className="w-full py-2 text-center rounded-lg text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200"
                >
                  Administrator Portal Login
                </button>
              </div>
            </div>
          ) : currentUser.role === 'student' ? (
            <div className="space-y-1">
              <div className="pb-2 mb-2 border-b border-slate-100">
                <p className="text-sm font-bold text-slate-900">{currentUser.full_name}</p>
                <p className="text-xs text-slate-500">{currentUser.email}</p>
              </div>
              <button
                onClick={() => handleNavClick('student-dashboard')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-blue-50 flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4 text-blue-600" /> Dashboard
              </button>
              <button
                onClick={() => handleNavClick('internships')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-blue-50 flex items-center gap-2"
              >
                <Briefcase className="w-4 h-4 text-blue-600" /> Browse Internships
              </button>
              <button
                onClick={() => handleNavClick('student-applications')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-blue-50 flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-blue-600" /> My Applications
                </span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                  {studentMyAppsCount}
                </span>
              </button>
              <button
                onClick={() => handleNavClick('student-profile')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-blue-50 flex items-center gap-2"
              >
                <User className="w-4 h-4 text-blue-600" /> My Profile
              </button>
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="pb-2 mb-2 border-b border-slate-100">
                <p className="text-sm font-bold text-slate-900">{currentUser.full_name}</p>
                <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-md">
                  Administrator
                </span>
              </div>
              <button
                onClick={() => handleNavClick('admin-dashboard')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-amber-50 flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4 text-amber-600" /> Admin Overview
              </button>
              <button
                onClick={() => handleNavClick('admin-internships')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-amber-50 flex items-center gap-2"
              >
                <Building2 className="w-4 h-4 text-amber-600" /> Manage Internships
              </button>
              <button
                onClick={() => handleNavClick('admin-applications')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-amber-50 flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-amber-600" /> Applications
                </span>
                {pendingAppsCount > 0 && (
                  <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                    {pendingAppsCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => handleNavClick('admin-students')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-amber-50 flex items-center gap-2"
              >
                <Users className="w-4 h-4 text-amber-600" /> Registered Students
              </button>
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
