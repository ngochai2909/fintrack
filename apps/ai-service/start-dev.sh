#!/bin/bash

# FinTrack AI Service - Development Start Script

echo "=========================================="
echo "🚀 Starting FinTrack AI Service"
echo "=========================================="

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "⚠️  Virtual environment not found. Creating..."
    python3 -m venv venv
    echo "✅ Virtual environment created"
fi

# Activate virtual environment
echo "📦 Activating virtual environment..."
source venv/bin/activate

# Install/update dependencies
echo "📦 Installing dependencies..."
pip install -r requirements.txt

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "⚠️  IMPORTANT: Please edit .env and add your API keys!"
    echo "   - GEMINI_API_KEY or OPENROUTER_API_KEY"
    read -p "Press Enter after you've updated .env with your API key..."
fi

# Start FastAPI server
echo "=========================================="
echo "🎯 Starting AI Service on port 8001"
echo "📖 API Docs: http://localhost:8001/docs"
echo "=========================================="
uvicorn app.main:app --reload --port 8001 --host 0.0.0.0 --log-level info
