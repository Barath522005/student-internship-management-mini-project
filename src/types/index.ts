export type Role = 'student' | 'admin';

export type WorkMode = 'Remote' | 'Hybrid' | 'On-site';

export type InternshipStatus = 'Active' | 'Closed';

export type ApplicationStatus = 'Pending' | 'Under Review' | 'Shortlisted' | 'Accepted' | 'Rejected';

export interface User {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  college_name: string;
  department: string;
  degree: string;
  graduation_year: number;
  password_hash?: string;
  role: Role;
  created_at: string;
  updated_at: string;
}

export interface Internship {
  id: number;
  title: string;
  company_name: string;
  description: string;
  required_skills: string; // Comma-separated or descriptive
  eligibility: string;
  location: string;
  work_mode: WorkMode;
  duration: string;
  stipend: string;
  available_positions: number;
  application_deadline: string; // YYYY-MM-DD
  status: InternshipStatus;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: number;
  student_id: number;
  internship_id: number;
  application_message: string;
  status: ApplicationStatus;
  admin_remarks: string;
  applied_at: string;
  updated_at: string;
}

export interface SystemStats {
  totalStudents: number;
  totalInternships: number;
  activeInternships: number;
  totalApplications: number;
  pendingApplications: number;
  acceptedApplications: number;
}
