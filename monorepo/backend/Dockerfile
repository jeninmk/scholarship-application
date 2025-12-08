# 1. Base image
FROM python:3.11-slim

# 2. Set workdir & environment
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# 3. Install system deps (for Postgres, etc.)
RUN apt-get update && apt-get install -y \
    build-essential libpq-dev && rm -rf /var/lib/apt/lists/*

# 4. Copy & install Python requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copy project
COPY . .

# 6. Collect static (if you have any) and apply migrations on container start
CMD ["sh", "-c", "\
    python manage.py migrate && \
    python manage.py collectstatic --noinput && \
    gunicorn mybackend.wsgi:application --bind 0.0.0.0:8000"]