@echo off
REM FinTrack AI Service - Development Start Script (Windows)

echo ==========================================
echo Starting FinTrack AI Service
echo ==========================================

REM Check if virtual environment exists
if not exist "venv" (
    echo Virtual environment not found. Creating...
    python -m venv venv
    echo Virtual environment created
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install/update dependencies
echo Installing dependencies...
pip install -r requirements.txt

REM Check if .env exists
if not exist ".env" (
    echo .env file not found. Creating from .env.example...
    copy .env.example .env
    echo IMPORTANT: Please edit .env and add your API keys!
    echo    - GEMINI_API_KEY or OPENROUTER_API_KEY
    pause
)

REM Start FastAPI server
echo ==========================================
echo Starting AI Service on port 8001
echo API Docs: http://localhost:8001/docs
echo ==========================================
uvicorn app.main:app --reload --port 8001 --host 0.0.0.0 --log-level info
