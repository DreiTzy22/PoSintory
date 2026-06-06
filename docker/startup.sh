#!/bin/sh

# Default port to 80 if PORT is not set
export PORT=${PORT:-80}

# Replace the port placeholder in Nginx config
sed -i "s/PORT_PLACEHOLDER/${PORT}/g" /etc/nginx/nginx.conf

# 1. Run migrations first so database tables exist
echo "Running migrations..."
php artisan migrate --force || echo "Migrations failed, continuing..."

# 2. Clear and then Cache configuration for production
echo "Optimizing Laravel for production..."
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

php artisan config:cache
php artisan route:cache
php artisan view:cache

# 3. Ensure storage directories exist and are writable
echo "Setting up storage permissions..."
mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

# 4. Start Supervisor
echo "Starting Supervisor on port ${PORT}..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
