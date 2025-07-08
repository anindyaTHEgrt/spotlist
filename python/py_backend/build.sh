#!/bin/bash
set -e

# Upgrade pip and install build tools first
python -m pip install --upgrade pip==23.3.1
python -m pip install setuptools==69.0.3 wheel==0.42.0

# Install packages one by one to avoid conflicts
python -m pip install fastapi==0.104.1
python -m pip install "uvicorn[standard]==0.24.0"
python -m pip install websockets==12.0
python -m pip install pydantic==2.5.0
python -m pip install numpy==1.24.3
python -m pip install scikit-learn==1.3.0
python -m pip install joblib==1.3.2

echo "Build completed successfully!"