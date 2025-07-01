#!/bin/bash

# Load NVM
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"

# Use LTS Node.js
nvm use --lts

# Go to your dev project directory
cd /var/www/office-limi-dev || exit

# Pull latest dev branch code
echo "Pulling latest changes from Git (dev branch)..."
git pull origin dev

# Install dependencies
echo "Installing dependencies..."
npm install

# Restart dev app using PM2
echo "Restarting dev app with PM2..."
pm2 restart limi_backend_dev
