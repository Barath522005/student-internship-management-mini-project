<?php
/**
 * Administrator Login Portal
 */

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/functions.php';
require_once __DIR__ . '/../includes/csrf.php';

if (isLoggedIn() && ($_SESSION['user_role'] ?? '') === 'admin') {
    header('Location: dashboard.php');
    exit;
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!validateCsrfToken($_POST['csrf_token'] ?? '')) {
        $error = 'Security validation failed. Please try again.';
    } else {
        $email = trim(strtolower($_POST['email'] ?? ''));
        $password = $_POST['password'] ?? '';

        if (empty($email) || empty($password)) {
            $error = 'Please fill out both administrator email and password.';
        } else {
            $pdo = Database::getConnection();
            $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? AND role = 'admin'");
            $stmt->execute([$email]);
            $admin = $stmt->fetch();

            if ($admin && password_verify($password, $admin['password_hash'])) {
                session_regenerate_id(true);
                $_SESSION['user_id'] = $admin['id'];
                $_SESSION['user_name'] = $admin['full_name'];
                $_SESSION['user_email'] = $admin['email'];
                $_SESSION['user_role'] = 'admin';
                $_SESSION['user_college'] = $admin['college_name'];
                $_SESSION['user_department'] = $admin['department'];

                header('Location: dashboard.php');
                exit;
            } else {
                $error = 'Invalid administrator credentials.';
            }
        }
    }
}

$pageTitle = 'Placement Admin Login - SIPMS';
require_once __DIR__ . '/../includes/header.php';
require_once __DIR__ . '/../includes/navbar.php';
?>

<main class="py-5">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-5 col-lg-4">
                <div class="card p-4 p-md-5 shadow-sm border-warning border-opacity-50">
                    <div class="text-center mb-4">
                        <i class="bi bi-shield-lock-fill fs-1 text-warning"></i>
                        <h3 class="fw-bold mt-2">Placement Officer Login</h3>
                        <p class="text-secondary small">Administrative console access</p>
                    </div>

                    <?php if ($error): ?>
                        <div class="alert alert-danger small py-2"><?= e($error) ?></div>
                    <?php endif; ?>

                    <form method="POST" action="login.php">
                        <?= csrfField() ?>

                        <div class="mb-3">
                            <label class="form-label small fw-bold">Administrator Email</label>
                            <input type="email" name="email" required class="form-control" placeholder="admin@example.com" value="<?= e($_POST['email'] ?? '') ?>">
                        </div>

                        <div class="mb-4">
                            <label class="form-label small fw-bold">Password</label>
                            <input type="password" name="password" required class="form-control" placeholder="Admin@123">
                        </div>

                        <button type="submit" class="btn btn-warning w-100 py-2 fw-bold text-dark">Sign In as Admin</button>
                    </form>

                    <div class="bg-light p-2.5 rounded-3 border mt-3 small text-secondary">
                        <strong>Default Admin Credentials:</strong><br>
                        admin@example.com / Admin@123
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
