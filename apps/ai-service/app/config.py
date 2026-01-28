"""Configuration management for AI Service"""
from typing import Literal
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PORT: int = 8001
    HOST: str = "0.0.0.0"
    ENVIRONMENT: Literal["development", "production", "staging"] = "development"
    
    GEMINI_API_KEY: str = ""
    OPENROUTER_API_KEY: str = ""
    
    AI_MODEL_PROVIDER: Literal["gemini", "openrouter"] = "gemini"
    AI_MODEL_NAME: str = "gemini-1.5-flash"
    
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:3001"
    LOG_LEVEL: Literal["DEBUG", "INFO", "WARNING", "ERROR"] = "INFO"
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )
    
    @property
    def cors_origins_list(self) -> list[str]:
        """Convert CORS_ORIGINS string to list"""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
    
    @property
    def is_development(self) -> bool:
        """Check if running in development mode"""
        return self.ENVIRONMENT == "development"


# Global settings instance
settings = Settings()
