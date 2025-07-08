#!/bin/bash
set -e

echo "🏗️  Starting build process..."

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies and build
echo "📦 Installing frontend dependencies..."
cd frontend
npm install

echo "🔨 Building React frontend..."
npm run build

# Check if build was successful
if [ -d "dist" ]; then
    echo "✅ Frontend build successful!"
    echo "📁 Build files located in frontend/dist/"
else
    echo "❌ Frontend build failed!"
    exit 1
fi

cd ..

echo "🎉 Build process complete!"
echo "🚀 Ready to start with 'npm start'"