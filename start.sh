#!/bin/sh
php artisan config:cache
timeout 15 php artisan migrate --force 2>&1 || echo "Migrate skipped (DB not ready)"
exec php -S 0.0.0.0:${PORT:-8080} server.php
