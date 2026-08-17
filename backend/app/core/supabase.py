"""
Supabase Client Module for RailRakshak AI Backend.

Provides a singleton Supabase client with helper CRUD functions.
Gracefully falls back to None if Supabase is not configured.
"""
import logging
from typing import Optional, Any
from app.core.config import settings

logger = logging.getLogger(__name__)

_supabase_client = None
_initialized = False


def get_supabase_client():
    """
    Returns the Supabase client singleton.
    Returns None if Supabase is not configured (missing URL or key).
    """
    global _supabase_client, _initialized

    if _initialized:
        return _supabase_client

    _initialized = True

    if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
        logger.warning("Supabase URL or Key not configured. Running in demo/fallback mode.")
        return None

    try:
        from supabase import create_client, Client
        key = settings.SUPABASE_SERVICE_KEY or settings.SUPABASE_KEY
        _supabase_client: Client = create_client(settings.SUPABASE_URL, key)
        logger.info(f"Supabase client connected to {settings.SUPABASE_URL}")
    except Exception as e:
        logger.error(f"Failed to initialize Supabase client: {e}")
        _supabase_client = None

    return _supabase_client


def is_supabase_available() -> bool:
    """Check if Supabase client is initialized and usable."""
    return get_supabase_client() is not None


async def fetch_all(table: str, order_by: Optional[str] = None, limit: int = 100) -> list[dict]:
    """
    Fetch all rows from a Supabase table.
    Returns empty list on failure.
    """
    client = get_supabase_client()
    if not client:
        return []

    try:
        query = client.table(table).select("*").limit(limit)
        if order_by:
            query = query.order(order_by, desc=True)
        response = query.execute()
        return response.data or []
    except Exception as e:
        logger.error(f"Supabase fetch_all error on '{table}': {e}")
        return []


async def fetch_by_id(table: str, id_column: str, id_value: str) -> Optional[dict]:
    """Fetch a single row by ID column."""
    client = get_supabase_client()
    if not client:
        return None

    try:
        response = client.table(table).select("*").eq(id_column, id_value).limit(1).execute()
        if response.data:
            return response.data[0]
        return None
    except Exception as e:
        logger.error(f"Supabase fetch_by_id error on '{table}': {e}")
        return None


async def insert_record(table: str, data: dict) -> Optional[dict]:
    """Insert a single record into a table. Returns the inserted row."""
    client = get_supabase_client()
    if not client:
        return None

    try:
        response = client.table(table).insert(data).execute()
        if response.data:
            return response.data[0]
        return None
    except Exception as e:
        logger.error(f"Supabase insert error on '{table}': {e}")
        return None


async def update_record(table: str, id_column: str, id_value: str, data: dict) -> Optional[dict]:
    """Update a record by ID. Returns the updated row."""
    client = get_supabase_client()
    if not client:
        return None

    try:
        response = client.table(table).update(data).eq(id_column, id_value).execute()
        if response.data:
            return response.data[0]
        return None
    except Exception as e:
        logger.error(f"Supabase update error on '{table}': {e}")
        return None


async def upsert_record(table: str, data: dict) -> Optional[dict]:
    """Upsert a record (insert or update on conflict)."""
    client = get_supabase_client()
    if not client:
        return None

    try:
        response = client.table(table).upsert(data).execute()
        if response.data:
            return response.data[0]
        return None
    except Exception as e:
        logger.error(f"Supabase upsert error on '{table}': {e}")
        return None
