<?php
/**
 * Navigation Bar Component
 */

declare(strict_types=1);

require_once __DIR__ . '/auth.php';

$user = getCurrentUser();
$role = $user['role'] ?? null;
$basePath = (strpos($_SERVER['PHP_SELF'], '/student/') !== false || strpos($_SERVER['PHP_SELF'], '/admin/') !== false) ? '../' : './';
?>
<nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top py-2.5">
    <div class="container">
        <a class="navbar-brand d-flex items-center gap-2 text-primary" href="<?= $basePath ?>index.php">
            <i class="bi bi-mortarboard-fill fs-4 text-primary"></i>
            <span>SIPMS Portal</span>
            <span class="badge bg-primary-subtle text-primary border border-primary-subtle ms-1 fs-8">College Placement</span>
        </a>
        
        <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar" aria-controls="mainNavbar" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="mainNavbar">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3">
                <?php if (!$role): ?>
                    <li class="nav-item">
                        <a class="nav-link" href="<?= $basePath ?>index.php">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="<?= $basePath ?>student/internships.php">
                            <i class="bi bi-briefcase me-1"></i>Explore Internships
                        </a>
                    </li>
                <?php elseif ($role === 'student'): ?>
                    <li class="nav-item">
                        <a class="nav-link" href="<?= $basePath ?>student/dashboard.php">
                            <i class="bi bi-speedometer2 me-1"></i>Dashboard
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="<?= $basePath ?>student/internships.php">
                            <i class="bi bi-briefcase me-1"></i>Internships
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="<?= $basePath ?>student/applications.php">
                            <i class="bi bi-file-earmark-check me-1"></i>My Applications
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="<?= $basePath ?>student/profile.php">
                            <i class="bi bi-person me-1"></i>Profile
                        </a>
                    </li>
                <?php elseif ($role === 'admin'): ?>
                    <li class="nav-item">
                        <a class="nav-link" href="<?= $basePath ?>admin/dashboard.php">
                            <i class="bi bi-graph-up me-1"></i>Admin Overview
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="<?= $basePath ?>admin/internships.php">
                            <i class="bi bi-buildings me-1"></i>Manage Internships
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="<?= $basePath ?>admin/applications.php">
                            <i class="bi bi-card-checklist me-1"></i>Applications
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="<?= $basePath ?>admin/students.php">
                            <i class="bi bi-people me-1"></i>Students
                        </a>
                    </li>
                <?php endif; ?>
            </ul>

            <div class="d-flex align-items-center gap-2">
                <?php if (!$role): ?>
                    <a href="<?= $basePath ?>login.php" class="btn btn-outline-primary btn-sm px-3">Student Login</a>
                    <a href="<?= $basePath ?>register.php" class="btn btn-primary btn-sm px-3">Register</a>
                    <a href="<?= $basePath ?>admin/login.php" class="btn btn-outline-secondary btn-sm ms-1" title="Admin Portal">
                        <i class="bi bi-shield-lock me-1"></i>Admin
                    </a>
                <?php else: ?>
                    <div class="d-flex align-items-center gap-2 me-2">
                        <span class="badge <?= $role === 'admin' ? 'bg-warning text-dark' : 'bg-primary text-white' ?> px-2 py-1">
                            <?= $role === 'admin' ? 'Administrator' : 'Student' ?>
                        </span>
                        <span class="small fw-semibold"><?= htmlspecialchars($user['full_name'], ENT_QUOTES, 'UTF-8') ?></span>
                    </div>
                    <a href="<?= $basePath ?>logout.php" class="btn btn-outline-danger btn-sm" title="Sign Out">
                        <i class="bi bi-box-arrow-right me-1"></i>Logout
                    </a>
                <?php endif; ?>
            </div>
        </div>
    </div>
</nav>
