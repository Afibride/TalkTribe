# Use the official PHP image with Apache
FROM php:8.2-apache

# Set working directory
WORKDIR /var/www/html

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    zip \
    unzip \
    libpq-dev \
    libonig-dev \
    libxml2-dev

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg
RUN docker-php-ext-install pdo pdo_mysql pdo_pgsql gd zip mbstring exif pcntl bcmath xml

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Set Apache document root to Laravel's public directory
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy existing application directory contents
COPY . .

# Change ownership to www-data for Apache (FIXED - do this before switching user)
RUN chown -R www-data:www-data /var/www/html

# Change to the correct user
USER www-data

# Install Laravel dependencies (no dev dependencies for production)
RUN composer install --optimize-autoloader --no-dev --ignore-platform-req=ext-gd

# Set proper permissions for Laravel
RUN chmod -R 775 storage bootstrap/cache

# Generate application key if not exists (but don't override existing .env)
RUN if [ ! -f .env ]; then \
        cp .env.example .env && \
        php artisan key:generate; \
    fi

# Since you're using Supabase storage, the storage:link is less critical
# but keep it for potential local development or fallback
RUN if [ -f artisan ]; then \
        php artisan storage:link; \
    fi

# Optimize for production
RUN if [ -f artisan ]; then \
        php artisan config:clear && \
        php artisan optimize:clear && \
        php artisan optimize; \
    fi

# Expose port 80 (Apache default)
EXPOSE 80

# Start Apache server
CMD ["apache2-foreground"]