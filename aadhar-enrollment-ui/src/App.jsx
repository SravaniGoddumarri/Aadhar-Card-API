import React, { useState, useEffect } from 'react';
import { enrollmentService } from './services/api';
import EnrollmentList from './components/EnrollmentList';
import CreateEnrollment from './components/CreateEnrollment';
import EnrollmentDetail from './components/EnrollmentDetail';
import './styles/index.css';

function App() {
  const [view, setView] = useState('list'); // list, create, detail, update
  const [enrollments, setEnrollments] = useState([]);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalEnrollments, setTotalEnrollments] = useState(0);

  const ITEMS_PER_PAGE = 10;

  // Fetch enrollments
  const fetchEnrollments = async (page = 0, status = null) => {
    try {
      setLoading(true);
      setError(null);
      const skip = page * ITEMS_PER_PAGE;
      const response = await enrollmentService.getEnrollments(
        skip,
        ITEMS_PER_PAGE,
        status
      );
      setEnrollments(response.data.enrollments);
      setTotalEnrollments(response.data.total);
      setCurrentPage(page);
    } catch (err) {
      setError(
        err.response?.data?.detail || 'Failed to fetch enrollments'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments(0, statusFilter);
  }, [statusFilter]);

  // Handle create enrollment
  const handleCreateEnrollment = async (data) => {
    try {
      setLoading(true);
      await enrollmentService.createEnrollment(data);
      setMessage('Enrollment created successfully!');
      setView('list');
      fetchEnrollments(0, statusFilter);
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setError(
        err.response?.data?.detail || 'Failed to create enrollment'
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle view detail
  const handleViewDetail = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setView('detail');
  };

  // Handle update
  const handleUpdateEnrollment = async (id, data) => {
    try {
      setLoading(true);
      await enrollmentService.updateEnrollment(id, data);
      setMessage('Enrollment updated successfully!');
      const updatedEnrollment = await enrollmentService.getEnrollmentById(id);
      setSelectedEnrollment(updatedEnrollment.data);
      fetchEnrollments(currentPage, statusFilter);
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setError(
        err.response?.data?.detail || 'Failed to update enrollment'
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle verify
  const handleVerify = async (id) => {
    try {
      setLoading(true);
      await enrollmentService.verifyEnrollment(id);
      setMessage('Enrollment verified successfully!');
      const updatedEnrollment = await enrollmentService.getEnrollmentById(id);
      setSelectedEnrollment(updatedEnrollment.data);
      fetchEnrollments(currentPage, statusFilter);
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setError(
        err.response?.data?.detail || 'Failed to verify enrollment'
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle biometric capture
  const handleCaptureBiometric = async (id) => {
    try {
      setLoading(true);
      await enrollmentService.captureBiometric(id);
      setMessage('Biometric captured successfully!');
      const updatedEnrollment = await enrollmentService.getEnrollmentById(id);
      setSelectedEnrollment(updatedEnrollment.data);
      fetchEnrollments(currentPage, statusFilter);
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setError(
        err.response?.data?.detail || 'Failed to capture biometric'
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle reject
  const handleReject = async (id, reason) => {
    try {
      setLoading(true);
      await enrollmentService.rejectEnrollment(id, reason);
      setMessage('Enrollment rejected successfully!');
      const updatedEnrollment = await enrollmentService.getEnrollmentById(id);
      setSelectedEnrollment(updatedEnrollment.data);
      fetchEnrollments(currentPage, statusFilter);
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setError(
        err.response?.data?.detail || 'Failed to reject enrollment'
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this enrollment?')) {
      try {
        setLoading(true);
        await enrollmentService.deleteEnrollment(id);
        setMessage('Enrollment deleted successfully!');
        setView('list');
        fetchEnrollments(0, statusFilter);
        setTimeout(() => setMessage(null), 3000);
      } catch (err) {
        setError(
          err.response?.data?.detail || 'Failed to delete enrollment'
        );
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle pagination
  const handlePageChange = (page) => {
    fetchEnrollments(page, statusFilter);
  };

  const totalPages = Math.ceil(totalEnrollments / ITEMS_PER_PAGE);

  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <div className="header">
          <h1>🆔 Aadhar Enrollment System</h1>
          <p>Manage Aadhar biometric enrollments efficiently</p>
        </div>

        {/* Messages */}
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}

        {/* Navigation */}
        <div className="nav">
          <button
            className={`button btn-primary ${view === 'list' ? 'active' : ''}`}
            onClick={() => setView('list')}
          >
            📋 View Enrollments
          </button>
          <button
            className={`button btn-primary ${view === 'create' ? 'active' : ''}`}
            onClick={() => setView('create')}
          >
            ➕ New Enrollment
          </button>
        </div>

        {/* Main Content */}
        {view === 'list' && (
          <>
            {/* Filter */}
            <div className="filter-section">
              <label style={{ marginBottom: 0 }}>Filter by Status:</label>
              <select
                value={statusFilter || ''}
                onChange={(e) => setStatusFilter(e.target.value || null)}
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="issued">Issued</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Enrollment List */}
            {loading ? (
              <div className="loading">Loading enrollments...</div>
            ) : enrollments.length > 0 ? (
              <>
                <EnrollmentList
                  enrollments={enrollments}
                  onView={handleViewDetail}
                  onDelete={handleDelete}
                />
                {totalPages > 1 && (
                  <div className="pagination">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={currentPage === i ? 'active' : ''}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="empty-state">
                <h3>No Enrollments Found</h3>
                <p>Create a new enrollment to get started</p>
              </div>
            )}
          </>
        )}

        {view === 'create' && (
          <CreateEnrollment
            onSubmit={handleCreateEnrollment}
            loading={loading}
            onCancel={() => setView('list')}
          />
        )}

        {view === 'detail' && selectedEnrollment && (
          <EnrollmentDetail
            enrollment={selectedEnrollment}
            onUpdate={handleUpdateEnrollment}
            onVerify={handleVerify}
            onCaptureBiometric={handleCaptureBiometric}
            onReject={handleReject}
            onDelete={handleDelete}
            onBack={() => setView('list')}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}

export default App;
