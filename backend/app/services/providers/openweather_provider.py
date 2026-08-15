import httpx
from typing import Optional, Dict, Any
from app.core.config import settings

class OpenWeatherProvider:
    """
    Provider abstraction for OpenWeather API.
    Fetches real-time weather and forecasts for railway division coordinates.
    """
    def __init__(self):
        self.api_key = settings.OPENWEATHER_API_KEY
        self.base_url = "https://api.openweathermap.org/data/2.5"
        self.timeout = 5.0

    async def fetch_current_weather(self, lat: float = 28.6139, lon: float = 77.2090) -> Optional[Dict[str, Any]]:
        if not self.api_key:
            return None
        
        params = {
            "lat": lat,
            "lon": lon,
            "appid": self.api_key,
            "units": "metric"
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(f"{self.base_url}/weather", params=params)
                if response.status_code == 200:
                    return response.json()
        except Exception:
            return None
        return None

    async def fetch_forecast(self, lat: float = 28.6139, lon: float = 77.2090) -> Optional[Dict[str, Any]]:
        if not self.api_key:
            return None
        
        params = {
            "lat": lat,
            "lon": lon,
            "appid": self.api_key,
            "units": "metric"
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(f"{self.base_url}/forecast", params=params)
                if response.status_code == 200:
                    return response.json()
        except Exception:
            return None
        return None

openweather_provider = OpenWeatherProvider()
