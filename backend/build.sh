#!/bin/bash
set -e

echo "Installing PHP dependencies..."
composer install --no-dev --optimize-autoloader

echo "Generating application key..."
php artisan key:generate --force

echo "Running migrations..."
php artisan migrate --force

echo "Clearing cache..."
php artisan cache:clear
php artisan config:clear

echo "Build completed successfully!"
