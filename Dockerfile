# Stage 1: Build
FROM node:22-slim AS builder

WORKDIR /app

# Install build dependencies for native modules
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json .npmrc ./
RUN npm ci --legacy-peer-deps

COPY prisma/ ./prisma/
COPY prisma7.config.ts ./
COPY tsconfig*.json nest-cli.json ./
RUN npx prisma generate

COPY src/ ./src/
RUN npm run build

# Stage 2: Production Runner
FROM node:22-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json .npmrc ./
RUN npm ci --omit=dev --legacy-peer-deps

COPY prisma/ ./prisma/
COPY prisma7.config.ts ./
COPY --from=builder /app/src/generated ./src/generated
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/schema.gql ./schema.gql

# Create persistent storage folder for database
RUN mkdir -p /app/data

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

CMD ["node", "dist/main.js"]
