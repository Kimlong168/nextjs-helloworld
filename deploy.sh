#!/bin/bash
cd /var/www/nextjs-helloworld || exit

echo "[🚀] Pulling latest code..."
git reset --hard
git pull origin main

echo "[📦] Installing dependencies..."
npm install

echo "[🏗️] Building app..."
npm run build

echo "[♻️] Reloading with PM2 (zero downtime)..."
pm2 reload nextjs-helloworld
