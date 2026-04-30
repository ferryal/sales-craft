#!/bin/sh
php artisan config:cache
exec php -S 0.0.0.0:8080 server.php
