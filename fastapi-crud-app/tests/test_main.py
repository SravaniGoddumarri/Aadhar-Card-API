"""Test cases for Aadhar Enrollment CRUD application."""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime, date

from app.main import app
from app.database import Base, get_db
from app.models import AadharEnrollment

# Use in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)


def override_get_db():
    """Override database dependency for testing."""
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


class TestRootEndpoint:
    """Test root endpoint."""

    def test_read_root(self):
        """Test GET /"""
        response = client.get("/")
        assert response.status_code == 200
        assert "message" in response.json()
        assert "Aadhar" in response.json()["message"]

    def test_health_check(self):
        """Test GET /health"""
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"


class TestCreateEnrollment:
    """Test enrollment creation endpoint."""

    def test_create_enrollment(self):
        """Test creating a new enrollment."""
        response = client.post(
            "/enrollments",
            json={
                "uid": "AAA123456789012345",
                "full_name": "John Doe",
                "date_of_birth": "1990-05-15",
                "gender": "Male",
                "mobile_number": "9876543210",
                "address": "123 Main Street",
                "pincode": "110001",
                "state": "Delhi",
                "city": "New Delhi",
                "email": "john@example.com"
            }
        )
        assert response.status_code == 201
        data = response.json()
        assert data["uid"] == "AAA123456789012345"
        assert data["full_name"] == "John Doe"
        assert data["status"] == "pending"
        assert data["biometric_captured"] is False
        assert "id" in data

    def test_create_enrollment_minimal(self):
        """Test creating enrollment with minimal fields."""
        response = client.post(
            "/enrollments",
            json={
                "uid": "BBB987654321098765",
                "full_name": "Jane Smith",
                "date_of_birth": "1985-03-20",
                "gender": "Female",
                "mobile_number": "9876543211",
                "address": "456 Oak Avenue",
                "pincode": "560001",
                "state": "Karnataka",
                "city": "Bangalore"
            }
        )
        assert response.status_code == 201
        data = response.json()
        assert data["uid"] == "BBB987654321098765"

    def test_create_enrollment_duplicate_uid(self):
        """Test creating enrollment with duplicate UID."""
        enrollment_data = {
            "uid": "CCC111111111111111",
            "full_name": "Alice Johnson",
            "date_of_birth": "1992-07-10",
            "gender": "Female",
            "mobile_number": "9876543212",
            "address": "789 Pine Road",
            "pincode": "400001",
            "state": "Maharashtra",
            "city": "Mumbai"
        }
        
        # Create first enrollment
        response1 = client.post("/enrollments", json=enrollment_data)
        assert response1.status_code == 201
        
        # Try to create duplicate
        response2 = client.post("/enrollments", json=enrollment_data)
        assert response2.status_code == 400
        assert "already exists" in response2.json()["detail"]

    def test_create_enrollment_missing_required_field(self):
        """Test creating enrollment without required field."""
        response = client.post(
            "/enrollments",
            json={
                "full_name": "Bob Wilson",
                "date_of_birth": "1988-12-25"
            }
        )
        assert response.status_code == 422  # Validation error


class TestReadEnrollments:
    """Test reading enrollments endpoints."""

    def setup_method(self):
        """Setup test data."""
        # Clear database
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)

        # Create test enrollments
        db = TestingSessionLocal()
        enrollments = [
            AadharEnrollment(
                uid="DDD111111111111111",
                full_name="Enrollment 1",
                date_of_birth=date(1990, 1, 1),
                gender="Male",
                mobile_number="9111111111",
                address="Address 1",
                pincode="100001",
                state="Delhi",
                city="New Delhi",
                status="pending"
            ),
            AadharEnrollment(
                uid="EEE222222222222222",
                full_name="Enrollment 2",
                date_of_birth=date(1991, 2, 2),
                gender="Female",
                mobile_number="9222222222",
                address="Address 2",
                pincode="200001",
                state="UP",
                city="Lucknow",
                status="verified"
            ),
            AadharEnrollment(
                uid="FFF333333333333333",
                full_name="Enrollment 3",
                date_of_birth=date(1992, 3, 3),
                gender="Male",
                mobile_number="9333333333",
                address="Address 3",
                pincode="300001",
                state="MP",
                city="Indore",
                status="pending"
            ),
        ]
        for enrollment in enrollments:
            db.add(enrollment)
        db.commit()
        db.close()

    def test_read_enrollments(self):
        """Test getting all enrollments."""
        response = client.get("/enrollments")
        assert response.status_code == 200
        data = response.json()
        assert "total" in data
        assert "enrollments" in data
        assert data["total"] == 3
        assert len(data["enrollments"]) == 3

    def test_read_enrollments_pagination(self):
        """Test enrollments pagination."""
        response = client.get("/enrollments?skip=1&limit=2")
        assert response.status_code == 200
        data = response.json()
        assert len(data["enrollments"]) == 2

    def test_read_enrollments_by_status(self):
        """Test filtering enrollments by status."""
        response = client.get("/enrollments?status=pending&limit=10")
        assert response.status_code == 200
        data = response.json()
        assert all(e["status"] == "pending" for e in data["enrollments"])

    def test_read_enrollment(self):
        """Test getting a single enrollment."""
        # First create an enrollment
        create_response = client.post(
            "/enrollments",
            json={
                "uid": "GGG444444444444444",
                "full_name": "Test User",
                "date_of_birth": "1995-06-15",
                "gender": "Male",
                "mobile_number": "9444444444",
                "address": "Test Address",
                "pincode": "400001",
                "state": "Maharashtra",
                "city": "Mumbai"
            }
        )
        enrollment_id = create_response.json()["id"]

        # Then read it
        response = client.get(f"/enrollments/{enrollment_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == enrollment_id
        assert data["uid"] == "GGG444444444444444"

    def test_read_enrollment_by_uid(self):
        """Test getting enrollment by UID."""
        response = client.get("/enrollments/uid/DDD111111111111111")
        assert response.status_code == 200
        data = response.json()
        assert data["uid"] == "DDD111111111111111"

    def test_read_nonexistent_enrollment(self):
        """Test reading non-existent enrollment."""
        response = client.get("/enrollments/999")
        assert response.status_code == 404


class TestUpdateEnrollment:
    """Test enrollment update endpoint."""

    def test_update_enrollment(self):
        """Test updating an enrollment."""
        # Create enrollment
        create_response = client.post(
            "/enrollments",
            json={
                "uid": "HHH555555555555555",
                "full_name": "Original Name",
                "date_of_birth": "1993-08-20",
                "gender": "Female",
                "mobile_number": "9555555555",
                "address": "Original Address",
                "pincode": "500001",
                "state": "Telangana",
                "city": "Hyderabad",
                "email": "original@example.com"
            }
        )
        enrollment_id = create_response.json()["id"]

        # Update it
        response = client.put(
            f"/enrollments/{enrollment_id}",
            json={"full_name": "Updated Name"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["full_name"] == "Updated Name"
        assert data["email"] == "original@example.com"  # Unchanged

    def test_update_nonexistent_enrollment(self):
        """Test updating non-existent enrollment."""
        response = client.put(
            "/enrollments/999",
            json={"full_name": "New Name"}
        )
        assert response.status_code == 404


class TestEnrollmentActions:
    """Test special enrollment action endpoints."""

    def test_verify_enrollment(self):
        """Test verifying an enrollment."""
        # Create enrollment
        create_response = client.post(
            "/enrollments",
            json={
                "uid": "III666666666666666",
                "full_name": "Verify Test",
                "date_of_birth": "1994-09-15",
                "gender": "Male",
                "mobile_number": "9666666666",
                "address": "Test Address",
                "pincode": "600001",
                "state": "Tamil Nadu",
                "city": "Chennai"
            }
        )
        enrollment_id = create_response.json()["id"]

        # Verify it
        response = client.patch(f"/enrollments/{enrollment_id}/verify")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "verified"
        assert data["document_verified"] is True

    def test_capture_biometric(self):
        """Test capturing biometric."""
        # Create enrollment
        create_response = client.post(
            "/enrollments",
            json={
                "uid": "JJJ777777777777777",
                "full_name": "Biometric Test",
                "date_of_birth": "1996-10-20",
                "gender": "Female",
                "mobile_number": "9777777777",
                "address": "Test Address",
                "pincode": "700001",
                "state": "West Bengal",
                "city": "Kolkata"
            }
        )
        enrollment_id = create_response.json()["id"]

        # Capture biometric
        response = client.patch(f"/enrollments/{enrollment_id}/capture-biometric")
        assert response.status_code == 200
        data = response.json()
        assert data["biometric_captured"] is True

    def test_reject_enrollment(self):
        """Test rejecting an enrollment."""
        # Create enrollment
        create_response = client.post(
            "/enrollments",
            json={
                "uid": "KKK888888888888888",
                "full_name": "Reject Test",
                "date_of_birth": "1997-11-25",
                "gender": "Male",
                "mobile_number": "9888888888",
                "address": "Test Address",
                "pincode": "800001",
                "state": "Bihar",
                "city": "Patna"
            }
        )
        enrollment_id = create_response.json()["id"]

        # Reject it
        response = client.patch(
            f"/enrollments/{enrollment_id}/reject?rejection_reason=Invalid%20Documents"
        )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "rejected"
        assert "Invalid Documents" in data["rejection_reason"]


class TestDeleteEnrollment:
    """Test enrollment deletion endpoint."""

    def test_delete_enrollment(self):
        """Test deleting an enrollment."""
        # Create enrollment
        create_response = client.post(
            "/enrollments",
            json={
                "uid": "LLL999999999999999",
                "full_name": "Delete Test",
                "date_of_birth": "1998-12-30",
                "gender": "Female",
                "mobile_number": "9999999999",
                "address": "Test Address",
                "pincode": "900001",
                "state": "Goa",
                "city": "Panaji"
            }
        )
        enrollment_id = create_response.json()["id"]

        # Delete it
        response = client.delete(f"/enrollments/{enrollment_id}")
        assert response.status_code == 200
        assert "deleted successfully" in response.json()["message"]

        # Verify it's gone
        get_response = client.get(f"/enrollments/{enrollment_id}")
        assert get_response.status_code == 404

    def test_delete_nonexistent_enrollment(self):
        """Test deleting non-existent enrollment."""
        response = client.delete("/enrollments/999")
        assert response.status_code == 404
