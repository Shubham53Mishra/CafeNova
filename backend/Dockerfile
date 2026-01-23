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
    libpq-dev \
    zip \
    unzip \
    sqlite3 \
    nginx \
    supervisor \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql pdo_sqlite pdo_pgsql mbstring exif pcntl bcmath gd

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy existing application directory contents
COPY . /var/www

# Copy existing application directory permissions
COPY --chown=www-data:www-data . /var/www

# Create PHP-FPM configuration for root running
RUN mkdir -p /etc/supervisor/conf.d

# Create Nginx configuration
RUN mkdir -p /etc/nginx/sites-available /etc/nginx/sites-enabled
RUN echo 'server {\n    listen 80;\n    server_name _;\n    index index.php index.html;\n    error_log  /var/log/nginx/error.log;\n    access_log /var/log/nginx/access.log;\n    root /var/www/public;\n\n    location ~ \.php$ {\n        try_files $uri =404;\n        fastcgi_split_path_info ^(.+\.php)(/.+)$;\n        fastcgi_pass 127.0.0.1:9000;\n        fastcgi_index index.php;\n        include fastcgi_params;\n        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;\n        fastcgi_param PATH_INFO $fastcgi_path_info;\n    }\n\n    location / {\n        try_files $uri $uri/ /index.php?$query_string;\n    }\n}' > /etc/nginx/sites-available/default
RUN ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

# Create supervisord configuration
RUN echo "[supervisord]\nnodaemon=true\n\n[program:php-fpm]\ncommand=php-fpm\nautorestart=true\nstdout_logfile=/dev/stdout\nstdout_logfile_maxbytes=0\nstderr_logfile=/dev/stderr\nstderr_logfile_maxbytes=0\n\n[program:nginx]\ncommand=nginx -g 'daemon off;'\nautorestart=true\nstdout_logfile=/dev/stdout\nstdout_logfile_maxbytes=0\nstderr_logfile=/dev/stderr\nstderr_logfile_maxbytes=0" > /etc/supervisor/conf.d/supervisord.conf

# Install dependencies
RUN composer install --no-dev --optimize-autoloader

# Create necessary directories
RUN mkdir -p storage/logs && chmod -R 777 storage bootstrap/cache

# Copy build script and start script
COPY build.sh /usr/local/bin/build.sh
COPY start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/build.sh /usr/local/bin/start.sh

# Expose port 80
EXPOSE 80

# Run start.sh which runs migrations and then supervisord
CMD ["/usr/local/bin/start.sh"]
