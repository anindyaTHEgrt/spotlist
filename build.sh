#!/bin/bash

# Install Node.js dependencies
echo "Installing backend dependencies..."
npm install --prefix backend

echo "Installing frontend dependencies..."
npm install --prefix frontend

echo "Building frontend..."
npm run build --prefix frontend

# Setup Python virtual environment
echo "Setting up Python virtual environment..."
python -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r python/python_backend/requirements.txt

echo "Build completed successfully!"