#!/bin/bash
set -e

echo "Using Python 3.11 compatible versions..."
python -m pip install --upgrade pip==23.2.1
python -m pip install setuptools==68.0.0 wheel==0.41.2

python -m pip install fastapi==0.103.0
python -m pip install uvicorn==0.23.2
python -m pip install websockets==11.0.3
python -m pip install pydantic==2.3.0
python -m pip install numpy==1.24.3
python -m pip install scikit-learn==1.3.0
python -m pip install joblib==1.3.2

echo "Build completed successfully!"