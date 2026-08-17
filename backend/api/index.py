"""
Vercel Serverless Function Entry Point for RailRakshak AI Backend.

This file exposes the FastAPI app as a Vercel-compatible serverless function.
Vercel's Python runtime will invoke the `app` ASGI handler.
"""
from app.main import app

# Vercel expects an 'app' (or 'handler') variable at module level
# FastAPI is ASGI-compatible, which Vercel's Python runtime supports natively
