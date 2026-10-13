<?php
/**
 * Shared Helper Functions
 */

declare(strict_types=1);

function sanitize(string $data): string
{
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

function e(?string $str): string
{
    return htmlspecialchars((string)$str, ENT_QUOTES, 'UTF-8');
}

function formatDate(?string $dateStr, string $format = 'd M Y'): string
{
    if (empty($dateStr)) {
        return 'N/A';
    }
    try {
        $date = new DateTime($dateStr);
        return $date->format($format);
    } catch (Exception $e) {
        return (string)$dateStr;
    }
}

function getStatusBadgeClass(string $status): string
{
    switch ($status) {
        case 'Active':
        case 'Accepted':
            return 'bg-success text-white';
        case 'Pending':
            return 'bg-warning text-dark';
        case 'Under Review':
            return 'bg-info text-dark';
        case 'Shortlisted':
            return 'bg-primary text-white';
        case 'Rejected':
        case 'Closed':
            return 'bg-danger text-white';
        default:
            return 'bg-secondary text-white';
    }
}

function setFlash(string $type, string $message): void
{
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    $_SESSION['flash_' . $type] = $message;
}

function displayFlashMessages(): void
{
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    if (isset($_SESSION['flash_success'])) {
        echo '<div class="alert alert-success alert-dismissible fade show" role="alert">
                <i class="bi bi-check-circle-fill me-2"></i>' . e($_SESSION['flash_success']) . '
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
              </div>';
        unset($_SESSION['flash_success']);
    }
    if (isset($_SESSION['flash_error'])) {
        echo '<div class="alert alert-danger alert-dismissible fade show" role="alert">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>' . e($_SESSION['flash_error']) . '
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
              </div>';
        unset($_SESSION['flash_error']);
    }
}
