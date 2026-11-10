from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging

from app.core.config import settings
from app.core.database import engine, Base
from app.api.endpoints import breach, reports, stats, health

# Ensure database tables exist
Base.metadata.create_all(bind=engine)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("darkvault")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="DarkVault - Your Password Security Command Center. Privacy-First, Zero-Knowledge Credential Security.",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition", "X-K-Anonymity-Prefix", "X-Cache-Status"],
)

# Security headers middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    # Strict privacy safeguard: ensure no plaintext password query param is ever received or logged
    if "password" in request.query_params or "pwd" in request.query_params:
        return JSONResponse(
            status_code=400,
            content={"error": "Security Violation: Plaintext password parameters are strictly prohibited."}
        )

    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Referrer-Policy"] = "no-referrer"
    return response

# Include Routers
app.include_router(health.router, prefix=settings.API_V1_STR)
app.include_router(breach.router, prefix=settings.API_V1_STR)
app.include_router(reports.router, prefix=settings.API_V1_STR)
app.include_router(stats.router, prefix=settings.API_V1_STR)


@app.get("/")
def root():
    return {
        "message": "DarkVault Security Command Center API",
        "version": settings.VERSION,
        "docs": "/docs",
        "tagline": "Your Password Security Command Center."
    }

