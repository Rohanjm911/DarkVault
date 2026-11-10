from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List


class Settings(BaseSettings):
    PROJECT_NAME: str = "DarkVault"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Security: CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:8080",
    ]
    
    # HIBP k-anonymity API
    HIBP_API_URL: str = "https://api.pwnedpasswords.com/range"
    HIBP_USER_AGENT: str = "DarkVault-Security-Command-Center"
    
    # Database (SQLite default, PostgreSQL compatible)
    DATABASE_URL: str = "sqlite:///./darkvault.db"
    
    # Privacy rule: ZERO plaintext password storage
    ALLOW_PLAINTEXT_TRANSMISSION: bool = False

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)


settings = Settings()
