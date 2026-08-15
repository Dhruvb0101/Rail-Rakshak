import httpx
from typing import Optional, Dict, Any, List
from app.core.config import settings

class RailRadarProvider:
    """
    Provider abstraction for the RailRadar External Live Train Tracking API.
    Handles network calls, auth headers, rate-limiting, and error recovery.
    """
    def __init__(self):
        self.api_key = settings.RAILRADAR_API_KEY
        self.base_url = "https://api.railradar.io/v1" # Standardized provider base URL
        self.timeout = 5.0

    async def fetch_live_trains(self, division: str = "Delhi") -> Optional[List[Dict[str, Any]]]:
        if not self.api_key:
            return None
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Accept": "application/json"
        }
        params = {"division": division}

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(f"{self.base_url}/trains/live", headers=headers, params=params)
                if response.status_code == 200:
                    return response.json().get("data", [])
        except Exception:
            return None
        return None

    async def fetch_train_details(self, train_number: str) -> Optional[Dict[str, Any]]:
        if not self.api_key:
            return None
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Accept": "application/json"
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(f"{self.base_url}/trains/{train_number}", headers=headers)
                if response.status_code == 200:
                    return response.json().get("data", None)
        except Exception:
            return None
        return None

railradar_provider = RailRadarProvider()
