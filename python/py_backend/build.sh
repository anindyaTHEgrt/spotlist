#!/bin/bash
set -e

echo "Installing very stable versions..."
python -m pip install --upgrade pip==22.3.1
python -m pip install setuptools==65.5.1 wheel==0.38.4

# Install very old, stable versions
python -m pip install fastapi==0.85.0
python -m pip install uvicorn==0.18.3
python -m pip install websockets==10.3
python -m pip install pydantic==1.10.2
python -m pip install numpy==1.21.5
python -m pip install scikit-learn==1.1.3
python -m pip install joblib==1.2.0

echo "Build completed successfully!"