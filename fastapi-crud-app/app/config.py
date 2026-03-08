"""Application configuration."""
import os
from pydantic import BaseSettings


class Settings(BaseSettings):
    """Application settings."""
    
    app_name: str = "FastAPI CRUD Application"
    app_version: str = "1.0.0"
    debug: bool = True
    
    # Database
    database_url: str = "sqlite:///./test.db"
    
    class Config:
        env_file = ".env"


settings = Settings()
