#!/bin/sh
php artisan config:cache
echo "=== Starting PHP server on 8080 ==="
exec php -S 0.0.0.0:8080 -t public/ server.php 2>&1
