# Student Internship and Placement Management System

A production-ready, full-stack web application designed for college mini projects and university placement cells. It allows students to discover internships, submit applications with cover letters, and track statuses in real time, while providing administrators and placement officers with tools to manage listings, evaluate applicants, and review department metrics.

---

## 📌 Project Overview
The **Student Internship and Placement Management System** bridges the gap between students seeking professional industry experience and placement administrators managing corporate recruitment drives.

### Key Objectives
* Streamline campus internship drives and company job postings.
* Eliminate paper/manual spreadsheet tracking with a relational database.
* Prevent duplicate applications using database unique constraints.
* Enforce application deadlines and active status validations.
* Provide transparent, multi-stage application status tracking (Pending → Under Review → Shortlisted → Accepted / Rejected).

---

## 🛠️ Technology Stack
* **Frontend**: HTML5, CSS3, JavaScript (ES6+), Bootstrap 5 / Tailwind CSS, Bootstrap Icons
* **Backend**: PHP 8.1+ (Object-Oriented with PDO)
* **Database**: MySQL 5.7+ / 8.0+ / MariaDB (Default in XAMPP)
* **Local Development Environment**: XAMPP (Apache + MySQL + phpMyAdmin)
* **Security**: PDO Prepared Statements, `password_hash()`, `password_verify()`, CSRF Tokens, Session Regeneration, HTML Escaping (XSS protection)

---

## 📂 Project Structure
```text
student-internship-management/
├── index.php                      # Public Landing Page & Features
├── register.php                   # Student Registration Portal
├── login.php                      # Student Authentication
├── logout.php                     # Secure Session Termination
├── config/
│   └── database.php               # PDO Database Connection Singleton
├── includes/
│   ├── auth.php                   # Session verification & Role Guards
│   ├── functions.php              # Sanitization, Formatting & Helpers
│   ├── csrf.php                   # Anti-CSRF Token Generation & Validation
│   ├── header.php                 # Responsive HTML <head> & Stylesheets
│   ├── footer.php                 # Global Footer & Scripts
│   └── navbar.php                 # Role-aware Dynamic Navigation Bar
├── student/
│   ├── dashboard.php              # Student Metrics & Recent Opportunities
│   ├── profile.php                # Personal & Academic Profile Management
│   ├── internships.php            # Search & Filterable Listings
│   ├── internship-details.php     # Detailed Description & Apply Form
│   └── applications.php           # Status Tracker & Admin Feedback
├── admin/
│   ├── login.php                  # Dedicated Admin Login
│   ├── dashboard.php              # Placement Cell Overview & Counts
│   ├── internships.php            # Listings CRUD & Status Toggle
│   ├── add-internship.php         # Post New Opportunity Form
│   ├── edit-internship.php        # Update Opportunity Details
│   ├── students.php               # Directory of Registered Candidates
│   └── applications.php           # Application Review & Status Changer
├── assets/
│   ├── css/
│   │   └── style.css              # Custom Styling & Responsive Tweaks
│   └── js/
│       └── main.js                # Client-side Validation & Modals
├── database.sql                   # MySQL Database Schema & Sample Data
└── README.md                      # Project Documentation & Setup Guide
```

---

## 🚀 XAMPP Installation & Setup Guide

### 1. Prerequisites
1. Download and install **XAMPP** (version with PHP 8.0 or higher) from [apachefriends.org](https://www.apachefriends.org/).
2. Open the **XAMPP Control Panel** and start both **Apache** and **MySQL** modules.

### 2. Copy Project Files
1. Navigate to your XAMPP installation directory (typically `C:\xampp\htdocs` on Windows or `/Applications/XAMPP/xamppfiles/htdocs` on macOS).
2. Copy the `student-internship-management` folder into the `htdocs` directory.

### 3. Create & Import the Database
1. Open your web browser and visit `http://localhost/phpmyadmin/`.
2. Click **New** in the left sidebar.
3. Enter database name: `student_internship_db` and collation `utf8mb4_unicode_ci`, then click **Create**.
4. Select the newly created database, go to the **Import** tab.
5. Click **Choose File**, select `database.sql` from the project folder, and click **Import** (or **Go**).
6. Verify that tables `users`, `internships`, and `applications` are successfully populated.

### 4. Database Configuration
If your MySQL password is not the default empty string, open `config/database.php` and update:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'student_internship_db');
define('DB_USER', 'root');
define('DB_PASS', ''); // Set your MySQL password if configured
```

### 5. Launch the Application
Open your browser and navigate to:
```text
http://localhost/student-internship-management/
```

---

## 🔑 Default Credentials

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@example.com` | `Admin@123` | Full placement cell & administrative controls |
| **Student** | `rahul.sharma@college.edu` | `Student@123` | Student dashboard & application submission |
| **Student** | `priya.patel@college.edu` | `Student@123` | Student dashboard & application submission |

*(You can also register a new student account at `/register.php`)*

---

## 🧪 Testing Checklist

1. **Student Registration**: Fill out the form with college name, department, graduation year. Duplicate emails are blocked.
2. **Student Login & Authentication**: Log in as a student; verify session persistence and redirection to `/student/dashboard.php`.
3. **Student Profile**: Update phone, graduation year, or change password; verify changes in database.
4. **Internship Discovery**: Search by keyword ("React", "Python"), filter by Work Mode ("Remote", "Hybrid", "On-site").
5. **Apply for Internship**:
   - Check an active internship → submit custom cover letter → verify success message.
   - Re-attempting to apply to the same internship displays a duplicate warning.
   - Closed or expired internships disable the apply button.
6. **My Applications**: Verify tracking view showing current status badge (`Pending`, `Under Review`, `Shortlisted`, `Accepted`, `Rejected`) and reviewer notes.
7. **Admin Dashboard**: Log in via `/admin/login.php`; observe live system statistics.
8. **Admin Internship Management**: Create a new internship posting, edit details, toggle status between Active and Closed, delete with confirmation.
9. **Admin Application Review**: Filter applicants by internship; change status to `Shortlisted` or `Accepted` and add remarks.
10. **Role Guard**: Attempt to access `/admin/dashboard.php` as a student or guest; observe redirect to login.

---

## 🛡️ Security Features
* **SQL Injection Prevention**: All SQL statements use PDO parameterized queries.
* **Password Hashing**: Passwords stored using BCRYPT (`PASSWORD_DEFAULT`).
* **Cross-Site Scripting (XSS)**: All output rendered through `htmlspecialchars($val, ENT_QUOTES, 'UTF-8')`.
* **Cross-Site Request Forgery (CSRF)**: Anti-CSRF session token verified on POST requests.
* **Session Hijacking Safeguard**: `session_regenerate_id(true)` executed upon authenticated login.
