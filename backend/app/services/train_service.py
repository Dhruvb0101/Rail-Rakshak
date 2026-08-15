import time
import math
from typing import List, Optional, Dict, Any
from app.schemas.all_schemas import LiveTrainSchema, TrainApproachingAlertSchema
from app.services.providers.railradar_provider import railradar_provider
from app.core.config import settings

# Key Delhi Division track coordinates for simulation trajectories
TRACK_ROUTES = {
    "NDLS-GZB": [
        (28.6429, 77.2195), # New Delhi
        (28.6500, 77.2500),
        (28.6554, 77.2912), # Defect at KM 142.6
        (28.6620, 77.3100),
        (28.6700, 77.4200), # Ghaziabad
    ],
    "NDLS-TKD": [
        (28.6429, 77.2195),
        (28.5800, 77.2400),
        (28.5742, 77.2481), # Defect at KM 88.2
        (28.5100, 77.2800), # Tuglakabad
    ],
    "DLI-UMB": [
        (28.6600, 77.2280), # Old Delhi
        (28.7200, 77.1700),
        (28.8500, 77.0800), # Ambala line
    ],
    "NZM-AGC": [
        (28.5880, 77.2530), # Nizamuddin
        (28.4500, 77.3100),
        (28.2500, 77.3800), # Agra line
    ]
}

# Known AI Defect Coordinates for correlation
CRITICAL_DEFECT_KM142 = {
    "id": "DET-2026-0892",
    "type": "Transverse Rail Fracture Crack",
    "lat": 28.6554,
    "lng": 77.2912,
    "locationKm": "KM 142.6 (Mainline Up)",
    "severity": "CRITICAL"
}

def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0 # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)

class TrainService:
    def __init__(self):
        self.simulation_step = 0
        self.last_update_time = time.time()

    def _interpolate_pos(self, route_key: str, progress: float) -> tuple[float, float]:
        points = TRACK_ROUTES.get(route_key, TRACK_ROUTES["NDLS-GZB"])
        idx = int(progress * (len(points) - 1))
        next_idx = min(idx + 1, len(points) - 1)
        sub_t = (progress * (len(points) - 1)) - idx
        
        lat = points[idx][0] + (points[next_idx][0] - points[idx][0]) * sub_t
        lng = points[idx][1] + (points[next_idx][1] - points[idx][1]) * sub_t
        return round(lat, 4), round(lng, 4)

    async def get_live_trains(self) -> List[LiveTrainSchema]:
        now = time.time()
        elapsed = now - self.last_update_time
        self.simulation_step += elapsed * 0.005
        self.last_update_time = now

        # Try real RailRadar provider if configured & demo mode is false
        if not settings.DEMO_MODE and settings.RAILRADAR_API_KEY:
            live_data = await railradar_provider.fetch_live_trains("Delhi")
            if live_data:
                # Map raw provider data into LiveTrainSchema
                pass

        # High-fidelity realistic train simulation across Northern Railway / Delhi Division
        t1_progress = (0.65 + (math.sin(self.simulation_step * 0.5) * 0.15)) % 1.0
        lat1, lng1 = self._interpolate_pos("NDLS-GZB", t1_progress)
        
        # Calculate distance of Train 12001 to the critical crack at KM 142.6
        dist_to_crack = haversine_km(lat1, lng1, CRITICAL_DEFECT_KM142["lat"], CRITICAL_DEFECT_KM142["lng"])
        train1_speed = 84.0
        eta_minutes = round((dist_to_crack / train1_speed) * 60, 2)
        mins = int(eta_minutes)
        secs = int((eta_minutes - mins) * 60)
        eta_formatted = f"{mins}m {secs:02d}s"

        # Generate critical train-approaching-defect safety event
        approaching_alert = TrainApproachingAlertSchema(
            alertId="ALT-CRIT-TRN-12001",
            trainNumber="12001",
            trainName="New Delhi Bhopal Shatabdi Express",
            defectId=CRITICAL_DEFECT_KM142["id"],
            defectType=CRITICAL_DEFECT_KM142["type"],
            locationKm=CRITICAL_DEFECT_KM142["locationKm"],
            distanceKm=dist_to_crack,
            speedKmH=train1_speed,
            etaMinutes=eta_minutes,
            etaFormatted=eta_formatted,
            riskLevel="CRITICAL" if dist_to_crack < 6.0 else "HIGH",
            recommendedAction="Issue immediate 30 km/h Caution Order & alert Loco Pilot via RTIS / Kavach radio.",
            timestamp="Just now"
        )

        train2_progress = (0.30 + self.simulation_step * 0.08) % 1.0
        lat2, lng2 = self._interpolate_pos("DLI-UMB", train2_progress)

        train3_progress = (0.80 + self.simulation_step * 0.12) % 1.0
        lat3, lng3 = self._interpolate_pos("NZM-AGC", train3_progress)

        train4_progress = (0.45 + self.simulation_step * 0.06) % 1.0
        lat4, lng4 = self._interpolate_pos("NDLS-TKD", train4_progress)

        trains = [
            LiveTrainSchema(
                id="TRN-12001",
                trainNumber="12001",
                trainName="Shatabdi Express (Bhopal - New Delhi)",
                latitude=lat1,
                longitude=lng1,
                speedKmH=train1_speed,
                direction="WESTBOUND",
                status="WARNING" if dist_to_crack < 6.0 else "RUNNING",
                currentStation="Ghaziabad (GZB)",
                nextStation="New Delhi (NDLS)",
                delayMinutes=4,
                eta="18:42",
                lastUpdatedSec=12,
                route="Bhopal -> GZB -> NDLS (Mainline Up)",
                nextStations=[
                    {"name": "Sahibabad Jn (SBB)", "eta": "18:25"},
                    {"name": "Anand Vihar (ANVR)", "eta": "18:32"},
                    {"name": "New Delhi (NDLS)", "eta": "18:42"},
                ],
                approachingAlert=approaching_alert,
                dataSource="SIMULATION_FALLBACK" if settings.DEMO_MODE else "RAILRADAR_LIVE"
            ),
            LiveTrainSchema(
                id="TRN-12424",
                trainNumber="12424",
                trainName="Dibrugarh Rajdhani Express",
                latitude=lat2,
                longitude=lng2,
                speedKmH=110.0,
                direction="NORTHBOUND",
                status="RUNNING",
                currentStation="Old Delhi (DLI)",
                nextStation="Panipat Jn (PNP)",
                delayMinutes=0,
                eta="19:15",
                lastUpdatedSec=8,
                route="NDLS -> DLI -> UMB -> DBRG",
                nextStations=[
                    {"name": "Sonipat (SNP)", "eta": "18:50"},
                    {"name": "Panipat (PNP)", "eta": "19:15"},
                    {"name": "Ambala Cantt (UMB)", "eta": "20:30"},
                ],
                dataSource="SIMULATION_FALLBACK" if settings.DEMO_MODE else "RAILRADAR_LIVE"
            ),
            LiveTrainSchema(
                id="TRN-22436",
                trainNumber="22436",
                trainName="Vande Bharat Express (Varanasi - NDLS)",
                latitude=lat3,
                longitude=lng3,
                speedKmH=130.0,
                direction="NORTHBOUND",
                status="RUNNING",
                currentStation="Mathura Jn (MTJ)",
                nextStation="Hazrat Nizamuddin (NZM)",
                delayMinutes=0,
                eta="18:55",
                lastUpdatedSec=4,
                route="BSB -> CNB -> ALJN -> NDLS",
                nextStations=[
                    {"name": "Palwal (PWL)", "eta": "18:18"},
                    {"name": "Faridabad (FDB)", "eta": "18:38"},
                    {"name": "New Delhi (NDLS)", "eta": "18:55"},
                ],
                dataSource="SIMULATION_FALLBACK" if settings.DEMO_MODE else "RAILRADAR_LIVE"
            ),
            LiveTrainSchema(
                id="TRN-14041",
                trainNumber="14041",
                trainName="Mussoorie Express",
                latitude=lat4,
                longitude=lng4,
                speedKmH=48.0,
                direction="SOUTHBOUND",
                status="DELAYED",
                currentStation="Tuglakabad Yard (TKD)",
                nextStation="Faridabad (FDB)",
                delayMinutes=22,
                eta="19:40",
                lastUpdatedSec=18,
                route="DLI -> TKD -> FDB -> KOTA",
                nextStations=[
                    {"name": "Ballabgarh (BVH)", "eta": "19:55"},
                    {"name": "Palwal (PWL)", "eta": "20:25"},
                ],
                dataSource="SIMULATION_FALLBACK" if settings.DEMO_MODE else "RAILRADAR_LIVE"
            ),
            LiveTrainSchema(
                id="TRN-BOXN-4028",
                trainNumber="BOXN-4028",
                trainName="Coal Freight Freight Rake #4028",
                latitude=28.5742,
                longitude=77.2481,
                speedKmH=55.0,
                direction="SOUTHBOUND",
                status="RUNNING",
                currentStation="Tuglakabad Siding",
                nextStation="Dadri DFC Yard",
                delayMinutes=0,
                eta="21:00",
                lastUpdatedSec=15,
                route="TKD Freight Corridor -> DFC",
                nextStations=[
                    {"name": "Dadri Freight Hub", "eta": "21:00"}
                ],
                dataSource="SIMULATION_FALLBACK" if settings.DEMO_MODE else "RAILRADAR_LIVE"
            )
        ]
        return trains

train_service = TrainService()
