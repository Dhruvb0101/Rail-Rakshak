"""
Seed script to populate RailRakshak AI Supabase tables with initial demo data.

Usage:
    cd backend
    python scripts/seed_supabase.py
"""
import os
import sys

# Add project root to path so we can import app modules
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

from supabase import create_client

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY") or os.getenv("SUPABASE_ANON_KEY", "")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("ERROR: SUPABASE_URL and SUPABASE_SERVICE_KEY (or SUPABASE_ANON_KEY) must be set in .env")
    sys.exit(1)

client = create_client(SUPABASE_URL, SUPABASE_KEY)
print(f"Connected to Supabase at {SUPABASE_URL}")


# ──────────── SEED DATA ────────────

ALERTS_DATA = [
    {
        "id": "ALT-1001",
        "alert_code": "ALT-CRIT-001",
        "title": "Severe Rail Fracture Detected (KM 142.6)",
        "severity": "critical",
        "track_section": "New Delhi – Ghaziabad Mainline Up",
        "location_km": 142.6,
        "detection_source": "Computer Vision IR + Acoustic Telemetry",
        "ai_confidence": 96.8,
        "status": "active",
        "assigned_engineer": "Er. Rajesh Sharma (SE/P-Way)",
    },
    {
        "id": "ALT-1002",
        "alert_code": "ALT-CRIT-002",
        "title": "High Rail Temperature Exceeded 58°C (Buckling Risk)",
        "severity": "critical",
        "track_section": "Old Delhi – Ambala Route",
        "location_km": 34.8,
        "detection_source": "Fiber Optic DTS Sensor #DTS-09",
        "ai_confidence": 99.1,
        "status": "active",
        "assigned_engineer": "Control Room Duty Officer",
    },
    {
        "id": "ALT-1003",
        "alert_code": "ALT-HIGH-003",
        "title": "Gauge Widening Detected (KM 87.3)",
        "severity": "high",
        "track_section": "Tughlakabad – Faridabad Section",
        "location_km": 87.3,
        "detection_source": "Track Geometry Car + LIDAR",
        "ai_confidence": 91.2,
        "status": "active",
        "assigned_engineer": "Er. Priya Mehra (JE/P-Way)",
    },
    {
        "id": "ALT-1004",
        "alert_code": "ALT-MED-004",
        "title": "Ballast Erosion Near Bridge #47",
        "severity": "medium",
        "track_section": "Sonipat – Panipat Section",
        "location_km": 210.5,
        "detection_source": "Drone Surveillance + AI Analysis",
        "ai_confidence": 88.4,
        "status": "acknowledged",
        "assigned_engineer": "Er. Vikram Singh (SSE/Bridge)",
    },
]

DETECTIONS_DATA = [
    {
        "id": "DET-2026-0892",
        "detection_code": "#TF-8992",
        "defect_type": "Transverse Rail Fracture Crack",
        "severity": "critical",
        "confidence": 96.8,
        "track_section_id": "SEC-NDLS-GZB-01",
        "track_section_name": "New Delhi – Ghaziabad Mainline Up",
        "location_km": 142.6,
        "coordinates": {"lat": 28.6554, "lng": 77.2912},
        "segment_code": "NDLS-S1A",
        "camera_ref": "Cam-04 (High-Res IR)",
        "line_speed_kmh": 85.0,
        "ambient_temp_c": 34.0,
        "estimated_depth_mm": 14.0,
        "reasoning_factors": [
            {"title": "Pattern match: Transverse Fissure (TF)", "description": "Deep neural feature match", "category": "model_match", "confidenceWeightPct": 98.2},
            {"title": "Growth detected from previous scan", "description": "+2.4mm expansion detected", "category": "trend", "confidenceWeightPct": 94.0},
        ],
        "recommended_action": "Immediate manual inspection required. Speed restriction of 30 km/h recommended.",
        "status": "pending_verification",
        "assigned_engineer": "Er. Rajesh Sharma (SE/P-Way)",
        "notes": "AI-assisted defect detection logged.",
    },
    {
        "id": "DET-2026-0893",
        "detection_code": "#GW-4410",
        "defect_type": "Gauge Widening",
        "severity": "high",
        "confidence": 91.2,
        "track_section_id": "SEC-TKD-FDB-02",
        "track_section_name": "Tughlakabad – Faridabad Section",
        "location_km": 87.3,
        "coordinates": {"lat": 28.4800, "lng": 77.2950},
        "segment_code": "TKD-S2B",
        "camera_ref": "Track Geometry Car",
        "line_speed_kmh": 110.0,
        "ambient_temp_c": 38.0,
        "estimated_depth_mm": None,
        "reasoning_factors": [
            {"title": "Gauge deviation exceeds 10mm threshold", "description": "Measured gauge: 1686mm vs standard 1676mm", "category": "measurement", "confidenceWeightPct": 91.2},
        ],
        "recommended_action": "Schedule tamping and packing within 48 hours.",
        "status": "confirmed",
        "assigned_engineer": "Er. Priya Mehra (JE/P-Way)",
        "notes": "Gauge widening confirmed by Track Geometry Car.",
    },
]

TRAINS_DATA = [
    {
        "id": "TRN-001",
        "train_number": "12002",
        "train_name": "New Delhi Shatabdi Express",
        "latitude": 28.6550,
        "longitude": 77.2900,
        "speed_kmh": 130,
        "direction": "NORTHBOUND",
        "status": "RUNNING",
        "current_station": "New Delhi",
        "next_station": "Ghaziabad Jn",
        "delay_minutes": 0,
        "eta": "12:45 PM",
        "last_updated_sec": 15,
        "route": "NDLS – LKO via GZB",
        "next_stations": [{"name": "Ghaziabad Jn", "eta": "12:45 PM"}, {"name": "Moradabad", "eta": "2:10 PM"}],
        "data_source": "SUPABASE",
    },
    {
        "id": "TRN-002",
        "train_number": "12952",
        "train_name": "Mumbai Rajdhani Express",
        "latitude": 28.5880,
        "longitude": 77.2530,
        "speed_kmh": 85,
        "direction": "SOUTHBOUND",
        "status": "DELAYED",
        "current_station": "Hazrat Nizamuddin",
        "next_station": "Mathura Jn",
        "delay_minutes": 22,
        "eta": "1:30 PM",
        "last_updated_sec": 8,
        "route": "NDLS – MMCT via Kota",
        "next_stations": [{"name": "Mathura Jn", "eta": "1:30 PM"}, {"name": "Kota Jn", "eta": "4:45 PM"}],
        "data_source": "SUPABASE",
    },
    {
        "id": "TRN-003",
        "train_number": "14042",
        "train_name": "Mussoorie Express",
        "latitude": 28.6700,
        "longitude": 77.4200,
        "speed_kmh": 72,
        "direction": "NORTHBOUND",
        "status": "RUNNING",
        "current_station": "Ghaziabad Jn",
        "next_station": "Meerut Cantt",
        "delay_minutes": 5,
        "eta": "2:00 PM",
        "last_updated_sec": 30,
        "route": "DLI – DDN via Meerut",
        "next_stations": [{"name": "Meerut Cantt", "eta": "2:00 PM"}, {"name": "Roorkee", "eta": "3:45 PM"}],
        "data_source": "SUPABASE",
    },
    {
        "id": "TRN-004",
        "train_number": "12622",
        "train_name": "Tamil Nadu SF Express",
        "latitude": 28.6400,
        "longitude": 77.2200,
        "speed_kmh": 60,
        "direction": "SOUTHBOUND",
        "status": "WARNING",
        "current_station": "New Delhi",
        "next_station": "Hazrat Nizamuddin",
        "delay_minutes": 45,
        "eta": "3:15 PM",
        "last_updated_sec": 12,
        "route": "NDLS – MAS via AGC",
        "next_stations": [{"name": "Hazrat Nizamuddin", "eta": "3:15 PM"}, {"name": "Agra Cantt", "eta": "5:30 PM"}],
        "approaching_alert": {
            "alertId": "ALT-1001",
            "trainNumber": "12622",
            "trainName": "Tamil Nadu SF Express",
            "defectId": "DET-2026-0892",
            "defectType": "Transverse Rail Fracture Crack",
            "locationKm": "KM 142.6",
            "distanceKm": 2.4,
            "speedKmH": 60,
            "etaMinutes": 2.4,
            "etaFormatted": "~2 min 24 sec",
            "riskLevel": "CRITICAL",
            "recommendedAction": "Emergency speed restriction to 30 km/h",
            "timestamp": "2026-08-17T11:00:00Z",
        },
        "data_source": "SUPABASE",
    },
]

WEATHER_DATA = [
    {
        "city": "New Delhi",
        "division": "Delhi Division",
        "temperature_c": 34.2,
        "feels_like_c": 38.5,
        "humidity_pct": 78,
        "wind_speed_kmh": 18.5,
        "wind_direction_deg": 210,
        "rainfall_mm_1h": 12.4,
        "visibility_km": 4.2,
        "pressure_hpa": 1004,
        "condition": "Heavy Rain",
        "condition_icon": "🌧️",
        "weather_risk_score": 68,
        "weather_risk_level": "HIGH",
        "drainage_risk": "HIGH",
        "buckling_risk": "MODERATE",
        "catenary_risk": "MODERATE",
        "visibility_risk": "REDUCED",
        "track_impact_summary": "Heavy monsoon rain raising waterlogging risk in low-lying sections KM 140–155.",
        "data_source": "SUPABASE",
    },
]

KPI_DATA = [
    {
        "track_network_km": 4280.0,
        "track_network_change_km": 12.0,
        "track_health_pct": 94.8,
        "track_health_status": "STABLE",
        "active_alerts_count": 17,
        "critical_alerts_count": 3,
        "ai_detections_today": 1284,
        "ai_detections_cap_pct": 85,
        "maintenance_due_count": 42,
        "open_inspections_count": 8,
        "live_trains_count": 47,
        "running_trains_count": 39,
        "delayed_trains_count": 6,
        "weather_condition": "Heavy Rain",
        "weather_risk_score": 68,
    },
]


def seed_table(table_name: str, data: list):
    """Upsert data into a table."""
    print(f"  Seeding {table_name} with {len(data)} records...")
    try:
        response = client.table(table_name).upsert(data).execute()
        print(f"  ✓ {table_name}: {len(response.data)} rows upserted.")
    except Exception as e:
        print(f"  ✗ {table_name}: {e}")


def main():
    print("\n🚂 RailRakshak AI — Supabase Database Seeding\n")

    seed_table("alerts", ALERTS_DATA)
    seed_table("detections", DETECTIONS_DATA)
    seed_table("trains", TRAINS_DATA)
    seed_table("weather_reports", WEATHER_DATA)
    seed_table("kpis", KPI_DATA)

    print("\n✅ Seeding complete!\n")


if __name__ == "__main__":
    main()
