# Aadhar Enrollment System

A comprehensive CRUD application for managing Aadhar biometric enrollment built with FastAPI and SQLAlchemy.

## Features

- ✨ **Full CRUD Operations** - Create, read, update, and delete enrollment records
- 📋 **Enrollment Status Management** - Track enrollment stages (pending, verified, issued, rejected)
- 🔐 **Biometric Tracking** - Monitor biometric capture status
- 📄 **Document Verification** - Track document verification status
- 🔍 **Advanced Filtering** - Search enrollments by status, UID
- 🗄️ **SQLAlchemy ORM** - Robust database models
- ✔️ **Pydantic Validation** - Request/response data validation
- 📚 **Auto-generated API Documentation** - Interactive Swagger UI and ReDoc
- 🧪 **Unit Tests** - Comprehensive test suite
- 🚀 **Production Ready** - Best practices implemented

## Project Structure

```
fastapi-crud-app/
├── app/
│   ├── __init__.py                  # Package initialization
│   ├── main.py                      # FastAPI application and routes
│   ├── config.py                    # Configuration settings
│   ├── database.py                  # Database setup and session management
│   ├── models.py                    # SQLAlchemy models (AadharEnrollment)
│   ├── schemas.py                   # Pydantic schemas for validation
│   └── crud.py                      # CRUD operation functions
├── tests/                           # Test cases
├── requirements.txt                 # Python dependencies
├── .gitignore                      # Git ignore rules
└── README.md                        # This file
```

## Installation

### 1. Create Virtual Environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Run the Application

```bash
python -m uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Health Check
- `GET /health` - Check API status

### Enrollment Management
- `POST /enrollments` - Create a new enrollment
- `GET /enrollments` - Get all enrollments (with pagination and status filtering)
- `GET /enrollments/{enrollment_id}` - Get a specific enrollment by ID
- `GET /enrollments/uid/{uid}` - Get enrollment by Aadhar UID
- `PUT /enrollments/{enrollment_id}` - Update an enrollment
- `PATCH /enrollments/{enrollment_id}/verify` - Mark enrollment as verified
- `PATCH /enrollments/{enrollment_id}/capture-biometric` - Mark biometric as captured
- `PATCH /enrollments/{enrollment_id}/reject` - Reject an enrollment
- `DELETE /enrollments/{enrollment_id}` - Delete an enrollment

## API Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI Schema**: http://localhost:8000/openapi.json

## Example Requests

### Create Enrollment

```bash
curl -X POST "http://localhost:8000/enrollments" \
  -H "Content-Type: application/json" \
  -d '{
    "uid": "AAA123456789012345",
    "full_name": "John Doe",
    "date_of_birth": "1990-05-15",
    "gender": "Male",
    "mobile_number": "9876543210",
    "address": "123 Main Street, Apt 4",
    "pincode": "110001",
    "state": "Delhi",
    "city": "New Delhi",
    "email": "john@example.com",
    "enrollment_center": "Delhi Central Branch"
  }'
```

### Get All Enrollments

```bash
curl "http://localhost:8000/enrollments?skip=0&limit=10"
```

### Get Enrollments by Status

```bash
curl "http://localhost:8000/enrollments?status=pending&skip=0&limit=10"
```

### Get Enrollment by ID

```bash
curl "http://localhost:8000/enrollments/1"
```

### Get Enrollment by Aadhar UID

```bash
curl "http://localhost:8000/enrollments/uid/AAA123456789012345"
```

### Update Enrollment

```bash
curl -X PUT "http://localhost:8000/enrollments/1" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Updated Doe",
    "email": "john.updated@example.com"
  }'
```

### Verify Enrollment

```bash
curl -X PATCH "http://localhost:8000/enrollments/1/verify"
```

### Capture Biometric

```bash
curl -X PATCH "http://localhost:8000/enrollments/1/capture-biometric"
```

### Reject Enrollment

```bash
curl -X PATCH "http://localhost:8000/enrollments/1/reject?rejection_reason=Invalid%20Documents"
```

### Delete Enrollment

```bash
curl -X DELETE "http://localhost:8000/enrollments/1"
```

## Configuration

Create a `.env` file in the project root to override default settings:

```env
DATABASE_URL=sqlite:///./test.db
DEBUG=True
APP_NAME=Aadhar Enrollment System
```

## Database

By default, the application uses SQLite (`test.db`). To use a different database:

1. Install the appropriate driver (e.g., `pip install psycopg2-binary` for PostgreSQL)
2. Update `DATABASE_URL` in `.env` or `app/config.py`

Example PostgreSQL connection string:
```
DATABASE_URL=postgresql://user:password@localhost:5432/aadhar_db
```

## Database Schema

The `aadhar_enrollments` table includes:

| Field | Type | Description |
|-------|------|-------------|
| id | Integer | Primary key |
| uid | String | Unique Aadhar ID |
| full_name | String | Applicant's full name |
| date_of_birth | Date | Date of birth |
| gender | String | Gender (Male, Female, Other) |
| email | String | Email address (optional) |
| mobile_number | String | 10-15 digit mobile number |
| address | Text | Residential address |
| pincode | String | Postal code |
| state | String | State name |
| city | String | City name |
| enrollment_center | String | Enrollment center location (optional) |
| status | String | pending \| verified \| issued \| rejected |
| biometric_captured | Boolean | Biometric capture status |
| document_verified | Boolean | Document verification status |
| rejection_reason | Text | Reason for rejection (if applicable) |
| enrollment_date | DateTime | Enrollment creation date |
| verification_date | DateTime | Date of verification |
| created_at | DateTime | Record creation timestamp |
| updated_at | DateTime | Last update timestamp |

## Testing

Run the test suite:

```bash
pytest
```

With coverage:

```bash
pytest --cov=app tests/
```

## Development

### Extending the Application

To add new features or fields to the Aadhar enrollment system:

1. Update model in `app/models.py` (add new columns to `AadharEnrollment`)
2. Create migration if using Alembic (recommended for production)
3. Update schemas in `app/schemas.py` with new fields
4. Add CRUD operations in `app/crud.py` if needed
5. Add/update routes in `app/main.py` for new functionality

### Adding Biometric Data Storage

For production use, consider:
- Store biometric templates in a separate `biometric_data` table
- Use blob fields for fingerprint/iris data
- Implement encryption for sensitive data
- Add proper access controls

### Code Style

The project follows PEP 8 conventions. Use these tools for code quality:

```bash
# Format code
black app/

# Linting
pylint app/

# Type checking
mypy app/
```

## Troubleshooting

### Port Already in Use

If port 8000 is in use, specify a different port:

```bash
python -m uvicorn app.main:app --reload --port 8001
```

### Database Errors

Delete `test.db` to reset the database:

```bash
rm test.db
```

Then restart the application.

## License

MIT License

## Support

For issues or questions, please create an issue in the repository.
