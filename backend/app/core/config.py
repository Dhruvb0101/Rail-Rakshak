import os
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

class Settings(BaseModel):
    PROJECT_NAME: str = "RailRakshak AI Backend"
    API_V1_STR: str = "/api"
    POSTGRES_URL: str = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost:5432/railrakshak")
    AI_MODEL_NAME: str = os.getenv("AI_MODEL_NAME", "RailRakshak-ResNet50-Rail")
    AI_MODEL_VERSION: str = os.getenv("AI_MODEL_VERSION", "v2.4.0")
    
    # Supabase Configuration
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_ANON_KEY", "")
    SUPABASE_SERVICE_KEY: str = os.getenv("SUPABASE_SERVICE_KEY", "")
    
    # External API Keys & Demo Mode
    RAILRADAR_API_KEY: str = os.getenv("RAILRADAR_API_KEY", "")
    OPENWEATHER_API_KEY: str = os.getenv("OPENWEATHER_API_KEY", "")
    DEMO_MODE: bool = os.getenv("DEMO_MODE", "true").lower() in ("true", "1", "t", "yes")
    
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000", "*"]

settings = Settings()

