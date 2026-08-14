#!/bin/bash
set -e   # exit on any error

# === Load NVM so node/npm/pm2 are available in non-interactive SSH ===
export NVM_DIR="/home/deploy/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Also add explicitly to PATH as a belt-and-braces measure
export PATH="/home/deploy/.nvm/versions/node/v24.18.0/bin:$PATH"

LOG_PREFIX="[$(date '+%Y-%m-%d %H:%M:%S')]"

echo "$LOG_PREFIX → Starting deploy for dinepixel"
echo "$LOG_PREFIX Node: $(node -v), npm: $(npm -v), pm2: $(pm2 -v)"

cd /home/deploy/dinepixel

echo "$LOG_PREFIX → Pulling latest code..."
git pull

echo "$LOG_PREFIX → Installing dependencies..."
npm install

echo "$LOG_PREFIX → Building Next.js..."
npm run build

echo "$LOG_PREFIX → Restarting PM2..."
pm2 restart dinepixel-web --update-env
pm2 save

echo "$LOG_PREFIX ✓ Deploy complete"
