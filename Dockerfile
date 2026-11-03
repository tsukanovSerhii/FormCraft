# Single-service image for demo hosting (Render, Railway, Fly.io, Koyeb):
# Express serves both the API and the built SPA from the same origin.
# For local multi-container setup use docker-compose.yml instead.
FROM node:22-slim

WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Install workspace dependencies from the single root lockfile
COPY package.json package-lock.json ./
COPY frontend/package.json frontend/
COPY backend/package.json backend/
RUN npm ci

COPY frontend frontend
COPY backend backend

# Empty API URL → the SPA calls the API with relative paths (same origin)
ENV VITE_API_URL=""
RUN npm run build -w frontend && npm run build -w backend

ENV NODE_ENV=production \
    PORT=3000 \
    TRUST_PROXY=1 \
    FRONTEND_DIST=/app/frontend/dist

WORKDIR /app/backend
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
