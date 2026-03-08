import React from 'react';

function EnrollmentList({ enrollments, onView, onDelete }) {
  const getStatusBadge = (status) => {
    return `badge badge-${status}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="enrollment-list">
      {enrollments.map((enrollment) => (
        <div key={enrollment.id} className="enrollment-card">
          <h3>{enrollment.full_name}</h3>
          
          <div className="enrollment-info">
            <strong>UID:</strong> {enrollment.uid}
          </div>
          
          <div className="enrollment-info">
            <strong>Mobile:</strong> {enrollment.mobile_number}
          </div>
          
          <div className="enrollment-info">
            <strong>City:</strong> {enrollment.city}, {enrollment.state}
          </div>

          <div className="enrollment-info">
            <strong>Status:</strong>{' '}
            <span className={getStatusBadge(enrollment.status)}>
              {enrollment.status.charAt(0).toUpperCase() +
                enrollment.status.slice(1)}
            </span>
          </div>

          <div className="enrollment-info">
            <strong>Biometric:</strong>{' '}
            {enrollment.biometric_captured ? '✅ Captured' : '❌ Pending'}
          </div>

          <div className="enrollment-info">
            <strong>Enrolled:</strong> {formatDate(enrollment.enrollment_date)}
          </div>

          <div className="enrollment-actions">
            <button
              className="button btn-primary btn-sm"
              onClick={() => onView(enrollment)}
            >
              View Details
            </button>
            <button
              className="button btn-danger btn-sm"
              onClick={() => onDelete(enrollment.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default EnrollmentList;
