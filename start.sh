#!/bin/sh
php artisan config:cache
echo "=== Running migrations ==="
timeout 30 php artisan migrate --force 2>&1 || echo "Migration timed out or failed"
echo "=== Seeding demo user ==="
timeout 15 php artisan db:seed --force 2>&1 || echo "Seed failed"
echo "=== Starting PHP server on 8080 ==="
exec php -S 0.0.0.0:8080 -t public/ server.php 2>&1
