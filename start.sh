#!/bin/sh

echo "=== Container started ==="
echo "PORT=${PORT}"

echo "=== Config cache ==="
php artisan config:cache

echo "=== Starting server on ${PORT:-8080} ==="
exec php -S 0.0.0.0:${PORT:-8080} server.php
