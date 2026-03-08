"""FastAPI Aadhar Enrollment CRUD Application."""
from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime

from app.config import settings
from app.database import engine, get_db, Base
from app.models import AadharEnrollment
from app.schemas import AadharEnrollmentCreate, AadharEnrollmentUpdate, AadharEnrollmentResponse, AadharEnrollmentList
import app.crud as crud

# Create tables
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title="Aadhar Enrollment System",
    version=settings.app_version,
    description="A CRUD API for Aadhar enrollment management built with FastAPI and SQLAlchemy"
)


@app.get("/", tags=["Root"])
def read_root():
    """Root endpoint."""
    return {
        "message": "Welcome to Aadhar Enrollment System API",
        "version": settings.app_version,
        "docs": "/docs",
        "openapi_schema": "/openapi.json"
    }


@app.get("/health", tags=["Health"])
def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


# ============= Aadhar Enrollment CRUD Endpoints =============

@app.post("/enrollments", response_model=AadharEnrollmentResponse, tags=["Enrollments"], status_code=201)
def create_enrollment(enrollment: AadharEnrollmentCreate, db: Session = Depends(get_db)):
    """
    Create a new Aadhar enrollment.
    
    - **uid** (required): Unique Aadhar ID
    - **full_name** (required): Full name of applicant
    - **date_of_birth** (required): Date of birth
    - **gender** (required): Gender (Male, Female, Other)
    - **mobile_number** (required): 10-15 digit mobile number
    - **address** (required): Residential address
    - **pincode** (required): Postal code
    - **state** (required): State name
    - **city** (required): City name
    - **email**: Optional email address
    - **enrollment_center**: Optional enrollment center location
    """
    # Check if UID already exists
    existing = crud.get_enrollment_by_uid(db=db, uid=enrollment.uid)
    if existing:
        raise HTTPException(status_code=400, detail="Aadhar UID already exists")
    
    return crud.create_enrollment(db=db, enrollment=enrollment)


@app.get("/enrollments", response_model=AadharEnrollmentList, tags=["Enrollments"])
def read_enrollments(
    skip: int = Query(0, ge=0, description="Number of enrollments to skip"),
    limit: int = Query(10, ge=1, le=100, description="Maximum enrollments to return"),
    status: str = Query(None, description="Filter by status (pending, verified, issued, rejected)"),
    db: Session = Depends(get_db)
):
    """
    Get all enrollments with optional filtering.
    
    - **skip**: Number of enrollments to skip (default: 0)
    - **limit**: Maximum enrollments to return (default: 10, max: 100)
    - **status**: Optional status filter
    """
    if status:
        enrollments = crud.get_enrollments_by_status(db=db, status=status, skip=skip, limit=limit)
    else:
        enrollments = crud.get_enrollments(db=db, skip=skip, limit=limit)
    
    total = crud.get_enrollments_count(db=db)
    return AadharEnrollmentList(total=total, enrollments=enrollments)


@app.get("/enrollments/{enrollment_id}", response_model=AadharEnrollmentResponse, tags=["Enrollments"])
def read_enrollment(enrollment_id: int, db: Session = Depends(get_db)):
    """
    Get a specific enrollment by ID.
    
    - **enrollment_id**: The ID of the enrollment to retrieve
    """
    db_enrollment = crud.get_enrollment(db=db, enrollment_id=enrollment_id)
    if not db_enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    return db_enrollment


@app.get("/enrollments/uid/{uid}", response_model=AadharEnrollmentResponse, tags=["Enrollments"])
def read_enrollment_by_uid(uid: str, db: Session = Depends(get_db)):
    """
    Get enrollment by Aadhar UID.
    
    - **uid**: The Aadhar UID
    """
    db_enrollment = crud.get_enrollment_by_uid(db=db, uid=uid)
    if not db_enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    return db_enrollment


@app.put("/enrollments/{enrollment_id}", response_model=AadharEnrollmentResponse, tags=["Enrollments"])
def update_enrollment(
    enrollment_id: int,
    enrollment_update: AadharEnrollmentUpdate,
    db: Session = Depends(get_db)
):
    """
    Update an existing enrollment.
    
    - **enrollment_id**: The ID of the enrollment to update
    - All other fields are optional
    """
    db_enrollment = crud.update_enrollment(db=db, enrollment_id=enrollment_id, enrollment_update=enrollment_update)
    if not db_enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    return db_enrollment


@app.patch("/enrollments/{enrollment_id}/verify", response_model=AadharEnrollmentResponse, tags=["Enrollments"])
def verify_enrollment(enrollment_id: int, db: Session = Depends(get_db)):
    """
    Verify an enrollment (mark as verified).
    
    - **enrollment_id**: The ID of the enrollment to verify
    """
    db_enrollment = crud.get_enrollment(db=db, enrollment_id=enrollment_id)
    if not db_enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    
    update_data = AadharEnrollmentUpdate(
        status="verified",
        document_verified=True,
        verification_date=datetime.utcnow()
    )
    return crud.update_enrollment(db=db, enrollment_id=enrollment_id, enrollment_update=update_data)


@app.patch("/enrollments/{enrollment_id}/capture-biometric", response_model=AadharEnrollmentResponse, tags=["Enrollments"])
def capture_biometric(enrollment_id: int, db: Session = Depends(get_db)):
    """
    Mark biometric as captured for an enrollment.
    
    - **enrollment_id**: The ID of the enrollment
    """
    db_enrollment = crud.get_enrollment(db=db, enrollment_id=enrollment_id)
    if not db_enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    
    update_data = AadharEnrollmentUpdate(biometric_captured=True)
    return crud.update_enrollment(db=db, enrollment_id=enrollment_id, enrollment_update=update_data)


@app.patch("/enrollments/{enrollment_id}/reject", response_model=AadharEnrollmentResponse, tags=["Enrollments"])
def reject_enrollment(
    enrollment_id: int,
    rejection_reason: str = Query(..., description="Reason for rejection"),
    db: Session = Depends(get_db)
):
    """
    Reject an enrollment.
    
    - **enrollment_id**: The ID of the enrollment to reject
    - **rejection_reason**: Reason for rejection
    """
    db_enrollment = crud.get_enrollment(db=db, enrollment_id=enrollment_id)
    if not db_enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    
    update_data = AadharEnrollmentUpdate(
        status="rejected",
        rejection_reason=rejection_reason
    )
    return crud.update_enrollment(db=db, enrollment_id=enrollment_id, enrollment_update=update_data)


@app.delete("/enrollments/{enrollment_id}", tags=["Enrollments"])
def delete_enrollment(enrollment_id: int, db: Session = Depends(get_db)):
    """
    Delete an enrollment.
    
    - **enrollment_id**: The ID of the enrollment to delete
    """
    success = crud.delete_enrollment(db=db, enrollment_id=enrollment_id)
    if not success:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    return {"message": f"Enrollment {enrollment_id} deleted successfully"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
