# Multi-stage build for Angular app

# Build stage
FROM node:20-alpine AS build
WORKDIR /app

COPY src/web/package*.json ./
RUN npm ci

COPY src/web/ .
RUN npm run build

# Nginx stage
FROM nginx:alpine
COPY --from=build /app/dist/social-media-web /usr/share/nginx/html

COPY docker/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
