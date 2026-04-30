#!/bin/sh

echo "=== Container started ==="
echo "PORT=${PORT}"
echo "DB_HOST=${DB_HOST}"
echo "DB_PORT=${DB_PORT}"

echo "=== Config cache ==="
php artisan config:cache

echo "=== DB migrate (timeout 30s) ==="
timeout 30 php artisan migrate --force 2>&1 || echo "Migrate failed or timed out — DB may not be ready"

echo "=== Starting server on ${PORT:-8080} ==="
exec php -S 0.0.0.0:${PORT:-8080} server.php
