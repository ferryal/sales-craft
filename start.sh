#!/bin/sh
php artisan config:cache
php -S 0.0.0.0:${PORT:-8080} server.php
