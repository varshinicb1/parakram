# Parakram OS — Docker Production Deployment
# Build: docker build -t parakram-os .
# Run: docker run -p 8000:8000 -p 5173:5173 parakram-os

FROM python:3.11-slim AS backend

WORKDIR /app/backend

# Install system deps for PlatformIO and serial
RUN apt-get update && apt-get install -y --no-install-recommends \
    git curl build-essential && \
    rm -rf /var/lib/apt/lists/*

# Install Python deps
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY backend/ .

# Create data directories
RUN mkdir -p storage/datasheets storage/ota storage/exports storage/gallery \
    storage/subscriptions projects extensions

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# ── Frontend Build ─────────────────────────────────────────
FROM node:20-alpine AS frontend-build

WORKDIR /app/desktop
COPY desktop/package*.json ./
RUN npm ci
COPY desktop/ .
RUN npm run build

# ── Production Image ───────────────────────────────────────
FROM python:3.11-slim AS production

WORKDIR /app

# Install system deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    git curl nginx && \
    rm -rf /var/lib/apt/lists/*

# Backend
COPY --from=backend /app/backend /app/backend
COPY backend/requirements.txt /app/backend/
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# Frontend static files
COPY --from=frontend-build /app/desktop/dist /app/frontend

# Nginx config for frontend
RUN echo 'server { \
    listen 5173; \
    root /app/frontend; \
    index index.html; \
    location / { try_files $uri $uri/ /index.html; } \
    location /api { proxy_pass http://127.0.0.1:8000; } \
}' > /etc/nginx/sites-available/default

# Create data directories
RUN mkdir -p /app/backend/storage /app/backend/projects /app/backend/extensions

# Startup script
RUN echo '#!/bin/bash\n\
nginx &\n\
cd /app/backend && uvicorn main:app --host 0.0.0.0 --port 8000 &\n\
wait' > /app/start.sh && chmod +x /app/start.sh

EXPOSE 8000 5173

CMD ["/app/start.sh"]
