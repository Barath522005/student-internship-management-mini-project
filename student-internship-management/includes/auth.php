<?php
/**
 * Authentication and Session Management
 */

declare(strict_types=1);

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function isLoggedIn(): bool
{
    return isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);
}

function getCurrentUser(): ?array
{
    if (!isLoggedIn()) {
        return null;
    }
    return [
        'id'          => $_SESSION['user_id'] ?? null,
        'full_name'   => $_SESSION['user_name'] ?? '',
        'email'       => $_SESSION['user_email'] ?? '',
        'role'        => $_SESSION['user_role'] ?? '',
        'college'     => $_SESSION['user_college'] ?? '',
        'department'  => $_SESSION['user_department'] ?? '',
    ];
}

function requireAuth(string $requiredRole = ''): void
{
    if (!isLoggedIn()) {
        $_SESSION['flash_error'] = 'Please log in to access this page.';
        header('Location: ../login.php');
        exit;
    }

    if ($requiredRole !== '' && ($_SESSION['user_role'] ?? '') !== $requiredRole) {
        $_SESSION['flash_error'] = 'Unauthorized access: You do not have permissions for this section.';
        if (($_SESSION['user_role'] ?? '') === 'admin') {
            header('Location: ../admin/dashboard.php');
        } else {
            header('Location: ../student/dashboard.php');
        }
        exit;
    }
}

function requireAdmin(): void
{
    if (!isLoggedIn()) {
        $_SESSION['flash_error'] = 'Administrator authentication required.';
        header('Location: ../admin/login.php');
        exit;
    }
    if (($_SESSION['user_role'] ?? '') !== 'admin') {
        $_SESSION['flash_error'] = 'Access denied. Administrator privileges required.';
        header('Location: ../student/dashboard.php');
        exit;
    }
}

function requireStudent(): void
{
    requireAuth('student');
}
