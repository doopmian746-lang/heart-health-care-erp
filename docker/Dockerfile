FROM node:20-alpine AS build

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Backend dependencies
COPY backend/package*.json backend/
RUN cd backend && npm ci

# Frontend dependencies
COPY frontend/package*.json frontend/
RUN cd frontend && npm ci

# Copy source
COPY backend/ backend/
COPY frontend/ frontend/
COPY .env.example .env

# Build frontend
RUN cd frontend && npm run build

# Build backend
RUN cd backend && npm run build

# Production image
FROM node:20-alpine
RUN apk add --no-cache python3 make g++ sqlite

WORKDIR /app

COPY --from=build /app/backend/dist /app/dist
COPY --from=build /app/backend/node_modules /app/node_modules
COPY --from=build /app/backend/package.json /app/package.json
COPY --from=build /app/frontend/dist /app/frontend/dist

EXPOSE 3000

VOLUME ["/app/data"]

CMD ["node", "dist/server.cjs"]
