FROM php:8.2-fpm

# Set working directory
WORKDIR /var/www

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libsqlite3-dev \
    zip \
    unzip \
    sqlite3 \
    nginx \
    supervisor \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql pdo_sqlite mbstring exif pcntl bcmath gd

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy existing application directory contents
COPY . /var/www

# Copy existing application directory permissions
COPY --chown=www-data:www-data . /var/www

# Create PHP-FPM configuration for root running
RUN mkdir -p /etc/supervisor/conf.d

# Copy Nginx configuration
COPY docker/nginx/conf.d/app.conf /etc/nginx/sites-available/default
RUN ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

# Create supervisord configuration
RUN echo "[supervisord]\nnodaemon=true\n\n[program:php-fpm]\ncommand=php-fpm\nautorestart=true\nstdout_logfile=/dev/stdout\nstdout_logfile_maxbytes=0\nstderr_logfile=/dev/stderr\nstderr_logfile_maxbytes=0\n\n[program:nginx]\ncommand=nginx -g 'daemon off;'\nautorestart=true\nstdout_logfile=/dev/stdout\nstdout_logfile_maxbytes=0\nstderr_logfile=/dev/stderr\nstderr_logfile_maxbytes=0" > /etc/supervisor/conf.d/supervisord.conf

# Install dependencies
RUN composer install --no-dev --optimize-autoloader

# Create necessary directories
RUN mkdir -p storage/logs && chmod -R 777 storage bootstrap/cache

# Copy build script
COPY build.sh /usr/local/bin/build.sh
RUN chmod +x /usr/local/bin/build.sh

# Expose port 80
EXPOSE 80

# Run supervisord to manage PHP-FPM and Nginx
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
