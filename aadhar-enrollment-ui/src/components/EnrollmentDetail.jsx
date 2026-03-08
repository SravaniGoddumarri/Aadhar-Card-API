import React, { useState } from 'react';

function EnrollmentDetail({
  enrollment,
  onUpdate,
  onVerify,
  onCaptureBiometric,
  onReject,
  onDelete,
  onBack,
  loading,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [editData, setEditData] = useState({
    full_name: enrollment.full_name,
    email: enrollment.email,
    address: enrollment.address,
    pincode: enrollment.pincode,
    city: enrollment.city,
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status) => {
    return `badge badge-${status}`;
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEdit = () => {
    onUpdate(enrollment.id, editData);
    setIsEditing(false);
  };

  const handleRejectSubmit = () => {
    if (rejectReason.trim()) {
      onReject(enrollment.id, rejectReason);
      setShowRejectForm(false);
      setRejectReason('');
    }
  };

  return (
    <div className="detail-container">
      <div className="detail-header">
        <div>
          <h2>{enrollment.full_name}</h2>
          <span className={getStatusBadge(enrollment.status)}>
            {enrollment.status.charAt(0).toUpperCase() +
              enrollment.status.slice(1)}
          </span>
        </div>
        <button
          className="button btn-secondary"
          onClick={onBack}
          disabled={loading}
        >
          ← Back
        </button>
      </div>

      {/* Personal Information */}
      <div className="detail-grid">
        <div className="detail-item">
          <label>Aadhar UID</label>
          <p>{enrollment.uid}</p>
        </div>
        <div className="detail-item">
          <label>Gender</label>
          <p>{enrollment.gender}</p>
        </div>
        <div className="detail-item">
          <label>Date of Birth</label>
          <p>{enrollment.date_of_birth}</p>
        </div>
        <div className="detail-item">
          <label>Mobile Number</label>
          <p>{enrollment.mobile_number}</p>
        </div>
        <div className="detail-item">
          <label>Email</label>
          <p>{enrollment.email || 'N/A'}</p>
        </div>
        <div className="detail-item">
          <label>Enrollment Center</label>
          <p>{enrollment.enrollment_center || 'N/A'}</p>
        </div>
      </div>

      {/* Address Information */}
      <h3 style={{ color: '#667eea', marginTop: '30px', marginBottom: '20px' }}>
        Address Information
      </h3>
      <div className="detail-grid">
        <div className="detail-item">
          <label>Address</label>
          <p>{enrollment.address}</p>
        </div>
        <div className="detail-item">
          <label>Pincode</label>
          <p>{enrollment.pincode}</p>
        </div>
        <div className="detail-item">
          <label>City</label>
          <p>{enrollment.city}</p>
        </div>
        <div className="detail-item">
          <label>State</label>
          <p>{enrollment.state}</p>
        </div>
      </div>

      {/* Document Status */}
      <h3 style={{ color: '#667eea', marginTop: '30px', marginBottom: '20px' }}>
        Verification Status
      </h3>
      <div className="detail-grid">
        <div className="detail-item">
          <label>Biometric Captured</label>
          <p>{enrollment.biometric_captured ? '✅ Yes' : '❌ No'}</p>
        </div>
        <div className="detail-item">
          <label>Document Verified</label>
          <p>{enrollment.document_verified ? '✅ Yes' : '❌ No'}</p>
        </div>
        <div className="detail-item">
          <label>Enrollment Date</label>
          <p>{formatDate(enrollment.enrollment_date)}</p>
        </div>
        <div className="detail-item">
          <label>Verification Date</label>
          <p>{enrollment.verification_date ? formatDate(enrollment.verification_date) : 'Pending'}</p>
        </div>
      </div>

      {/* Rejection Reason */}
      {enrollment.status === 'rejected' && enrollment.rejection_reason && (
        <>
          <h3 style={{ color: '#667eea', marginTop: '30px', marginBottom: '20px' }}>
            Rejection Details
          </h3>
          <div
            style={{
              background: '#f8d7da',
              padding: '15px',
              borderRadius: '5px',
              borderLeft: '4px solid #dc3545',
            }}
          >
            <strong>Reason:</strong> {enrollment.rejection_reason}
          </div>
        </>
      )}

      {/* Edit Section */}
      {isEditing && (
        <>
          <h3 style={{ color: '#667eea', marginTop: '30px', marginBottom: '20px' }}>
            Edit Enrollment
          </h3>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="full_name"
                value={editData.full_name}
                onChange={handleEditChange}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={editData.email}
                onChange={handleEditChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Address</label>
            <textarea
              name="address"
              value={editData.address}
              onChange={handleEditChange}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Pincode</label>
              <input
                type="text"
                name="pincode"
                value={editData.pincode}
                onChange={handleEditChange}
              />
            </div>
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={editData.city}
                onChange={handleEditChange}
              />
            </div>
          </div>
        </>
      )}

      {/* Reject Form */}
      {showRejectForm && (
        <div style={{ marginTop: '30px' }}>
          <h3 style={{ color: '#667eea', marginBottom: '20px' }}>
            Reject Enrollment
          </h3>
          <div className="form-group">
            <label>Rejection Reason *</label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter reason for rejection"
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div
        style={{
          marginTop: '30px',
          paddingTop: '20px',
          borderTop: '1px solid #eee',
        }}
      >
        <h3 style={{ color: '#667eea', marginBottom: '20px' }}>Actions</h3>

        {isEditing ? (
          <>
            <button
              className="button btn-success"
              onClick={handleSaveEdit}
              disabled={loading}
            >
              Save Changes
            </button>
            <button
              className="button btn-secondary"
              onClick={() => setIsEditing(false)}
              disabled={loading}
            >
              Cancel
            </button>
          </>
        ) : showRejectForm ? (
          <>
            <button
              className="button btn-danger"
              onClick={handleRejectSubmit}
              disabled={loading || !rejectReason.trim()}
            >
              Confirm Rejection
            </button>
            <button
              className="button btn-secondary"
              onClick={() => {
                setShowRejectForm(false);
                setRejectReason('');
              }}
              disabled={loading}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              className="button btn-primary"
              onClick={() => setIsEditing(true)}
              disabled={loading}
            >
              ✏️ Edit
            </button>

            {enrollment.status === 'pending' && (
              <>
                <button
                  className="button btn-success"
                  onClick={() => onCaptureBiometric(enrollment.id)}
                  disabled={loading}
                >
                  📸 Capture Biometric
                </button>
                <button
                  className="button btn-success"
                  onClick={() => onVerify(enrollment.id)}
                  disabled={loading}
                >
                  ✅ Verify
                </button>
                <button
                  className="button btn-warning"
                  onClick={() => setShowRejectForm(true)}
                  disabled={loading}
                >
                  ❌ Reject
                </button>
              </>
            )}

            <button
              className="button btn-danger"
              onClick={() => onDelete(enrollment.id)}
              disabled={loading}
            >
              🗑️ Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default EnrollmentDetail;
