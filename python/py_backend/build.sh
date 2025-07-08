#!/bin/bash
set -e

echo "Installing build tools..."
python -m pip install --upgrade pip==23.3.1
python -m pip install setuptools==69.0.3 wheel==0.42.0 build==1.0.3

echo "Installing core dependencies..."
python -m pip install fastapi==0.104.1

echo "Installing uvicorn without extras first..."
python -m pip install uvicorn==0.24.0

echo "Installing websockets..."
python -m pip install websockets==12.0

echo "Installing pydantic..."
python -m pip install pydantic==2.5.0

echo "Installing numpy..."
python -m pip install numpy==1.24.3

echo "Installing scikit-learn..."
python -m pip install scikit-learn==1.3.0

echo "Installing joblib..."
python -m pip install joblib==1.3.2

echo "Build completed successfully!"