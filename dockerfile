# Use Node.js version matching local environment
FROM node:22-alpine

# Install system dependencies (bash, etc.)
RUN apk add --no-cache bash

# Set working directory inside the container
WORKDIR /src

# Copy package.json and package-lock.json first (for better caching)
COPY package*.json ./

# Install only production dependencies using npm ci
RUN npm ci --only=production

# Copy the rest of the project files
COPY . .

# Set environment variable to production
ENV NODE_ENV=production

# Expose the port your app runs on (change if your app uses a different port)
EXPOSE 3000

# Command to run your app
CMD ["npm", "start"]
