from fastapi import APIRouter, HTTPException, Path, Response
from app.services.hibp import fetch_pwned_range
import re

router = APIRouter(prefix="/breach", tags=["Breach Checker"])


@router.get("/range/{prefix}")
async def get_pwned_range(
    prefix: str = Path(..., min_length=5, max_length=5, description="5-character hexadecimal SHA-1 prefix")
):
    """
    K-Anonymity HIBP proxy endpoint.
    Strictly accepts only the first 5 hexadecimal characters of a SHA-1 hash.
    ZERO PLAINTEXT: The server never receives the user's password or full hash.
    Returns the raw CRLF list of hash suffixes and counts.
    """
    clean_prefix = prefix.strip().upper()
    if not re.match(r"^[0-9A-F]{5}$", clean_prefix):
        raise HTTPException(
            status_code=400,
            detail="Invalid prefix format. Must be exactly 5 hexadecimal characters (0-9, A-F)."
        )

    try:
        data, is_cached = await fetch_pwned_range(clean_prefix)
        # Return plain text response just like HIBP API does
        return Response(
            content=data,
            media_type="text/plain",
            headers={
                "X-K-Anonymity-Prefix": clean_prefix,
                "X-Cache-Status": "HIT" if is_cached else "MISS",
                "Cache-Control": "public, max-age=3600",
            }
        )
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error querying breach database: {str(e)}")

