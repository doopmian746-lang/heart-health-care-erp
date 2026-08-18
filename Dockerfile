FROM node:20-slim

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm install

COPY backend/ ./
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/server.mjs"]
