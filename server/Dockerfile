FROM node:20-alpine AS server-builder

WORKDIR /app

COPY server/package*.json ./
RUN npm install

COPY server/ .
RUN npm run build
RUN npm prune --production

FROM node:20-alpine AS client-builder

WORKDIR /client

COPY client/package*.json ./
RUN npm install

COPY client/ .
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=server-builder /app/package*.json ./
COPY --from=server-builder /app/node_modules ./node_modules
COPY --from=server-builder /app/dist ./dist
COPY --from=server-builder /app/docker-entrypoint.sh ./docker-entrypoint.sh
COPY --from=client-builder /client/dist ./public
RUN chmod +x /app/docker-entrypoint.sh

EXPOSE 5000
ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["node", "dist/index.js"]
