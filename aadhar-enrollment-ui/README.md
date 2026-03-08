# Aadhar Enrollment UI

A React + Vite web application for managing Aadhar biometric enrollments. This UI provides a complete interface for creating, viewing, updating, and managing Aadhar enrollment records.

## Features

- ✨ **Create Enrollments** - Register new Aadhar enrollments with full personal details
- 📋 **List View** - Display all enrollments with pagination and filtering
- 👁️ **Detail View** - View complete enrollment information
- ✏️ **Update Enrollments** - Modify enrollment details
- 🗑️ **Delete Enrollments** - Remove enrollment records
- ✅ **Verify Enrollments** - Mark enrollments as verified
- 📸 **Biometric Capture** - Track biometric capture status
- ❌ **Reject Enrollments** - Reject with detailed reasons
- 🔍 **Filter by Status** - Filter enrollments by status (pending, verified, issued, rejected)
- 📄 **Responsive Design** - Works on desktop, tablet, and mobile devices

## Project Structure

```
aadhar-enrollment-ui/
├── src/
│   ├── components/
│   │   ├── EnrollmentList.jsx      # List view component
│   │   ├── CreateEnrollment.jsx    # Form for creating enrollment
│   │   └── EnrollmentDetail.jsx    # Detail and edit view
│   ├── services/
│   │   └── api.js                  # API service calls
│   ├── styles/
│   │   └── index.css               # Global styles
│   ├── App.jsx                     # Main app component
│   └── main.jsx                    # Entry point
├── public/
│   └── index.html                  # HTML template
├── package.json                    # Dependencies
├── vite.config.js                  # Vite configuration
└── README.md                       # This file
```

## Installation

### Prerequisites
- Node.js 14+ and npm/yarn/pnpm

### Setup

1. Navigate to the project directory:
```bash
cd "C:\Users\user\My Projects\aadhar-enrollment-ui"
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Configuration

The API is configured to connect to the FastAPI backend running on `http://localhost:8000`.

To change the API URL, edit `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:8000';
```

## API Endpoints Used

The UI interacts with these endpoints:

### Enrollment Management
- `GET /enrollments` - Get all enrollments (with pagination and filtering)
- `POST /enrollments` - Create new enrollment
- `GET /enrollments/{id}` - Get enrollment by ID
- `GET /enrollments/uid/{uid}` - Get enrollment by Aadhar UID
- `PUT /enrollments/{id}` - Update enrollment
- `DELETE /enrollments/{id}` - Delete enrollment

### Enrollment Actions
- `PATCH /enrollments/{id}/verify` - Verify enrollment
- `PATCH /enrollments/{id}/capture-biometric` - Capture biometric
- `PATCH /enrollments/{id}/reject` - Reject enrollment

### System
- `GET /health` - Health check

## Usage

### Create an Enrollment
1. Click "➕ New Enrollment" button
2. Fill in all required fields
3. Click "Create Enrollment"

### View Enrollments
1. The default view shows all enrollments as cards
2. Use the status filter to see specific enrollments
3. Navigate through pages using pagination buttons

### View Details
1. Click "View Details" button on any enrollment card
2. See complete enrollment information
3. Take actions on the enrollment

### Update Enrollment
1. Click "View Details" on an enrollment
2. Click "✏️ Edit" button
3. Modify the details
4. Click "Save Changes"

### Verify Enrollment
1. Open enrollment detail view
2. Click "✅ Verify" button to mark as verified

### Capture Biometric
1. Open enrollment detail view
2. Click "📸 Capture Biometric" button

### Reject Enrollment
1. Open enrollment detail view
2. Click "❌ Reject" button
3. Enter rejection reason
4. Click "Confirm Rejection"

### Delete Enrollment
1. Click "Delete" on enrollment card or detail view
2. Confirm the deletion

## Build for Production

Build the application:
```bash
npm run build
```

The built files will be in the `dist` directory.

Preview the production build:
```bash
npm run preview
```

## Technologies Used

- **React 18** - UI framework
- **Vite 5** - Fast build tool
- **Axios** - HTTP client for API calls
- **CSS3** - Styling with modern features

## Styling

The application uses a custom CSS design with:
- Gradient color scheme (purple/blue)
- Card-based layout
- Responsive grid system
- Smooth transitions and animations
- Status-based badge colors

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### API Connection Error
- Ensure the FastAPI backend is running on `http://localhost:8000`
- Check the API URL in `src/services/api.js`
- Make sure CORS is enabled on the backend

### Form Validation Errors
- All required fields are marked with *
- Mobile number must be 10-15 digits
- Check error messages displayed under each field

### Port Already in Use
If port 3000 is already in use, Vite will automatically use the next available port.

## License

MIT License

## Support

For issues or questions, please refer to the FastAPI backend documentation or create an issue in the repository.
