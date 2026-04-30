#!/bin/sh
set -x

echo "=== Container started ==="
echo "PORT=${PORT}"
echo "PWD=$(pwd)"
echo "server.php exists: $(test -f server.php && echo YES || echo NO)"
echo "public/index.php exists: $(test -f public/index.php && echo YES || echo NO)"

echo "=== PHP version ==="
php -v

echo "=== Running migrate (ignore failures) ==="
php artisan migrate --force 2>&1 || echo "MIGRATE FAILED"

echo "=== Starting php -S on port ${PORT:-8080} ==="
exec php -S 0.0.0.0:${PORT:-8080} server.php 2>&1
