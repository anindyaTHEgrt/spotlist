#!/bin/bash
set -e  # Exit on any error

echo "Starting build process..."

# Install Node.js dependencies
echo "Installing backend dependencies..."
npm install --prefix backend

echo "Installing frontend dependencies..."
npm install --prefix frontend

echo "Building frontend..."
npm run build --prefix frontend

# Python setup - DON'T create virtual environment on Render
echo "Installing Python packages globally..."

# Check if requirements.txt exists
if [ -f "python/py_backend/requirements.txt" ]; then
    echo "Found requirements.txt, installing packages..."
    pip3 install --user -r python/py_backend/requirements.txt
else
    echo "No requirements.txt found, installing essential packages..."
    pip3 install --user fastapi uvicorn websockets pydantic numpy scikit-learn joblib
fi

# Verify installation
echo "Verifying Python package installation..."
python3 -c "import fastapi; print('✅ FastAPI installed successfully')" || echo "❌ FastAPI installation failed"
python3 -c "import uvicorn; print('✅ Uvicorn installed successfully')" || echo "❌ Uvicorn installation failed"
python3 -c "import websockets; print('✅ WebSockets installed successfully')" || echo "❌ WebSockets installation failed"

echo "Build completed successfully!"