# Build stage for frontend
FROM node:20-slim AS frontend-builder

WORKDIR /build
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Build stage for backend
FROM node:20-slim AS backend-builder

WORKDIR /build
COPY server ./server
COPY package*.json ./
RUN npm install --production

# Runtime stage
FROM alpine:3.19 AS runtime

# Install Node.js and basic utilities
RUN apk add --no-cache nodejs npm

# Create a restricted user
RUN addgroup -S ctfuser && \
    adduser -S -G ctfuser ctfuser && \
    mkdir -p /app/dist /app/server /app/flag && \
    chown -R root:root /app && \
    chmod 755 /app

# Copy frontend files
WORKDIR /app
COPY --from=frontend-builder /build/dist ./dist

# Copy backend files and dependencies
COPY --from=backend-builder /build/server ./server
COPY --from=backend-builder /build/node_modules ./node_modules
COPY --from=backend-builder /build/package*.json ./

# Set up flag with very restricted permissions
COPY flag.txt /app/flag/flag.txt
RUN chown root:ctfuser /app/flag/flag.txt && \
    chmod 440 /app/flag/flag.txt

# Lock down permissions
RUN chmod 555 /app && \
    chmod 555 /app/dist && \
    chmod 555 /app/server && \
    chmod 444 /app/package*.json && \
    chmod 555 /app/flag

# Create minimal shell environment with only readflag
RUN echo '#!/bin/sh' > /usr/local/bin/readflag && \
    echo 'cat /app/flag/flag.txt' >> /usr/local/bin/readflag && \
    chmod 555 /usr/local/bin/readflag && \
    chmod 555 /usr/local/bin

# Remove unnecessary binaries and keep only essential ones
RUN find /bin /usr/bin ! -name 'readflag' ! -name 'node' ! -name 'sh' -type f -delete

# Switch to restricted user
USER ctfuser

# Configure environment
ENV NODE_ENV=production \
    PATH=/usr/local/bin:/usr/bin

# Expose required ports
EXPOSE 3000 5173

# Start application
CMD ["node", "server/index.js"]