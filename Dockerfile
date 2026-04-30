FROM php:8.4-cli-bookworm

# ── System deps ───────────────────────────────────────────────────────────────
RUN apt-get update && apt-get install -y \
    curl git zip unzip \
    libpng-dev libonig-dev libxml2-dev libzip-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring xml ctype fileinfo zip \
    && rm -rf /var/lib/apt/lists/*

# ── Node.js 20 ────────────────────────────────────────────────────────────────
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# ── Composer ──────────────────────────────────────────────────────────────────
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# ── PHP deps (cached layer — only invalidates if composer.* changes) ──────────
COPY composer.json composer.lock ./
RUN COMPOSER_ALLOW_SUPERUSER=1 composer install \
    --no-dev \
    --no-scripts \
    --no-interaction \
    --optimize-autoloader

# ── Node deps (cached layer) ──────────────────────────────────────────────────
COPY package.json package-lock.json .npmrc ./
COPY pnpm-workspace.yaml ./
RUN npm ci

# ── Application source ────────────────────────────────────────────────────────
COPY . .

# ── Bootstrap package discovery with a temp .env ──────────────────────────────
RUN printf 'APP_KEY=base64:x+nJJ60WJW4iJBZ5YHKJt2AFMf1H1I4jQbCPdPrCq7I=\nAPP_URL=http://localhost\nAPP_ENV=production\n' > .env \
    && php artisan package:discover --ansi \
    && rm -f .env

# ── Build frontend ────────────────────────────────────────────────────────────
RUN npm run build

# ── Cache routes + views (no DB needed) ──────────────────────────────────────
RUN php artisan route:cache \
    && php artisan view:cache

# ── Storage permissions ───────────────────────────────────────────────────────
RUN mkdir -p storage/framework/{sessions,views,cache,testing} storage/logs bootstrap/cache \
    && chmod -R 777 storage bootstrap/cache

EXPOSE 8080

CMD ["sh", "-c", "php -S 0.0.0.0:${PORT:-8080} server.php"]
