# Stage 1: Build assets
FROM node:20-alpine as asset-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: PHP environment
FROM php:8.2-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    nginx \
    supervisor \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    zip \
    libzip-dev \
    unzip \
    git \
    curl \
    oniguruma-dev \
    postgresql-dev

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd pdo_pgsql mbstring zip exif pcntl \
    && rm -rf /var/cache/apk/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy application code
COPY . .
COPY --from=asset-builder /app/public/build ./public/build

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Set permissions
RUN mkdir -p /var/run /var/log/nginx /var/log/supervisor /var/lib/nginx/tmp \
    && chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/run /var/log/nginx /var/log/supervisor /var/lib/nginx/tmp

# Copy configuration files
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/startup.sh /usr/local/bin/startup.sh
COPY docker/www.conf /usr/local/etc/php-fpm.d/www.conf

RUN chmod +x /usr/local/bin/startup.sh

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/startup.sh"]
