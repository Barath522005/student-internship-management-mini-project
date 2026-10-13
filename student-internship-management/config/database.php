<?php
/**
 * Database Connection using PDO
 * Student Internship and Placement Management System
 */

declare(strict_types=1);

define('DB_HOST', 'localhost');
define('DB_NAME', 'student_internship_db');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

class Database
{
    private static ?PDO $instance = null;

    public static function getConnection(): PDO
    {
        if (self::$instance === null) {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];

            try {
                self::$instance = new PDO($dsn, DB_USER, DB_PASS, $options);
            } catch (PDOException $e) {
                // In production, log error and show friendly message
                die("Database connection failed: " . htmlspecialchars($e->getMessage(), ENT_QUOTES, 'UTF-8'));
            }
        }

        return self::$instance;
    }
}
