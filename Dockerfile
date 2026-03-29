# ── Build stage ──
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files and install all dependencies (including devDependencies for build)
COPY package*.json ./
RUN npm ci

# Copy source and config files
COPY index.html vite.config.js tailwind.config.js postcss.config.js eslint.config.js ./
COPY public/ ./public/
COPY src/ ./src/

# Vite bakes env vars at build time — pass these as build args
ARG VITE_API_URL
ARG VITE_YJS_URL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_YJS_URL=$VITE_YJS_URL

RUN npm run build

# ── Serve stage ──
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
