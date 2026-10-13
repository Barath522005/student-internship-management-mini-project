<?php
/**
 * Student Registration
 */

declare(strict_types=1);

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/functions.php';
require_once __DIR__ . '/includes/csrf.php';

if (isLoggedIn()) {
    header('Location: student/dashboard.php');
    exit;
}

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!validateCsrfToken($_POST['csrf_token'] ?? '')) {
        $error = 'Security session validation failed. Please refresh and try again.';
    } else {
        $fullName = trim($_POST['full_name'] ?? '');
        $email = trim(strtolower($_POST['email'] ?? ''));
        $phone = trim($_POST['phone'] ?? '');
        $college = trim($_POST['college_name'] ?? '');
        $department = trim($_POST['department'] ?? '');
        $degree = trim($_POST['degree'] ?? '');
        $gradYear = (int)($_POST['graduation_year'] ?? 0);
        $password = $_POST['password'] ?? '';
        $confirmPassword = $_POST['confirm_password'] ?? '';

        if (empty($fullName) || empty($email) || empty($phone) || empty($college) || empty($department) || empty($degree) || empty($gradYear) || empty($password)) {
            $error = 'Please fill out all mandatory fields.';
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $error = 'Please provide a valid email address.';
        } elseif (strlen($password) < 6) {
            $error = 'Password must be at least 6 characters long.';
        } elseif ($password !== $confirmPassword) {
            $error = 'Passwords do not match.';
        } else {
            $pdo = Database::getConnection();
            // Check duplicate email
            $checkStmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
            $checkStmt->execute([$email]);
            if ($checkStmt->fetch()) {
                $error = 'An account with this email address already exists. Please log in.';
            } else {
                $hash = password_hash($password, PASSWORD_BCRYPT);
                $insertStmt = $pdo->prepare(
                    "INSERT INTO users (full_name, email, phone, college_name, department, degree, graduation_year, password_hash, role) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'student')"
                );
                $insertStmt->execute([$fullName, $email, $phone, $college, $department, $degree, $gradYear, $hash]);
                
                $newId = (int)$pdo->lastInsertId();
                $_SESSION['user_id'] = $newId;
                $_SESSION['user_name'] = $fullName;
                $_SESSION['user_email'] = $email;
                $_SESSION['user_role'] = 'student';
                $_SESSION['user_college'] = $college;
                $_SESSION['user_department'] = $department;
                session_regenerate_id(true);

                header('Location: student/dashboard.php');
                exit;
            }
        }
    }
}

$pageTitle = 'Student Registration - SIPMS';
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';
?>

<main class="py-5">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-7 col-lg-6">
                <div class="card p-4 p-md-5 shadow-sm">
                    <div class="text-center mb-4">
                        <i class="bi bi-person-plus-fill fs-1 text-primary"></i>
                        <h3 class="fw-bold mt-2">Student Registration</h3>
                        <p class="text-secondary small">Join the campus placement management portal</p>
                    </div>

                    <?php if ($error): ?>
                        <div class="alert alert-danger small py-2"><?= e($error) ?></div>
                    <?php endif; ?>

                    <form method="POST" action="register.php">
                        <?= csrfField() ?>

                        <div class="mb-3">
                            <label class="form-label small fw-bold">Full Name *</label>
                            <input type="text" name="full_name" required class="form-control form-control-sm" value="<?= e($_POST['full_name'] ?? '') ?>" placeholder="e.g. Rahul Sharma">
                        </div>

                        <div class="row g-2 mb-3">
                            <div class="col-md-6">
                                <label class="form-label small fw-bold">Email Address *</label>
                                <input type="email" name="email" required class="form-control form-control-sm" value="<?= e($_POST['email'] ?? '') ?>" placeholder="student@college.edu">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label small fw-bold">Phone Number *</label>
                                <input type="tel" name="phone" required class="form-control form-control-sm" value="<?= e($_POST['phone'] ?? '') ?>" placeholder="+91 9876543210">
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label small fw-bold">College / Institution Name *</label>
                            <input type="text" name="college_name" required class="form-control form-control-sm" value="<?= e($_POST['college_name'] ?? '') ?>" placeholder="e.g. National Institute of Technology">
                        </div>

                        <div class="row g-2 mb-3">
                            <div class="col-md-4">
                                <label class="form-label small fw-bold">Department *</label>
                                <input type="text" name="department" required class="form-control form-control-sm" value="<?= e($_POST['department'] ?? '') ?>" placeholder="Computer Science">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label small fw-bold">Degree *</label>
                                <input type="text" name="degree" required class="form-control form-control-sm" value="<?= e($_POST['degree'] ?? '') ?>" placeholder="B.Tech">
                            </div>
                            <div class="col-md-4">
                                <label class="form-label small fw-bold">Graduation Year *</label>
                                <select name="graduation_year" class="form-select form-select-sm">
                                    <option value="2025">2025</option>
                                    <option value="2026">2026</option>
                                    <option value="2027" selected>2027</option>
                                    <option value="2028">2028</option>
                                </select>
                            </div>
                        </div>

                        <div class="row g-2 mb-4">
                            <div class="col-md-6">
                                <label class="form-label small fw-bold">Password *</label>
                                <input type="password" name="password" required class="form-control form-control-sm" placeholder="Min 6 characters">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label small fw-bold">Confirm Password *</label>
                                <input type="password" name="confirm_password" required class="form-control form-control-sm" placeholder="Re-type password">
                            </div>
                        </div>

                        <button type="submit" class="btn btn-primary w-100 py-2">Create Student Account</button>
                    </form>

                    <div class="text-center mt-3 small text-secondary">
                        Already have an account? <a href="login.php" class="text-primary fw-bold text-decoration-none">Sign In</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
