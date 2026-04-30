#!/bin/sh
php artisan config:cache
php artisan migrate --force 2>&1 || echo "Migrate failed"
php -S 0.0.0.0:${PORT:-8080} server.php
