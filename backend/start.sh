#!/bin/bash

echo "Running migrations..."
php artisan migrate --force

echo "Starting supervisord..."
exec supervisord -c /etc/supervisor/conf.d/supervisord.conf
