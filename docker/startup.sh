#!/bin/sh

# Default port to 80 if PORT is not set
export PORT=${PORT:-80}

# Replace the port placeholder in Nginx config
sed -i "s/PORT_PLACEHOLDER/${PORT}/g" /etc/nginx/nginx.conf

# Clear any existing caches
echo "Clearing caches..."
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

# Run migrations (don't exit if it fails, just log it)
echo "Running migrations..."
php artisan migrate --force || echo "Migrations failed, continuing..."

# Cache configuration and routes for production
echo "Caching configuration for production..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Ensure storage directories exist and are writable
echo "Setting up storage permissions..."
mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

# Remove any existing php-fpm socket to prevent "address already in use"
rm -f /var/run/php-fpm.sock

# Start Supervisor
echo "Starting Supervisor on port ${PORT}..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
