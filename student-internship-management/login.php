<?php
/**
 * Student Login Portal
 */

declare(strict_types=1);

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/functions.php';
require_once __DIR__ . '/includes/csrf.php';

if (isLoggedIn()) {
    if (($_SESSION['user_role'] ?? '') === 'admin') {
        header('Location: admin/dashboard.php');
    } else {
        header('Location: student/dashboard.php');
    }
    exit;
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!validateCsrfToken($_POST['csrf_token'] ?? '')) {
        $error = 'Security session validation failed. Please refresh and try again.';
    } else {
        $email = trim(strtolower($_POST['email'] ?? ''));
        $password = $_POST['password'] ?? '';

        if (empty($email) || empty($password)) {
            $error = 'Please enter both your email address and password.';
        } else {
            $pdo = Database::getConnection();
            $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? AND role = 'student'");
            $stmt->execute([$email]);
            $user = $stmt->fetch();

            if ($user && password_verify($password, $user['password_hash'])) {
                session_regenerate_id(true);
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['user_name'] = $user['full_name'];
                $_SESSION['user_email'] = $user['email'];
                $_SESSION['user_role'] = 'student';
                $_SESSION['user_college'] = $user['college_name'];
                $_SESSION['user_department'] = $user['department'];

                header('Location: student/dashboard.php');
                exit;
            } else {
                $error = 'Invalid credentials or student account not found.';
            }
        }
    }
}

$pageTitle = 'Student Sign In - SIPMS';
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';
?>

<main class="py-5">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-5 col-lg-4">
                <div class="card p-4 p-md-5 shadow-sm">
                    <div class="text-center mb-4">
                        <i class="bi bi-mortarboard-fill fs-1 text-primary"></i>
                        <h3 class="fw-bold mt-2">Student Login</h3>
                        <p class="text-secondary small">Access your internship applications</p>
                    </div>

                    <?php if ($error): ?>
                        <div class="alert alert-danger small py-2"><?= e($error) ?></div>
                    <?php endif; ?>

                    <form method="POST" action="login.php">
                        <?= csrfField() ?>

                        <div class="mb-3">
                            <label class="form-label small fw-bold">Student Email</label>
                            <input type="email" name="email" required class="form-control" placeholder="rahul.sharma@college.edu" value="<?= e($_POST['email'] ?? '') ?>">
                        </div>

                        <div class="mb-4">
                            <label class="form-label small fw-bold">Password</label>
                            <input type="password" name="password" required class="form-control" placeholder="Enter your password">
                        </div>

                        <button type="submit" class="btn btn-primary w-100 py-2">Sign In</button>
                    </form>

                    <div class="bg-light p-2.5 rounded-3 border mt-3 small text-secondary">
                        <strong>Demo Student:</strong><br>
                        rahul.sharma@college.edu / Student@123
                    </div>

                    <div class="text-center mt-3 small text-secondary">
                        New student? <a href="register.php" class="text-primary fw-bold text-decoration-none">Create an Account</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
