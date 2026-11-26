# ==========================================
# Stage 1: Build Vite React SPA
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /app

# Build-time API URL (set in Dokploy Build Args / Environment)
ARG VITE_API_BASE_URL=https://api.shopnest.app/api/v1
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ==========================================
# Stage 2: Serve with Nginx (SPA + Gzip)
# ==========================================
FROM nginx:1.27-alpine AS runner

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
