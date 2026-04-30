#!/bin/sh
php artisan config:cache
echo "=== Starting PHP server (IPv4+IPv6) on 8080 ==="
exec php -S 0.0.0.0:8080 server.php 2>&1
