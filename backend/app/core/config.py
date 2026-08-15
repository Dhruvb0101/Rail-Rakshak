import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "RailRakshak AI Backend"
    API_V1_STR: str = "/api"
    POSTGRES_URL: str = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost:5432/railrakshak")
    AI_MODEL_NAME: str = "RailRakshak-ResNet50-Rail"
    AI_MODEL_VERSION: str = "v2.4.0"
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]

settings = Settings()
