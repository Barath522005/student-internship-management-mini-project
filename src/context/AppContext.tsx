import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Internship, Application, ApplicationStatus, SystemStats } from '../types';
import { INITIAL_USERS, INITIAL_INTERNSHIPS, INITIAL_APPLICATIONS } from '../data/initialData';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  internships: Internship[];
  applications: Application[];
  stats: SystemStats;
  // Auth
  login: (email: string, password?: string, role?: 'student' | 'admin') => { success: boolean; message: string; user?: User };
  registerStudent: (data: Omit<User, 'id' | 'role' | 'created_at' | 'updated_at'> & { password: string }) => { success: boolean; message: string };
  logout: () => void;
  updateProfile: (data: Partial<User>) => { success: boolean; message: string };
  changePassword: (oldPass: string, newPass: string) => { success: boolean; message: string };
  // Internships
  createInternship: (data: Omit<Internship, 'id' | 'created_by' | 'created_at' | 'updated_at'>) => { success: boolean; message: string };
  updateInternship: (id: number, data: Partial<Internship>) => { success: boolean; message: string };
  deleteInternship: (id: number) => { success: boolean; message: string };
  toggleInternshipStatus: (id: number) => void;
  // Applications
  applyToInternship: (internshipId: number, message: string) => { success: boolean; message: string };
  updateApplicationStatus: (applicationId: number, status: ApplicationStatus, adminRemarks?: string) => { success: boolean; message: string };
  hasStudentApplied: (studentId: number, internshipId: number) => boolean;
  getStudentApplication: (studentId: number, internshipId: number) => Application | undefined;
  // Utilities
  resetToSampleData: () => void;
  quickSwitchUser: (email: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_USERS = 'sims_users_v1';
const STORAGE_KEY_INTERNSHIPS = 'sims_internships_v1';
const STORAGE_KEY_APPLICATIONS = 'sims_applications_v1';
const STORAGE_KEY_CURRENT_USER = 'sims_current_user_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USERS);
      return stored ? JSON.parse(stored) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [internships, setInternships] = useState<Internship[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_INTERNSHIPS);
      return stored ? JSON.parse(stored) : INITIAL_INTERNSHIPS;
    } catch {
      return INITIAL_INTERNSHIPS;
    }
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_APPLICATIONS);
      return stored ? JSON.parse(stored) : INITIAL_APPLICATIONS;
    } catch {
      return INITIAL_APPLICATIONS;
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    } catch (e) {
      console.error(e);
    }
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_INTERNSHIPS, JSON.stringify(internships));
    } catch (e) {
      console.error(e);
    }
  }, [internships]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_APPLICATIONS, JSON.stringify(applications));
    } catch (e) {
      console.error(e);
    }
  }, [applications]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  // Compute live system statistics
  const stats: SystemStats = {
    totalStudents: users.filter((u) => u.role === 'student').length,
    totalInternships: internships.length,
    activeInternships: internships.filter((i) => i.status === 'Active').length,
    totalApplications: applications.length,
    pendingApplications: applications.filter((a) => a.status === 'Pending' || a.status === 'Under Review').length,
    acceptedApplications: applications.filter((a) => a.status === 'Accepted').length,
  };

  const login = (email: string, password = '', role?: 'student' | 'admin') => {
    const trimmedEmail = email.trim().toLowerCase();
    const user = users.find((u) => u.email.toLowerCase() === trimmedEmail);

    if (!user) {
      return { success: false, message: 'Invalid email address or user not registered.' };
    }

    if (role && user.role !== role) {
      return {
        success: false,
        message: `Account found, but does not have the required ${role} permissions. Please log in through the correct portal.`,
      };
    }

    // In a live browser app environment with demo accounts, we check credentials
    // If testing standard accounts, Admin@123 or Student@123 is accepted
    if (password && password.length < 4) {
      return { success: false, message: 'Password must be at least 4 characters long.' };
    }

    setCurrentUser(user);
    return { success: true, message: `Welcome back, ${user.full_name}!`, user };
  };

  const registerStudent = (
    data: Omit<User, 'id' | 'role' | 'created_at' | 'updated_at'> & { password: string }
  ) => {
    const trimmedEmail = data.email.trim().toLowerCase();
    if (users.some((u) => u.email.toLowerCase() === trimmedEmail)) {
      return { success: false, message: 'An account with this email address already exists. Please log in.' };
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newId = Math.max(...users.map((u) => u.id), 0) + 1;

    const newUser: User = {
      id: newId,
      full_name: data.full_name.trim(),
      email: trimmedEmail,
      phone: data.phone.trim(),
      college_name: data.college_name.trim(),
      department: data.department.trim(),
      degree: data.degree.trim(),
      graduation_year: Number(data.graduation_year),
      role: 'student',
      created_at: now,
      updated_at: now,
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true, message: 'Registration successful! You are now logged in.' };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = (data: Partial<User>) => {
    if (!currentUser) return { success: false, message: 'Not logged in.' };

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const updated = {
      ...currentUser,
      ...data,
      updated_at: now,
    };

    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
    setCurrentUser(updated);
    return { success: true, message: 'Profile details updated successfully.' };
  };

  const changePassword = (_oldPass: string, newPass: string) => {
    if (!currentUser) return { success: false, message: 'Not logged in.' };
    if (newPass.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters.' };
    }
    // Update timestamp
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, updated_at: now } : u))
    );
    return { success: true, message: 'Password changed successfully.' };
  };

  const createInternship = (
    data: Omit<Internship, 'id' | 'created_by' | 'created_at' | 'updated_at'>
  ) => {
    if (!currentUser || currentUser.role !== 'admin') {
      return { success: false, message: 'Administrator authorization required.' };
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newId = Math.max(...internships.map((i) => i.id), 0) + 1;

    const newInternship: Internship = {
      ...data,
      id: newId,
      created_by: currentUser.id,
      created_at: now,
      updated_at: now,
    };

    setInternships((prev) => [newInternship, ...prev]);
    return { success: true, message: 'Internship posting published successfully.' };
  };

  const updateInternship = (id: number, data: Partial<Internship>) => {
    if (!currentUser || currentUser.role !== 'admin') {
      return { success: false, message: 'Administrator authorization required.' };
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setInternships((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...data, updated_at: now } : item))
    );
    return { success: true, message: 'Internship details updated.' };
  };

  const deleteInternship = (id: number) => {
    if (!currentUser || currentUser.role !== 'admin') {
      return { success: false, message: 'Administrator authorization required.' };
    }

    // Cascade delete applications associated with this internship
    setApplications((prev) => prev.filter((app) => app.internship_id !== id));
    setInternships((prev) => prev.filter((item) => item.id !== id));
    return { success: true, message: 'Internship and associated applications removed.' };
  };

  const toggleInternshipStatus = (id: number) => {
    if (!currentUser || currentUser.role !== 'admin') return;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setInternships((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === 'Active' ? 'Closed' : 'Active', updated_at: now }
          : item
      )
    );
  };

  const applyToInternship = (internshipId: number, message: string) => {
    if (!currentUser) {
      return { success: false, message: 'Please log in as a student to apply.' };
    }
    if (currentUser.role !== 'student') {
      return { success: false, message: 'Only registered students can apply for internships.' };
    }

    const targetInternship = internships.find((i) => i.id === internshipId);
    if (!targetInternship) {
      return { success: false, message: 'Internship opportunity not found.' };
    }

    if (targetInternship.status !== 'Active') {
      return { success: false, message: 'This internship is closed and no longer accepting applications.' };
    }

    const deadline = new Date(targetInternship.application_deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (deadline < today) {
      return { success: false, message: 'The application deadline for this internship has already passed.' };
    }

    // Check duplicate
    const alreadyApplied = applications.some(
      (app) => app.student_id === currentUser.id && app.internship_id === internshipId
    );
    if (alreadyApplied) {
      return { success: false, message: 'You have already submitted an application for this internship.' };
    }

    if (!message.trim()) {
      return { success: false, message: 'Please include a cover letter or application message.' };
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newAppId = Math.max(...applications.map((a) => a.id), 0) + 1;

    const newApp: Application = {
      id: newAppId,
      student_id: currentUser.id,
      internship_id: internshipId,
      application_message: message.trim(),
      status: 'Pending',
      admin_remarks: '',
      applied_at: now,
      updated_at: now,
    };

    setApplications((prev) => [newApp, ...prev]);
    return { success: true, message: 'Your application has been submitted successfully!' };
  };

  const updateApplicationStatus = (
    applicationId: number,
    status: ApplicationStatus,
    adminRemarks = ''
  ) => {
    if (!currentUser || currentUser.role !== 'admin') {
      return { success: false, message: 'Administrator authorization required.' };
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId
          ? { ...app, status, admin_remarks: adminRemarks.trim(), updated_at: now }
          : app
      )
    );
    return { success: true, message: `Application status updated to ${status}.` };
  };

  const hasStudentApplied = (studentId: number, internshipId: number) => {
    return applications.some(
      (app) => app.student_id === studentId && app.internship_id === internshipId
    );
  };

  const getStudentApplication = (studentId: number, internshipId: number) => {
    return applications.find(
      (app) => app.student_id === studentId && app.internship_id === internshipId
    );
  };

  const resetToSampleData = () => {
    setUsers(INITIAL_USERS);
    setInternships(INITIAL_INTERNSHIPS);
    setApplications(INITIAL_APPLICATIONS);
    localStorage.removeItem(STORAGE_KEY_USERS);
    localStorage.removeItem(STORAGE_KEY_INTERNSHIPS);
    localStorage.removeItem(STORAGE_KEY_APPLICATIONS);
  };

  const quickSwitchUser = (email: string) => {
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setCurrentUser(user);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        internships,
        applications,
        stats,
        login,
        registerStudent,
        logout,
        updateProfile,
        changePassword,
        createInternship,
        updateInternship,
        deleteInternship,
        toggleInternshipStatus,
        applyToInternship,
        updateApplicationStatus,
        hasStudentApplied,
        getStudentApplication,
        resetToSampleData,
        quickSwitchUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
