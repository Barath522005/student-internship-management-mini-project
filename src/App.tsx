/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DemoQuickBar } from './components/DemoQuickBar';
import { LandingPage } from './components/LandingPage';
import { InternshipListings } from './components/InternshipListings';
import { InternshipDetailsModal } from './components/InternshipDetailsModal';
import { ApplyModal } from './components/ApplyModal';
import { StudentDashboard } from './components/StudentDashboard';
import { StudentProfile } from './components/StudentProfile';
import { StudentApplications } from './components/StudentApplications';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminInternships } from './components/AdminInternships';
import { AdminApplications } from './components/AdminApplications';
import { AdminStudents } from './components/AdminStudents';
import { AuthModal, AuthMode } from './components/AuthModal';
import { AddInternshipModal } from './components/AddInternshipModal';
import { XamppCodeModal } from './components/XamppCodeModal';
import { Internship } from './types';

function MainApp() {
  const { currentUser } = useApp();

  // Navigation state
  const [currentView, setCurrentView] = useState<string>('home');

  // Modals state
  const [authModalMode, setAuthModalMode] = useState<AuthMode | null>(null);
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [applyInternship, setApplyInternship] = useState<Internship | null>(null);
  const [isAddInternshipOpen, setIsAddInternshipOpen] = useState(false);
  const [isXamppModalOpen, setIsXamppModalOpen] = useState(false);
  const [reviewAppId, setReviewAppId] = useState<number | null>(null);

  const handleNavigate = (view: string) => {
    // Guards
    if (view.startsWith('admin-') && currentUser?.role !== 'admin') {
      setAuthModalMode('admin-login');
      return;
    }
    if (view.startsWith('student-') && currentUser?.role !== 'student') {
      setAuthModalMode('student-login');
      return;
    }

    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthSuccess = (role: 'student' | 'admin') => {
    if (role === 'admin') {
      setCurrentView('admin-dashboard');
    } else {
      setCurrentView('student-dashboard');
    }
  };

  const handleOpenApply = (internship: Internship) => {
    if (!currentUser) {
      setAuthModalMode('student-login');
    } else if (currentUser.role !== 'student') {
      alert('Only registered students can apply for internships.');
    } else {
      setApplyInternship(internship);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Demo Project Bar for Evaluator Convenience */}
      <DemoQuickBar
        onOpenXamppModal={() => setIsXamppModalOpen(true)}
        onNavigate={handleNavigate}
      />

      {/* Global Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenAuth={(mode) => setAuthModalMode(mode)}
        onOpenXamppModal={() => setIsXamppModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <LandingPage
            onNavigate={handleNavigate}
            onOpenAuth={(mode) => setAuthModalMode(mode)}
            onSelectInternship={(internship) => setSelectedInternship(internship)}
          />
        )}

        {currentView === 'internships' && (
          <InternshipListings
            onSelectInternship={(internship) => setSelectedInternship(internship)}
            onOpenApplyModal={(internship) => handleOpenApply(internship)}
          />
        )}

        {/* Student Views */}
        {currentView === 'student-dashboard' && (
          <StudentDashboard
            onNavigate={handleNavigate}
            onSelectInternship={(internship) => setSelectedInternship(internship)}
          />
        )}

        {currentView === 'student-profile' && <StudentProfile />}

        {currentView === 'student-applications' && (
          <StudentApplications
            onNavigateToInternships={() => handleNavigate('internships')}
          />
        )}

        {/* Admin Views */}
        {currentView === 'admin-dashboard' && (
          <AdminDashboard
            onNavigate={handleNavigate}
            onOpenAddInternship={() => setIsAddInternshipOpen(true)}
            onSelectApplicationForReview={(appId) => {
              setReviewAppId(appId);
              setCurrentView('admin-applications');
            }}
          />
        )}

        {currentView === 'admin-internships' && (
          <AdminInternships onOpenAddModal={() => setIsAddInternshipOpen(true)} />
        )}

        {currentView === 'admin-applications' && (
          <AdminApplications initialAppIdForReview={reviewAppId} />
        )}

        {currentView === 'admin-students' && <AdminStudents />}
      </main>

      {/* Global Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenXamppModal={() => setIsXamppModalOpen(true)}
        onOpenAuth={(mode) => setAuthModalMode(mode)}
      />

      {/* Modals */}
      {authModalMode && (
        <AuthModal
          initialMode={authModalMode}
          onClose={() => setAuthModalMode(null)}
          onSuccess={handleAuthSuccess}
        />
      )}

      {selectedInternship && (
        <InternshipDetailsModal
          internship={selectedInternship}
          onClose={() => setSelectedInternship(null)}
          onOpenApply={(internship) => {
            setSelectedInternship(null);
            handleOpenApply(internship);
          }}
          onOpenAuth={(mode) => {
            setSelectedInternship(null);
            setAuthModalMode(mode);
          }}
          onNavigateToApplications={() => {
            setSelectedInternship(null);
            handleNavigate('student-applications');
          }}
        />
      )}

      {applyInternship && (
        <ApplyModal
          internship={applyInternship}
          onClose={() => setApplyInternship(null)}
          onSuccessNavigate={() => handleNavigate('student-applications')}
        />
      )}

      {isAddInternshipOpen && (
        <AddInternshipModal onClose={() => setIsAddInternshipOpen(false)} />
      )}

      {isXamppModalOpen && (
        <XamppCodeModal onClose={() => setIsXamppModalOpen(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
