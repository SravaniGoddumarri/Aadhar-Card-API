"""Pydantic schemas for request/response validation."""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, date


class AadharEnrollmentBase(BaseModel):
    """Base schema for Aadhar Enrollment."""
    
    uid: str = Field(..., min_length=1, max_length=20, description="Unique Aadhar ID")
    full_name: str = Field(..., min_length=1, max_length=255, description="Full name of applicant")
    date_of_birth: date = Field(..., description="Date of birth")
    gender: str = Field(..., description="Gender (Male, Female, Other)")
    email: Optional[str] = Field(None, description="Email address")
    mobile_number: str = Field(..., min_length=10, max_length=15, description="Mobile number")
    address: str = Field(..., min_length=5, description="Residential address")
    pincode: str = Field(..., min_length=6, max_length=10, description="Postal code")
    state: str = Field(..., min_length=2, description="State name")
    city: str = Field(..., min_length=2, description="City name")
    enrollment_center: Optional[str] = Field(None, description="Enrollment center location")


class AadharEnrollmentCreate(AadharEnrollmentBase):
    """Schema for creating a new enrollment."""
    pass


class AadharEnrollmentUpdate(BaseModel):
    """Schema for updating an enrollment."""
    
    full_name: Optional[str] = Field(None, min_length=1, max_length=255)
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    email: Optional[str] = None
    mobile_number: Optional[str] = None
    address: Optional[str] = None
    pincode: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None
    enrollment_center: Optional[str] = None
    status: Optional[str] = Field(None, description="Enrollment status")
    biometric_captured: Optional[bool] = None
    document_verified: Optional[bool] = None
    rejection_reason: Optional[str] = None
    verification_date: Optional[datetime] = None


class AadharEnrollmentResponse(AadharEnrollmentBase):
    """Schema for enrollment response."""
    
    id: int
    status: str
    biometric_captured: bool
    document_verified: bool
    rejection_reason: Optional[str]
    enrollment_date: datetime
    verification_date: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True


class AadharEnrollmentList(BaseModel):
    """Schema for list of enrollments response."""
    
    total: int
    enrollments: List[AadharEnrollmentResponse]
