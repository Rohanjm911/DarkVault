from pydantic import BaseModel, Field, field_validator
import re


class HIBPRangeRequest(BaseModel):
    """
    K-Anonymity SHA-1 prefix request.
    Strictly accepts EXACTLY 5 hexadecimal characters.
    Never accepts plaintext or full hash.
    """
    prefix: str = Field(..., min_length=5, max_length=5, description="5-character hexadecimal SHA-1 prefix")

    @field_validator("prefix")
    def validate_hex_prefix(cls, v: str) -> str:
        clean = v.strip().upper()
        if not re.match(r"^[0-9A-F]{5}$", clean):
            raise ValueError("Prefix must be exactly 5 hexadecimal characters.")
        return clean


class HIBPRangeResponse(BaseModel):
    prefix: str
    suffixes_count: int
    data: str  # CRLF-delimited suffix:count pairs returned by HIBP
    cached: bool = False

