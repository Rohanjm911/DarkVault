from fastapi import APIRouter, HTTPException, Response
from app.schemas.report import AuditReportRequest
from app.services.pdf_report import generate_security_pdf

router = APIRouter(prefix="/reports", tags=["Security Reports"])


@router.post("/generate")
def create_pdf_report(report_data: AuditReportRequest):
    """
    Generates an executive-grade cybersecurity PDF audit report.
    Validates that the payload contains only anonymized metrics and zero plaintext credentials.
    """
    try:
        pdf_buffer = generate_security_pdf(report_data)
        filename = f"DarkVault-Security-Report-{int(report_data.entropy_bits)}bits.pdf"
        
        return Response(
            content=pdf_buffer.getvalue(),
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"',
                "X-Report-Entropy": str(report_data.entropy_bits),
                "X-Report-Score": str(report_data.strength_score),
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate PDF report: {str(e)}")

