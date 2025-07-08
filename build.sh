#!/bin/bash
echo "🏗️  Building frontend and backend..."

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Install frontend dependencies and build
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

echo "🔨 Building React frontend..."
npm run build

echo "✅ Build complete!"