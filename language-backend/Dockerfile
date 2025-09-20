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
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd \
    && docker-php-ext-install pdo pdo_mysql pdo_pgsql zip

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Set Apache document root to Laravel's public directory
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf \
    && sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy existing application directory contents
COPY . .

# Set proper ownership and permissions
RUN chown -R www-data:www-data /var/www/html \
    && find /var/www/html -type f -exec chmod 644 {} \; \
    && find /var/www/html -type d -exec chmod 755 {} \; \
    && chmod -R 775 storage bootstrap/cache

# Switch to www-data user
USER www-data

# Install Laravel dependencies (no dev dependencies for production)
RUN composer install --optimize-autoloader --no-dev --no-interaction --no-progress

# Generate application key if not exists (but don't overwrite existing .env)
RUN if [ ! -f .env ]; then \
        cp .env.example .env && \
        php artisan key:generate --force; \
    fi

# Create storage link (for local development scenarios)
RUN php artisan storage:link

# Expose port 80 (Apache default)
EXPOSE 80

# Start Apache server
CMD ["apache2-foreground"]