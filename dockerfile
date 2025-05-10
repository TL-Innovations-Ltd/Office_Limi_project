# Use the latest Node.js (current stable) with Alpine for a lightweight image
FROM node:current-alpine

# Set working directory inside the container
WORKDIR /src

# Copy package.json and package-lock.json for caching
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy the rest of your app
COPY . .

# Set environment to production
ENV NODE_ENV=production

# Expose the port (same as your Node.js app)
EXPOSE 3000

# Use PM2 to run your app in cluster mode with all available CPUs
# CMD ["pm2-runtime", "start", "index.js", "-i", "max"]
CMD ["npm", "start"]