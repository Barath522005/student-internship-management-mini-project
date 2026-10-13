<?php
/**
 * Public Landing Page
 * Student Internship and Placement Management System
 */

declare(strict_types=1);

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/functions.php';

$pdo = Database::getConnection();

// Query actual database records for statistics (not fake!)
$stmtStudents = $pdo->query("SELECT COUNT(*) AS total FROM users WHERE role = 'student'");
$totalStudents = (int)($stmtStudents->fetch()['total'] ?? 0);

$stmtInternships = $pdo->query("SELECT COUNT(*) AS total FROM internships WHERE status = 'Active'");
$activeInternships = (int)($stmtInternships->fetch()['total'] ?? 0);

$stmtApplications = $pdo->query("SELECT COUNT(*) AS total FROM applications");
$totalApplications = (int)($stmtApplications->fetch()['total'] ?? 0);

$stmtAccepted = $pdo->query("SELECT COUNT(*) AS total FROM applications WHERE status = 'Accepted'");
$acceptedApplications = (int)($stmtAccepted->fetch()['total'] ?? 0);

// Fetch top 3 active internships
$stmtRecent = $pdo->query("SELECT * FROM internships WHERE status = 'Active' ORDER BY id DESC LIMIT 3");
$recentInternships = $stmtRecent->fetchAll();

$pageTitle = 'Home - Student Internship and Placement Management System';
require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';
?>

<main>
    <!-- Hero Section -->
    <section class="py-5 bg-light border-bottom">
        <div class="container py-4">
            <div class="row align-items-center g-5">
                <div class="col-lg-7">
                    <span class="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 mb-3">
                        <i class="bi bi-stars me-1"></i>Official University Placement Cell Portal
                    </span>
                    <h1 class="display-5 fw-bold text-dark lh-sm mb-3">
                        Empowering Students with <span class="text-primary">Industry Internships</span>
                    </h1>
                    <p class="lead text-secondary mb-4">
                        Discover verified corporate internship opportunities, submit applications with custom cover letters, and track your recruitment status in real time.
                    </p>
                    <div class="d-flex flex-wrap gap-2">
                        <a href="student/internships.php" class="btn btn-primary btn-lg px-4">
                            <i class="bi bi-briefcase me-2"></i>Explore Internships
                        </a>
                        <a href="register.php" class="btn btn-outline-dark btn-lg px-4">
                            Get Started (Register)
                        </a>
                    </div>
                </div>
                <div class="col-lg-5">
                    <div class="card shadow-lg p-4 bg-white border-0">
                        <h6 class="text-uppercase text-secondary fw-bold small mb-3">
                            <i class="bi bi-database me-1 text-primary"></i>Live System Metrics (from MySQL)
                        </h6>
                        <div class="row g-3 text-center">
                            <div class="col-6">
                                <div class="p-3 bg-light rounded-3">
                                    <div class="display-6 fw-bold text-primary"><?= $activeInternships ?></div>
                                    <div class="small text-secondary fw-semibold">Active Openings</div>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="p-3 bg-light rounded-3">
                                    <div class="display-6 fw-bold text-indigo"><?= $totalStudents ?></div>
                                    <div class="small text-secondary fw-semibold">Registered Students</div>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="p-3 bg-light rounded-3">
                                    <div class="display-6 fw-bold text-warning"><?= $totalApplications ?></div>
                                    <div class="small text-secondary fw-semibold">Applications Filed</div>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="p-3 bg-light rounded-3">
                                    <div class="display-6 fw-bold text-success"><?= $acceptedApplications ?></div>
                                    <div class="small text-secondary fw-semibold">Confirmed Offers</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Featured Internships -->
    <section class="py-5">
        <div class="container py-3">
            <div class="d-flex justify-content-between align-items-end mb-4">
                <div>
                    <h6 class="text-primary text-uppercase fw-bold small mb-1">Opportunities</h6>
                    <h2 class="fw-bold mb-0">Featured Corporate Internships</h2>
                </div>
                <a href="student/internships.php" class="btn btn-outline-primary btn-sm">
                    View All Openings <i class="bi bi-arrow-right ms-1"></i>
                </a>
            </div>

            <div class="row g-4">
                <?php if (empty($recentInternships)): ?>
                    <div class="col-12 text-center py-5 text-secondary">
                        <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                        No active internships listed yet.
                    </div>
                <?php else: ?>
                    <?php foreach ($recentInternships as $item): ?>
                        <div class="col-md-4">
                            <div class="card h-100 p-4 border shadow-sm d-flex flex-column justify-content-between">
                                <div>
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <span class="badge bg-primary-subtle text-primary border border-primary-subtle">
                                            <?= e($item['work_mode']) ?>
                                        </span>
                                        <span class="badge bg-success-subtle text-success border border-success-subtle">
                                            <?= e($item['stipend']) ?>
                                        </span>
                                    </div>
                                    <h5 class="fw-bold mb-1 text-dark"><?= e($item['title']) ?></h5>
                                    <p class="text-secondary small fw-semibold mb-2">
                                        <i class="bi bi-building me-1"></i><?= e($item['company_name']) ?>
                                    </p>
                                    <p class="small text-muted mb-3" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                                        <?= e($item['description']) ?>
                                    </p>
                                </div>
                                <div>
                                    <div class="border-top pt-3 d-flex justify-content-between align-items-center small text-secondary">
                                        <span><i class="bi bi-geo-alt me-1"></i><?= e($item['location']) ?></span>
                                        <a href="student/internship-details.php?id=<?= $item['id'] ?>" class="btn btn-sm btn-primary">
                                            View & Apply
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
        </div>
    </section>

    <!-- How It Works Section -->
    <section class="py-5 bg-dark text-white">
        <div class="container py-3">
            <div class="text-center max-w-2xl mx-auto mb-5">
                <h6 class="text-primary text-uppercase fw-bold small">Structured Placement Cycle</h6>
                <h2 class="fw-bold">How the Portal Operates</h2>
            </div>
            <div class="row g-4 text-center">
                <div class="col-md-3">
                    <div class="p-4 bg-secondary bg-opacity-10 rounded-4 border border-secondary border-opacity-25 h-100">
                        <div class="fs-1 fw-bold text-primary mb-2">1</div>
                        <h5 class="fw-bold">Register Account</h5>
                        <p class="small text-white-50">Sign up with your college email, graduation batch, and branch of study.</p>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="p-4 bg-secondary bg-opacity-10 rounded-4 border border-secondary border-opacity-25 h-100">
                        <div class="fs-1 fw-bold text-primary mb-2">2</div>
                        <h5 class="fw-bold">Explore Listings</h5>
                        <p class="small text-white-50">Filter by tech stack, work mode (Remote/Hybrid), stipend, and eligibility.</p>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="p-4 bg-secondary bg-opacity-10 rounded-4 border border-secondary border-opacity-25 h-100">
                        <div class="fs-1 fw-bold text-primary mb-2">3</div>
                        <h5 class="fw-bold">Apply with Note</h5>
                        <p class="small text-white-50">Submit your application statement. Server checks prevent duplicate submissions.</p>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="p-4 bg-secondary bg-opacity-10 rounded-4 border border-secondary border-opacity-25 h-100">
                        <div class="fs-1 fw-bold text-primary mb-2">4</div>
                        <h5 class="fw-bold">Track Status</h5>
                        <p class="small text-white-50">Follow stages from Pending to Under Review, Shortlisted, and Accepted.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</main>

<?php
require_once __DIR__ . '/includes/footer.php';
?>
