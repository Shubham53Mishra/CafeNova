# Docker Setup for Laravel 9 Backend

## Prerequisites
- Docker installed
- Docker Compose installed

## Setup Instructions

### 1. Copy Environment File
```bash
cp .env.example .env
```

### 2. Build and Start Docker Containers
```bash
docker-compose up -d
```

### 3. Install PHP Dependencies
```bash
docker-compose exec app composer install
```

### 4. Generate Application Key
```bash
docker-compose exec app php artisan key:generate
```

### 5. Run Database Migrations
```bash
docker-compose exec app php artisan migrate
```

## Access Points

- **Laravel API**: http://localhost
- **PhpMyAdmin**: http://localhost:8080
  - Username: `laravel`
  - Password: `laravel`

## Docker Services

1. **app** - PHP-FPM (port 9000)
2. **nginx** - Web Server (ports 80, 443)
3. **db** - MySQL 8.0 (port 3306)
4. **phpmyadmin** - Database Management (port 8080)

## Common Commands

### View Logs
```bash
docker-compose logs -f app
```

### Stop Containers
```bash
docker-compose down
```

### Run Artisan Commands
```bash
docker-compose exec app php artisan {command}
```

### Access Container Shell
```bash
docker-compose exec app bash
```

### Rebuild Containers
```bash
docker-compose up -d --build
```

## Environment Variables

Update `.env` file for Docker:
- `DB_HOST=db` (Docker service name)
- `DB_USERNAME=laravel`
- `DB_PASSWORD=laravel`
- `DB_DATABASE=laravel`

## Troubleshooting

### Port Already in Use
Change port mapping in `docker-compose.yml`:
```yaml
ports:
  - "8000:80"  # Changed from 80:80
```

### Database Connection Error
Ensure all containers are running:
```bash
docker-compose ps
```

### Clear Cache
```bash
docker-compose exec app php artisan cache:clear
docker-compose exec app php artisan config:cache
```
