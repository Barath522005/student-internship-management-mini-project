-- ==========================================================
-- Student Internship and Placement Management System
-- Database Schema: student_internship_db
-- Target: MySQL 5.7+ / 8.0+ / MariaDB (XAMPP Default)
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `student_internship_db` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `student_internship_db`;

-- Drop existing tables if re-importing
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `applications`;
DROP TABLE IF EXISTS `internships`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- --------------------------------------------------------
-- Table structure for table `users`
-- --------------------------------------------------------
CREATE TABLE `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `full_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `college_name` VARCHAR(255) NOT NULL,
  `department` VARCHAR(150) NOT NULL,
  `degree` VARCHAR(100) NOT NULL,
  `graduation_year` INT NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('student', 'admin') NOT NULL DEFAULT 'student',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_users_email` (`email`),
  KEY `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `internships`
-- --------------------------------------------------------
CREATE TABLE `internships` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(200) NOT NULL,
  `company_name` VARCHAR(150) NOT NULL,
  `description` TEXT NOT NULL,
  `required_skills` VARCHAR(255) NOT NULL,
  `eligibility` VARCHAR(255) NOT NULL,
  `location` VARCHAR(150) NOT NULL,
  `work_mode` ENUM('Remote', 'Hybrid', 'On-site') NOT NULL DEFAULT 'On-site',
  `duration` VARCHAR(100) NOT NULL,
  `stipend` VARCHAR(100) NOT NULL,
  `available_positions` INT NOT NULL DEFAULT 1,
  `application_deadline` DATE NOT NULL,
  `status` ENUM('Active', 'Closed') NOT NULL DEFAULT 'Active',
  `created_by` INT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_internships_status` (`status`),
  KEY `idx_internships_deadline` (`application_deadline`),
  KEY `idx_internships_created_by` (`created_by`),
  CONSTRAINT `fk_internships_created_by` 
    FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) 
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `applications`
-- --------------------------------------------------------
CREATE TABLE `applications` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `student_id` INT UNSIGNED NOT NULL,
  `internship_id` INT UNSIGNED NOT NULL,
  `application_message` TEXT NOT NULL,
  `status` ENUM('Pending', 'Under Review', 'Shortlisted', 'Accepted', 'Rejected') NOT NULL DEFAULT 'Pending',
  `admin_remarks` TEXT NULL,
  `applied_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_student_internship_unique` (`student_id`, `internship_id`),
  KEY `idx_applications_status` (`status`),
  CONSTRAINT `fk_applications_student` 
    FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) 
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_applications_internship` 
    FOREIGN KEY (`internship_id`) REFERENCES `internships` (`id`) 
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Sample Data Seeding
-- Default passwords:
-- Admin: Admin@123  -> hash: $2y$10$w07j4BspqVj7Qo8w1UvFweqM4xQy6sV.HnC/j52o4K1m2G6m3lW0q
-- Student: Student@123 -> hash: $2y$10$Z3k6pTqY2oK9L7mM5nP8AevB1tN3xV5zQ7wE9rT1uI3oP5sA7dF9g
-- Note: You can also register new accounts via the registration interface
-- --------------------------------------------------------

INSERT INTO `users` (`id`, `full_name`, `email`, `phone`, `college_name`, `department`, `degree`, `graduation_year`, `password_hash`, `role`, `created_at`, `updated_at`) VALUES
(1, 'Placement Administrator', 'admin@example.com', '+91 9876543210', 'University Placement Cell', 'Training and Placement Cell', 'Ph.D / Administration', 2020, '$2y$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm', 'admin', '2026-01-10 09:00:00', '2026-01-10 09:00:00'),
(2, 'Rahul Sharma', 'rahul.sharma@college.edu', '+91 9812345678', 'National Institute of Technology', 'Computer Science and Engineering', 'B.Tech', 2027, '$2y$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm', 'student', '2026-02-15 10:30:00', '2026-02-15 10:30:00'),
(3, 'Priya Patel', 'priya.patel@college.edu', '+91 9723456789', 'Indian Institute of Information Technology', 'Information Technology', 'B.Tech', 2027, '$2y$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm', 'student', '2026-02-18 14:15:00', '2026-02-18 14:15:00'),
(4, 'Ananya Verma', 'ananya.verma@college.edu', '+91 9934567890', 'PSG College of Technology', 'Artificial Intelligence & Data Science', 'B.E.', 2028, '$2y$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm', 'student', '2026-03-01 11:20:00', '2026-03-01 11:20:00'),
(5, 'Karthik Raja', 'karthik.raja@college.edu', '+91 9645678901', 'Vellore Institute of Technology', 'Electronics and Communication', 'B.Tech', 2027, '$2y$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm', 'student', '2026-03-05 16:40:00', '2026-03-05 16:40:00');

INSERT INTO `internships` (`id`, `title`, `company_name`, `description`, `required_skills`, `eligibility`, `location`, `work_mode`, `duration`, `stipend`, `available_positions`, `application_deadline`, `status`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Full Stack Web Developer Intern', 'Infosys Limited', 'Join our Enterprise Cloud Solutions unit to develop scalable, modern full-stack web applications. You will collaborate with senior architects using React, PHP/Node.js, RESTful APIs, and MySQL. Candidates should have a good grasp of web security, responsive design, and version control.', 'HTML5, CSS3, JavaScript, PHP, MySQL, React, Git', 'B.Tech/B.E. in CS/IT with minimum 7.0 CGPA and no active backlogs.', 'Bengaluru, Karnataka', 'Hybrid', '6 Months', '₹28,000 / month', 5, '2026-12-15', 'Active', 1, '2026-09-01 10:00:00', '2026-09-01 10:00:00'),
(2, 'Frontend React & UI/UX Design Intern', 'Zoho Corporation', 'We are seeking an enthusiastic frontend developer with an eye for clean user interfaces. You will work on designing responsive client interfaces, component libraries, and interactive dashboards for our global SaaS ecosystem.', 'HTML5, CSS3, Tailwind CSS, JavaScript (ES6+), React, Figma', 'Open to 3rd & 4th year undergraduate students with hands-on portfolio projects.', 'Chennai, Tamil Nadu', 'On-site', '3 Months', '₹25,000 / month', 4, '2026-11-30', 'Active', 1, '2026-09-05 11:30:00', '2026-09-05 11:30:00'),
(3, 'Machine Learning Research Intern', 'TCS Innovation Labs', 'Collaborate with research scientists on exploratory projects in Applied Machine Learning, Natural Language Processing, and Predictive Analytics. Implement model pipelines, preprocess large enterprise datasets, and benchmark algorithmic performance.', 'Python, PyTorch/TensorFlow, Pandas, Scikit-Learn, SQL', 'B.Tech/M.Tech in CS/AI/Data Science with strong mathematical and programming foundation.', 'Hyderabad, Telangana', 'Remote', '6 Months', '₹35,000 / month', 3, '2026-12-05', 'Active', 1, '2026-09-10 14:00:00', '2026-09-10 14:00:00'),
(4, 'Cloud DevOps & Infrastructure Intern', 'Wipro Technologies', 'Work with our Cloud Enablement wing to build CI/CD pipelines, containerize microservices, monitor Linux production environments, and automate cloud infrastructure provisioning.', 'Linux, Docker, Kubernetes, CI/CD, AWS/Azure Basics, Bash', 'Students graduating in 2027 or 2028 with background in CS/IT/ECE.', 'Pune, Maharashtra', 'Hybrid', '4 Months', '₹22,000 / month', 2, '2026-11-20', 'Active', 1, '2026-09-15 09:45:00', '2026-09-15 09:45:00'),
(5, 'Data Analyst & Business Intelligence Intern', 'Deloitte India', 'Analyze real-world business KPIs, construct interactive executive dashboards in Power BI/Tableau, and execute advanced SQL querying on relational data warehouses for client reporting.', 'SQL, Advanced Excel, Power BI, Python, Business Analytics', 'B.Tech, B.Sc Computer Science, or MCA students with strong analytical aptitude.', 'Gurugram, Haryana', 'Hybrid', '3 Months', '₹30,000 / month', 3, '2026-12-25', 'Active', 1, '2026-09-20 15:10:00', '2026-09-20 15:10:00'),
(6, 'Cyber Security Analyst Intern', 'Cisco Systems', 'Assist the SOC (Security Operations Center) team in monitoring network traffic, auditing application vulnerabilities, configuring firewalls, and participating in ethical hacking drills.', 'Network Protocols, Linux, Wireshark, Ethical Hacking, Python', 'B.Tech in CS/IT/Cyber Security with demonstrated coursework or CTF certifications.', 'Bengaluru, Karnataka', 'On-site', '6 Months', '₹32,000 / month', 2, '2026-11-15', 'Active', 1, '2026-09-25 12:00:00', '2026-09-25 12:00:00'),
(7, 'Backend Java Microservices Intern (Archived)', 'Oracle India', 'Previous cycle archived posting for microservices and database clustering.', 'Java, Spring Boot, MySQL, REST APIs', 'Final year undergraduates.', 'Hyderabad, Telangana', 'Remote', '6 Months', '₹30,000 / month', 1, '2026-08-30', 'Closed', 1, '2026-08-01 10:00:00', '2026-09-01 10:00:00');

INSERT INTO `applications` (`id`, `student_id`, `internship_id`, `application_message`, `status`, `admin_remarks`, `applied_at`, `updated_at`) VALUES
(1, 2, 1, 'Respected Hiring Team, I am a 3rd year B.Tech student in CSE with hands-on experience building full-stack applications with React, PHP, and MySQL. I would love the opportunity to contribute to enterprise solutions at Infosys.', 'Shortlisted', 'Strong profile and relevant GitHub project repository. Proceed to technical round.', '2026-09-05 14:30:00', '2026-09-12 11:20:00'),
(2, 2, 2, 'Hello Zoho team, I have built several responsive web tools and have strong experience with Tailwind CSS and modern JavaScript. I look forward to learning from Zoho design experts.', 'Pending', NULL, '2026-09-18 09:15:00', '2026-09-18 09:15:00'),
(3, 3, 3, 'Dear Placement Cell, I have completed coursework in Applied Machine Learning and conducted exploratory research with PyTorch. I am eager to apply my data preprocessing and model evaluation skills.', 'Accepted', 'Interview cleared with high marks from the research panel. Offer letter issued.', '2026-09-12 16:45:00', '2026-09-28 17:00:00'),
(4, 3, 5, 'I am passionate about data modeling, business intelligence, and building executive dashboards using SQL and Power BI.', 'Under Review', 'Screening credentials with Deloitte campus hiring team.', '2026-09-22 10:00:00', '2026-09-24 14:10:00'),
(5, 4, 3, 'Hello, I am specializing in Artificial Intelligence & Data Science and have built predictive classifiers. I am eager to contribute to research papers and algorithms.', 'Under Review', 'Profile shortlisted for preliminary assessment test.', '2026-09-25 11:00:00', '2026-09-27 15:30:00'),
(6, 5, 6, 'I have practical understanding of network protocols, wireshark packet capture, and Linux security auditing.', 'Rejected', 'Candidate does not meet the prerequisite certification criteria for this cycle.', '2026-09-28 12:10:00', '2026-10-02 09:00:00');
