import React, { useState } from 'react';
import {
  X,
  FileCode,
  Database,
  Copy,
  Check,
  Download,
  FolderTree,
  Terminal,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface XamppCodeModalProps {
  onClose: () => void;
}

export const XamppCodeModal: React.FC<XamppCodeModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'sql' | 'guide' | 'php-tree'>('sql');
  const [copied, setCopied] = useState(false);

  const sqlCode = `-- ==========================================================
-- Student Internship and Placement Management System
-- Database: student_internship_db
-- ==========================================================

CREATE DATABASE IF NOT EXISTS \`student_internship_db\` 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE \`student_internship_db\`;

-- 1. Table structure for users
CREATE TABLE \`users\` (
  \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`full_name\` VARCHAR(150) NOT NULL,
  \`email\` VARCHAR(191) NOT NULL,
  \`phone\` VARCHAR(30) NOT NULL,
  \`college_name\` VARCHAR(255) NOT NULL,
  \`department\` VARCHAR(150) NOT NULL,
  \`degree\` VARCHAR(100) NOT NULL,
  \`graduation_year\` INT NOT NULL,
  \`password_hash\` VARCHAR(255) NOT NULL,
  \`role\` ENUM('student', 'admin') NOT NULL DEFAULT 'student',
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`idx_users_email\` (\`email\`),
  KEY \`idx_users_role\` (\`role\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Table structure for internships
CREATE TABLE \`internships\` (
  \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`title\` VARCHAR(200) NOT NULL,
  \`company_name\` VARCHAR(150) NOT NULL,
  \`description\` TEXT NOT NULL,
  \`required_skills\` VARCHAR(255) NOT NULL,
  \`eligibility\` VARCHAR(255) NOT NULL,
  \`location\` VARCHAR(150) NOT NULL,
  \`work_mode\` ENUM('Remote', 'Hybrid', 'On-site') NOT NULL DEFAULT 'On-site',
  \`duration\` VARCHAR(100) NOT NULL,
  \`stipend\` VARCHAR(100) NOT NULL,
  \`available_positions\` INT NOT NULL DEFAULT 1,
  \`application_deadline\` DATE NOT NULL,
  \`status\` ENUM('Active', 'Closed') NOT NULL DEFAULT 'Active',
  \`created_by\` INT UNSIGNED NOT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_internships_status\` (\`status\`),
  KEY \`idx_internships_deadline\` (\`application_deadline\`),
  CONSTRAINT \`fk_internships_created_by\` 
    FOREIGN KEY (\`created_by\`) REFERENCES \`users\` (\`id\`) 
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Table structure for applications (with duplicate prevention)
CREATE TABLE \`applications\` (
  \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`student_id\` INT UNSIGNED NOT NULL,
  \`internship_id\` INT UNSIGNED NOT NULL,
  \`application_message\` TEXT NOT NULL,
  \`status\` ENUM('Pending', 'Under Review', 'Shortlisted', 'Accepted', 'Rejected') NOT NULL DEFAULT 'Pending',
  \`admin_remarks\` TEXT NULL,
  \`applied_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`idx_student_internship_unique\` (\`student_id\`, \`internship_id\`),
  KEY \`idx_applications_status\` (\`status\`),
  CONSTRAINT \`fk_applications_student\` 
    FOREIGN KEY (\`student_id\`) REFERENCES \`users\` (\`id\`) 
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT \`fk_applications_internship\` 
    FOREIGN KEY (\`internship_id\`) REFERENCES \`internships\` (\`id\`) 
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSql = () => {
    const blob = new Blob([sqlCode], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'database.sql';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">XAMPP (PHP & MySQL) Project Files</h2>
              <p className="text-xs text-slate-400">
                Official source code and database migrations for local evaluation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selector */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('sql')}
            className={`flex-1 py-3 px-4 border-b-2 flex items-center justify-center gap-2 transition ${
              activeTab === 'sql'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-4 h-4" />
            database.sql Schema
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`flex-1 py-3 px-4 border-b-2 flex items-center justify-center gap-2 transition ${
              activeTab === 'guide'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Terminal className="w-4 h-4" />
            XAMPP Setup Guide
          </button>

          <button
            onClick={() => setActiveTab('php-tree')}
            className={`flex-1 py-3 px-4 border-b-2 flex items-center justify-center gap-2 transition ${
              activeTab === 'php-tree'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            PHP Project Structure
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 max-h-[65vh] overflow-y-auto">
          {activeTab === 'sql' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Ready to import directly into <strong>phpMyAdmin</strong>.
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopy(sqlCode)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied!' : 'Copy SQL'}
                  </button>
                  <button
                    onClick={handleDownloadSql}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download database.sql
                  </button>
                </div>
              </div>

              <pre className="p-4 bg-slate-900 text-slate-100 rounded-2xl text-[11px] font-mono overflow-x-auto leading-relaxed max-h-96">
                <code>{sqlCode}</code>
              </pre>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-5 text-xs text-slate-600 leading-relaxed">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-1">
                <h4 className="font-bold text-blue-900 text-sm">
                  Quick 5-Step XAMPP Execution Workflow
                </h4>
                <p className="text-blue-800 text-[11px]">
                  All files and schemas are pre-configured to run out of the box in standard XAMPP.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">Start Apache & MySQL Modules</h5>
                    <p className="text-slate-500">
                      Open your XAMPP Control Panel and click "Start" next to both Apache and MySQL.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">Create & Import Database</h5>
                    <p className="text-slate-500">
                      Visit <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-600">http://localhost/phpmyadmin/</code>. Create a new database named <strong className="text-slate-900">student_internship_db</strong>. Go to the Import tab and choose <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-600">database.sql</code>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">Place Files in htdocs</h5>
                    <p className="text-slate-500">
                      Copy the <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-600">student-internship-management</code> folder into your <code className="bg-slate-100 px-1 py-0.5 rounded">xampp/htdocs/</code> folder.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">Database Connection Credentials</h5>
                    <p className="text-slate-500">
                      Open <code className="bg-slate-100 px-1 py-0.5 rounded">config/database.php</code>. Default credentials (<code className="bg-slate-100 px-1 rounded">root</code> with empty password) are already configured for standard XAMPP.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    5
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">Launch in Browser</h5>
                    <p className="text-slate-500">
                      Visit <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-600 font-bold">http://localhost/student-internship-management/</code> in Google Chrome or any browser.
                    </p>
                  </div>
                </div>
              </div>

              {/* Login presets table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden mt-4">
                <div className="bg-slate-50 p-2.5 font-bold text-slate-700">
                  Pre-configured Accounts (in database.sql):
                </div>
                <div className="p-3 space-y-1.5 font-mono text-[11px]">
                  <p>
                    <strong>Placement Admin:</strong> admin@example.com / Admin@123
                  </p>
                  <p>
                    <strong>Student (Rahul):</strong> rahul.sharma@college.edu / Student@123
                  </p>
                  <p>
                    <strong>Student (Priya):</strong> priya.patel@college.edu / Student@123
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'php-tree' && (
            <div className="space-y-4 text-xs">
              <p className="text-slate-500">
                Organized standard PHP folder architecture adhering to college mini project guidelines:
              </p>
              <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl font-mono text-[11px] leading-relaxed overflow-x-auto">
                <pre>{`student-internship-management/
├── index.php                      # Public Landing Page & Openings
├── register.php                   # Student Registration Form
├── login.php                      # Student Login with Session Auth
├── logout.php                     # Secure Session Destruction
├── config/
│   └── database.php               # PDO Singleton Connection
├── includes/
│   ├── auth.php                   # Session verification & Role Guards
│   ├── functions.php              # XSS Escaping & Helpers
│   ├── csrf.php                   # Anti-CSRF Token Generators
│   ├── header.php                 # Bootstrap 5 & Head definitions
│   ├── footer.php                 # Footer & Bootstrap JS
│   └── navbar.php                 # Dynamic Navbar (Student / Admin)
├── student/
│   ├── dashboard.php              # Student Metrics & Openings
│   ├── profile.php                # Personal & Academic Profile
│   ├── internships.php            # Search & Filterable Listings
│   ├── internship-details.php     # Full Description & Apply Form
│   └── applications.php           # Status Tracker & Admin Feedback
├── admin/
│   ├── login.php                  # Dedicated Admin Login
│   ├── dashboard.php              # Placement Cell Statistics
│   ├── internships.php            # Listings CRUD & Status Toggle
│   ├── add-internship.php         # Post New Drive Form
│   ├── edit-internship.php        # Update Opportunity Form
│   ├── students.php               # Directory of Candidates
│   └── applications.php           # Status Review & Remarks
├── assets/
│   ├── css/style.css              # Custom Styling
│   └── js/main.js                 # Frontend Validations
├── database.sql                   # MySQL Schema & Seed Records
└── README.md                      # Project Documentation`}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
