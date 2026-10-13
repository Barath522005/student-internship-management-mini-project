<?php
/**
 * Shared HTML Footer
 */
?>
<footer class="bg-dark text-white-50 py-5 mt-auto border-top border-secondary">
    <div class="container">
        <div class="row g-4">
            <div class="col-md-5">
                <div class="d-flex align-items-center gap-2 mb-2 text-white">
                    <i class="bi bi-mortarboard-fill text-primary fs-4"></i>
                    <h5 class="mb-0 fw-bold">SIPMS Portal</h5>
                </div>
                <p class="small text-secondary mb-3">
                    Student Internship and Placement Management System. A complete relational database driven solution for college placement drives and student career progression.
                </p>
                <div class="d-flex flex-wrap gap-1">
                    <span class="badge bg-secondary">PHP 8+</span>
                    <span class="badge bg-secondary">MySQL (PDO)</span>
                    <span class="badge bg-secondary">Bootstrap 5</span>
                    <span class="badge bg-secondary">XAMPP</span>
                </div>
            </div>
            
            <div class="col-md-3">
                <h6 class="text-white text-uppercase small fw-bold mb-3">Quick Navigation</h6>
                <ul class="list-unstyled small space-y-1 mb-0">
                    <li><a href="<?= (strpos($_SERVER['PHP_SELF'], '/student/') !== false || strpos($_SERVER['PHP_SELF'], '/admin/') !== false) ? '../' : './' ?>student/internships.php" class="text-secondary text-decoration-none">Explore Openings</a></li>
                    <li><a href="<?= (strpos($_SERVER['PHP_SELF'], '/student/') !== false || strpos($_SERVER['PHP_SELF'], '/admin/') !== false) ? '../' : './' ?>login.php" class="text-secondary text-decoration-none">Student Portal</a></li>
                    <li><a href="<?= (strpos($_SERVER['PHP_SELF'], '/student/') !== false || strpos($_SERVER['PHP_SELF'], '/admin/') !== false) ? '../' : './' ?>admin/login.php" class="text-secondary text-decoration-none">Admin Sign In</a></li>
                </ul>
            </div>

            <div class="col-md-4">
                <h6 class="text-white text-uppercase small fw-bold mb-3">Academic Mini Project</h6>
                <p class="small text-secondary mb-2">
                    Engineered with security best practices: Prepared Statements, Password Hashing, CSRF tokens, and Role Based Access Control.
                </p>
                <p class="small text-secondary mb-0">
                    Database: <code class="text-info">student_internship_db</code>
                </p>
            </div>
        </div>

        <div class="border-top border-secondary mt-4 pt-3 d-flex flex-column flex-sm-row justify-content-between small text-secondary">
            <span>© 2026 Student Internship and Placement Management System</span>
            <span>Developed for College Project Evaluation</span>
        </div>
    </div>
</footer>

<!-- Bootstrap 5 JS Bundle -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
