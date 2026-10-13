import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User } from '../types';
import {
  Users,
  Search,
  Building,
  GraduationCap,
  Mail,
  Phone,
  FileCheck2,
  X,
  Calendar,
  Briefcase
} from 'lucide-react';

export const AdminStudents: React.FC = () => {
  const { users, applications, internships } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

  const studentUsers = users.filter((u) => u.role === 'student');

  const filteredStudents = studentUsers.filter((student) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    const nameMatch = student.full_name.toLowerCase().includes(q);
    const emailMatch = student.email.toLowerCase().includes(q);
    const collegeMatch = student.college_name.toLowerCase().includes(q);
    const deptMatch = student.department.toLowerCase().includes(q);
    return nameMatch || emailMatch || collegeMatch || deptMatch;
  });

  const getStudentApps = (studentId: number) => {
    return applications.filter((a) => a.student_id === studentId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Registered Students Directory
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review student academic credentials, contact information, and campus placement participation.
        </p>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 flex items-center justify-between gap-4 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student name, email, department, college..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Total Candidates: <strong>{filteredStudents.length}</strong>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Student Name & Email</th>
                <th className="py-3.5 px-4">College</th>
                <th className="py-3.5 px-4">Department & Degree</th>
                <th className="py-3.5 px-4">Graduation Batch</th>
                <th className="py-3.5 px-4">Phone</th>
                <th className="py-3.5 px-4">Applications</th>
                <th className="py-3.5 px-4 text-right">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No registered students found matching search.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const studentApps = getStudentApps(student.id);

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{student.full_name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{student.email}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-slate-700 font-medium">{student.college_name}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{student.department}</div>
                        <div className="text-[11px] text-slate-500">{student.degree}</div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                        Class of {student.graduation_year}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">{student.phone}</td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                          {studentApps.length} applied
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition"
                        >
                          View Details
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

      {/* Student Details Drawer / Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Student Profile #{selectedStudent.id}
                </h2>
                <p className="text-xs text-slate-500">Verified academic profile details</p>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
              {/* Primary Profile Card */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      {selectedStudent.full_name}
                    </h3>
                    <p className="text-slate-500 font-mono text-[11px]">{selectedStudent.email}</p>
                  </div>
                  <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full font-bold text-[10px]">
                    Student
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/80">
                  <div>
                    <span className="text-slate-400 uppercase text-[10px] font-bold block">
                      Phone Number
                    </span>
                    <span className="font-semibold text-slate-800">{selectedStudent.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase text-[10px] font-bold block">
                      Graduation Batch
                    </span>
                    <span className="font-semibold text-slate-800">
                      Class of {selectedStudent.graduation_year}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 uppercase text-[10px] font-bold block">
                      College / Institution
                    </span>
                    <span className="font-semibold text-slate-800">
                      {selectedStudent.college_name}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 uppercase text-[10px] font-bold block">
                      Department & Degree
                    </span>
                    <span className="font-semibold text-slate-800">
                      {selectedStudent.department} ({selectedStudent.degree})
                    </span>
                  </div>
                </div>
              </div>

              {/* Submissions by this student */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Applied Internships ({getStudentApps(selectedStudent.id).length})
                </h4>

                {getStudentApps(selectedStudent.id).length === 0 ? (
                  <p className="text-slate-400 italic">No applications recorded for this student.</p>
                ) : (
                  <div className="space-y-2">
                    {getStudentApps(selectedStudent.id).map((app) => {
                      const internship = internships.find((i) => i.id === app.internship_id);
                      return (
                        <div
                          key={app.id}
                          className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">
                              {internship?.title || `Internship #${app.internship_id}`}
                            </span>
                            <span className="font-bold text-[10px] px-2 py-0.5 rounded-full bg-white border border-slate-200">
                              {app.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            {internship?.company_name} • Applied on {app.applied_at.substring(0, 10)}
                          </p>
                          {app.admin_remarks && (
                            <p className="text-[11px] text-blue-700 bg-blue-50/50 p-1.5 rounded">
                              <strong>Remarks:</strong> {app.admin_remarks}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-xl text-xs font-semibold text-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
