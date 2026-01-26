#!/bin/bash

# This script should be run on production (Render.com) to setup CafeNova

echo "🚀 Setting up CafeNova on Production..."

# 1. Run migrations
echo "📦 Running migrations..."
php artisan migrate --force

# 2. Create storage symlink (for accessing uploaded images)
echo "🔗 Creating storage symlink..."
php artisan storage:link

# 3. Clear caches
echo "🧹 Clearing caches..."
php artisan cache:clear
php artisan route:cache
php artisan config:cache
php artisan view:cache

echo "✅ Production setup complete!"
echo ""
echo "Now test the image upload endpoint:"
echo "POST https://cafenova.onrender.com/api/vendor/cafe/1/images/upload"
