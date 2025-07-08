#!/bin/bash
set -e  # Exit on any error

# Install Node.js dependencies
echo "Installing backend dependencies..."
npm install --prefix backend

echo "Installing frontend dependencies..."
npm install --prefix frontend

echo "Building frontend..."
npm run build --prefix frontend

# Check Python version and install packages
echo "Checking Python version..."
python --version

# Try different Python installation approaches
echo "Installing Python packages..."
if command -v python3.11 &> /dev/null; then
    echo "Using Python 3.11..."
    python3.11 -m venv venv
    source venv/bin/activate
    pip install --upgrade pip setuptools wheel
    pip install -r python/py_backend/requirements.txt
elif python --version | grep -q "3.11"; then
    echo "Using system Python 3.11..."
    python -m venv venv
    source venv/bin/activate
    pip install --upgrade pip setuptools wheel
    pip install -r python/py_backend/requirements.txt
else
    echo "Using system Python with compatibility fixes..."
    python -m venv venv
    source venv/bin/activate
    pip install --upgrade pip
    pip install --upgrade setuptools wheel
    # Install packages one by one to identify issues
    pip install fastapi uvicorn websockets pydantic
fi

# Verify installation
echo "Verifying Python package installation..."
python -c "import fastapi; print('FastAPI installed successfully')"
python -c "import uvicorn; print('Uvicorn installed successfully')"
python -c "import websockets; print('WebSockets installed successfully')"

echo "Build completed successfully!"