<?php

/**
 * Laravel router for PHP built-in server.
 * Routes all requests to public/index.php (Laravel's front controller)
 * while serving static assets from public/ directly.
 */
$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

if ($uri !== '/' && file_exists(__DIR__ . '/public' . $uri)) {
    return false; // serve static files directly
}

require_once __DIR__ . '/public/index.php';
