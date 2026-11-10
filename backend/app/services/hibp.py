import httpx
import time
from typing import Dict, Tuple
from app.core.config import settings

# In-memory LRU/TTL cache for k-anonymity prefix results: prefix -> (timestamp, data_string)
_cache: Dict[str, Tuple[float, str]] = {}
CACHE_TTL_SECONDS = 3600  # 1 hour cache to avoid unnecessary calls to HIBP


async def fetch_pwned_range(prefix: str) -> Tuple[str, bool]:
    """
    Queries HIBP k-anonymity API using the 5-character SHA-1 prefix.
    Returns: (raw_data_string, is_cached)
    Zero knowledge: Backend only sees the 5-char prefix, never the suffix or plaintext!
    """
    prefix = prefix.upper().strip()
    
    # Check cache
    now = time.time()
    if prefix in _cache:
        cached_time, cached_data = _cache[prefix]
        if now - cached_time < CACHE_TTL_SECONDS:
            return cached_data, True

    url = f"{settings.HIBP_API_URL}/{prefix}"
    headers = {
        "User-Agent": settings.HIBP_USER_AGENT,
        "Add-Padding": "true"  # Requests random padding from HIBP to prevent traffic analysis attacks!
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            response = await client.get(url, headers=headers)
            response.raise_for_status()
            data = response.text
            # Store in cache
            _cache[prefix] = (now, data)
            return data, False
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 429:
                raise RuntimeError("Have I Been Pwned API rate limit exceeded. Please try again shortly.")
            raise RuntimeError(f"HIBP API error: {e.response.status_code}")
        except Exception as e:
            raise RuntimeError(f"Failed to connect to HIBP service: {str(e)}")

