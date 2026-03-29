FROM node:20-alpine

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source code
COPY src/ ./src/

# Back4App will use PORT env var; default to 3000
EXPOSE 3000

CMD ["node", "src/server.js"]
