import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List
from app.schemas.all_schemas import LiveTrainSchema, TrainApproachingAlertSchema
from app.services.train_service import train_service
from app.core.supabase import fetch_all, is_supabase_available

router = APIRouter(prefix="/trains", tags=["Live Train Tracking"])


def _row_to_train(row: dict) -> dict:
    """Map a Supabase trains row to LiveTrainSchema format."""
    approaching = row.get("approaching_alert")
    return {
        "id": row.get("id"),
        "trainNumber": row.get("train_number"),
        "trainName": row.get("train_name"),
        "latitude": row.get("latitude"),
        "longitude": row.get("longitude"),
        "speedKmH": row.get("speed_kmh", 0),
        "direction": row.get("direction", "NORTHBOUND"),
        "status": row.get("status", "RUNNING"),
        "currentStation": row.get("current_station", ""),
        "nextStation": row.get("next_station", ""),
        "delayMinutes": row.get("delay_minutes", 0),
        "eta": row.get("eta", ""),
        "lastUpdatedSec": row.get("last_updated_sec", 0),
        "route": row.get("route", ""),
        "nextStations": row.get("next_stations", []),
        "approachingAlert": approaching,
        "dataSource": row.get("data_source", "SUPABASE"),
    }


@router.get("/live", response_model=List[LiveTrainSchema])
async def get_live_trains():
    """Fetch live trains from Supabase; fallback to train_service simulation."""
    if is_supabase_available():
        rows = await fetch_all("trains", limit=100)
        if rows:
            return [_row_to_train(r) for r in rows]
    # Fallback to existing train service (RailRadar API + simulation)
    return await train_service.get_live_trains()


@router.get("/near-defects", response_model=List[TrainApproachingAlertSchema])
async def get_trains_near_defects():
    trains = await get_live_trains()
    alerts = []
    for t in trains:
        alert_data = t if isinstance(t, dict) else t.dict() if hasattr(t, 'dict') else t
        approaching = alert_data.get("approachingAlert") if isinstance(alert_data, dict) else getattr(t, 'approachingAlert', None)
        if approaching is not None:
            alerts.append(approaching)
    return alerts


@router.get("/{train_id}", response_model=LiveTrainSchema)
async def get_train_details(train_id: str):
    trains = await get_live_trains()
    for t in trains:
        t_data = t if isinstance(t, dict) else t.dict() if hasattr(t, 'dict') else t
        t_id = t_data.get("id", "") if isinstance(t_data, dict) else getattr(t, 'id', '')
        t_num = t_data.get("trainNumber", "") if isinstance(t_data, dict) else getattr(t, 'trainNumber', '')
        if t_id == train_id or t_num == train_id:
            return t
    if trains:
        return trains[0]
    return await train_service.get_live_trains()


@router.websocket("/ws")
async def websocket_train_stream(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            trains = await get_live_trains()
            data = []
            for t in trains:
                if isinstance(t, dict):
                    data.append(t)
                elif hasattr(t, 'dict'):
                    data.append(t.dict())
                else:
                    data.append(t)
            await websocket.send_json({"type": "TRAIN_UPDATE", "data": data})
            await asyncio.sleep(5)
    except WebSocketDisconnect:
        pass
    except Exception:
        await websocket.close()
