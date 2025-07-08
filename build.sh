#!/bin/bash
set -e

echo "📦 Starting build process..."
echo "Current directory: $(pwd)"

echo "📦 Installing backend dependencies..."
npm install --prefix backend

echo "📦 Installing frontend dependencies..."
npm install --prefix frontend

echo "🛠️ Building frontend..."
npm run build --prefix frontend

echo "🐍 Installing Python packages..."
pip3 install --upgrade pip setuptools wheel

REQ_FILE="python/py_backend/requirements.txt"

if [ -f "$REQ_FILE" ]; then
    echo "📄 Found requirements.txt, installing..."
    pip3 install -r "$REQ_FILE"
else
    echo "⚠️ No requirements.txt found, installing base packages"
    pip3 install fastapi uvicorn websockets pydantic numpy scikit-learn joblib
fi

echo "✅ Python package verification:"
python3 -c "import fastapi; print('✅ FastAPI installed')" || echo "❌ FastAPI missing"
