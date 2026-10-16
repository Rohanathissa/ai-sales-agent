# CapRover routes traffic to port 80 inside the container.
# One image serves the API and the built React app on the same origin.

FROM node:22-alpine AS frontend
WORKDIR /app
COPY ai-sales-agent-frontend/package.json ai-sales-agent-frontend/package-lock.json ./
RUN npm ci
COPY ai-sales-agent-frontend/ ./
ENV VITE_API_URL=/api
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=80
COPY ai-sales-agent-backend/package.json ai-sales-agent-backend/package-lock.json ./
RUN npm ci --omit=dev
COPY ai-sales-agent-backend/ ./
COPY --from=frontend /app/dist ./public
EXPOSE 80
CMD ["node", "src/server.js"]
