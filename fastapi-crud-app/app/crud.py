"""CRUD operations for Aadhar Enrollment model."""
from typing import Optional, List
from sqlalchemy.orm import Session
from app.models import AadharEnrollment
from app.schemas import AadharEnrollmentCreate, AadharEnrollmentUpdate


def get_enrollment(db: Session, enrollment_id: int) -> Optional[AadharEnrollment]:
    """Get a single enrollment by ID."""
    return db.query(AadharEnrollment).filter(AadharEnrollment.id == enrollment_id).first()


def get_enrollment_by_uid(db: Session, uid: str) -> Optional[AadharEnrollment]:
    """Get enrollment by Aadhar UID."""
    return db.query(AadharEnrollment).filter(AadharEnrollment.uid == uid).first()


def get_enrollments(db: Session, skip: int = 0, limit: int = 10) -> List[AadharEnrollment]:
    """Get all enrollments with pagination."""
    return db.query(AadharEnrollment).offset(skip).limit(limit).all()


def get_enrollments_by_status(db: Session, status: str, skip: int = 0, limit: int = 10) -> List[AadharEnrollment]:
    """Get enrollments by status."""
    return db.query(AadharEnrollment).filter(AadharEnrollment.status == status).offset(skip).limit(limit).all()


def get_enrollments_count(db: Session) -> int:
    """Get total count of enrollments."""
    return db.query(AadharEnrollment).count()


def create_enrollment(db: Session, enrollment: AadharEnrollmentCreate) -> AadharEnrollment:
    """Create a new enrollment."""
    db_enrollment = AadharEnrollment(
        uid=enrollment.uid,
        full_name=enrollment.full_name,
        date_of_birth=enrollment.date_of_birth,
        gender=enrollment.gender,
        email=enrollment.email,
        mobile_number=enrollment.mobile_number,
        address=enrollment.address,
        pincode=enrollment.pincode,
        state=enrollment.state,
        city=enrollment.city,
        enrollment_center=enrollment.enrollment_center
    )
    db.add(db_enrollment)
    db.commit()
    db.refresh(db_enrollment)
    return db_enrollment


def update_enrollment(db: Session, enrollment_id: int, enrollment_update: AadharEnrollmentUpdate) -> Optional[AadharEnrollment]:
    """Update an existing enrollment."""
    db_enrollment = db.query(AadharEnrollment).filter(AadharEnrollment.id == enrollment_id).first()
    if not db_enrollment:
        return None
    
    update_data = enrollment_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_enrollment, field, value)
    
    db.add(db_enrollment)
    db.commit()
    db.refresh(db_enrollment)
    return db_enrollment


def delete_enrollment(db: Session, enrollment_id: int) -> bool:
    """Delete an enrollment."""
    db_enrollment = db.query(AadharEnrollment).filter(AadharEnrollment.id == enrollment_id).first()
    if not db_enrollment:
        return False
    
    db.delete(db_enrollment)
    db.commit()
    return True
