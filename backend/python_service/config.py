"""
Configuration module for GBHM Service
Loads environment variables and settings
"""

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    """Application Configuration"""
    
    # FastAPI Settings
    APP_NAME = "Career Nexus GBHM Service"
    APP_VERSION = "1.0.0"
    DEBUG = os.getenv("DEBUG", "False").lower() == "true"
    
    # Server Settings
    HOST = os.getenv("HOST", "0.0.0.0")
    PORT = int(os.getenv("PYTHON_SERVICE_PORT", 8000))
    
    # MongoDB Settings
    MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/careernexus")
    DB_NAME = os.getenv("DB_NAME", "careernexus")
    
    # Backend Settings
    BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:5000")
    
    # Logging
    LOG_LEVEL = os.getenv("LOG_LEVEL", "info")

# Create config instance
config = Config()