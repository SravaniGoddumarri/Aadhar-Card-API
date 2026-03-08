"""SQLAlchemy database models."""
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, Date
from datetime import datetime
from app.database import Base


class AadharEnrollment(Base):
    """Aadhar Enrollment model for CRUD operations."""
    
    __tablename__ = "aadhar_enrollments"
    
    id = Column(Integer, primary_key=True, index=True)
    uid = Column(String(20), unique=True, nullable=False, index=True)  # Unique Aadhar ID
    full_name = Column(String(255), nullable=False, index=True)
    date_of_birth = Column(Date, nullable=False)
    gender = Column(String(10), nullable=False)  # Male, Female, Other
    email = Column(String(120), unique=True, nullable=True, index=True)
    mobile_number = Column(String(15), unique=True, nullable=False, index=True)
    address = Column(Text, nullable=False)
    pincode = Column(String(10), nullable=False)
    state = Column(String(50), nullable=False)
    city = Column(String(50), nullable=False)
    enrollment_center = Column(String(100), nullable=True)
    enrollment_date = Column(DateTime, default=datetime.utcnow, nullable=False)
    verification_date = Column(DateTime, nullable=True)
    status = Column(String(20), default="pending", nullable=False)  # pending, verified, issued, rejected
    biometric_captured = Column(Boolean, default=False)
    document_verified = Column(Boolean, default=False)
    rejection_reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f"<AadharEnrollment(uid='{self.uid}', name='{self.full_name}', status='{self.status}')>"
