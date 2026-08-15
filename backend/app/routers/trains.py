import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List
from app.schemas.all_schemas import LiveTrainSchema, TrainApproachingAlertSchema
from app.services.train_service import train_service

router = APIRouter(prefix="/trains", tags=["Live Train Tracking"])

@router.get("/live", response_model=List[LiveTrainSchema])
async def get_live_trains():
    return await train_service.get_live_trains()

@router.get("/near-defects", response_model=List[TrainApproachingAlertSchema])
async def get_trains_near_defects():
    trains = await train_service.get_live_trains()
    alerts = [t.approachingAlert for t in trains if t.approachingAlert is not None]
    return alerts

@router.get("/{train_id}", response_model=LiveTrainSchema)
async def get_train_details(train_id: str):
    trains = await train_service.get_live_trains()
    for t in trains:
        if t.id == train_id or t.trainNumber == train_id:
            return t
    return trains[0]

@router.websocket("/ws")
async def websocket_train_stream(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            trains = await train_service.get_live_trains()
            data = [t.dict() for t in trains]
            await websocket.send_json({"type": "TRAIN_UPDATE", "data": data})
            await asyncio.sleep(5)
    except WebSocketDisconnect:
        pass
    except Exception:
        await websocket.close()
