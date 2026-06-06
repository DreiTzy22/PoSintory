#!/bin/sh

# Default port to 80 if PORT is not set
export PORT=${PORT:-80}

# Replace the port placeholder in Nginx config
sed -i "s/PORT_PLACEHOLDER/${PORT}/g" /etc/nginx/nginx.conf

# Run migrations (don't exit if it fails, just log it)
echo "Running migrations..."
php artisan migrate --force || echo "Migrations failed, continuing..."

# Cache configuration and routes
echo "Caching configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Start Supervisor
echo "Starting Supervisor on port ${PORT}..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
