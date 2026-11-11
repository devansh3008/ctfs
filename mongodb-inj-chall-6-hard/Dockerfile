# Use Node.js LTS version
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

RUN npm i -g pm2

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Start command
CMD ["pm2-runtime", "server.js"]

