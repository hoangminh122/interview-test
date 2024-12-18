# Stage 1: Build the application
FROM node:20.14.0-alpine AS builder

WORKDIR /src

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Create a smaller runtime image
FROM node:20.14.0-alpine

WORKDIR /app

# Copy built application files
COPY --from=builder /src/dist ./dist
COPY --from=builder /src/node_modules ./node_modules
COPY --from=builder /src/package*.json ./

# Create the logs directory
RUN mkdir -p ./logs && chmod 755 ./logs

EXPOSE 4000

CMD ["node", "dist/src/main.js"]
