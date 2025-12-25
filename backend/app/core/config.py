# File: backend/app/core/config.py

from pydantic_settings import BaseSettings
from datetime import timedelta
from pathlib import Path

class Settings(BaseSettings):
    DATABASE_URL: str

# --- JWT SETTINGS ---
    SECRET_KEY: str = "your_very_secret_key_needs_to_be_long_and_random" # Replace with a real secret!
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30 # Token validity: 30 minutes

    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'
settings = Settings()