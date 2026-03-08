import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Enrollment endpoints
export const enrollmentService = {
  // Get all enrollments
  getEnrollments: (skip = 0, limit = 10, status = null) => {
    let url = `/enrollments?skip=${skip}&limit=${limit}`;
    if (status) {
      url += `&status=${status}`;
    }
    return api.get(url);
  },

  // Get single enrollment by ID
  getEnrollmentById: (id) => api.get(`/enrollments/${id}`),

  // Get enrollment by UID
  getEnrollmentByUid: (uid) => api.get(`/enrollments/uid/${uid}`),

  // Create enrollment
  createEnrollment: (data) => api.post('/enrollments', data),

  // Update enrollment
  updateEnrollment: (id, data) => api.put(`/enrollments/${id}`, data),

  // Verify enrollment
  verifyEnrollment: (id) => api.patch(`/enrollments/${id}/verify`),

  // Capture biometric
  captureBiometric: (id) => api.patch(`/enrollments/${id}/capture-biometric`),

  // Reject enrollment
  rejectEnrollment: (id, reason) => api.patch(`/enrollments/${id}/reject?rejection_reason=${encodeURIComponent(reason)}`),

  // Delete enrollment
  deleteEnrollment: (id) => api.delete(`/enrollments/${id}`),

  // Health check
  healthCheck: () => api.get('/health'),
};

export default api;
