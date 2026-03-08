import React, { useState } from 'react';

function CreateEnrollment({ onSubmit, loading, onCancel }) {
  const [formData, setFormData] = useState({
    uid: '',
    full_name: '',
    date_of_birth: '',
    gender: 'Male',
    email: '',
    mobile_number: '',
    address: '',
    pincode: '',
    state: '',
    city: '',
    enrollment_center: '',
  });

  const [errors, setErrors] = useState({});

  const states = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Delhi',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.uid.trim()) newErrors.uid = 'Aadhar UID is required';
    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
    if (!formData.mobile_number.trim()) newErrors.mobile_number = 'Mobile number is required';
    if (!/^\d{10,15}$/.test(formData.mobile_number)) {
      newErrors.mobile_number = 'Mobile number must be 10-15 digits';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="card">
      <h2>Create New Enrollment</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="uid">Aadhar UID *</label>
            <input
              id="uid"
              type="text"
              name="uid"
              value={formData.uid}
              onChange={handleChange}
              placeholder="e.g., AAA123456789012345"
            />
            {errors.uid && <small style={{ color: 'red' }}>{errors.uid}</small>}
          </div>

          <div className="form-group">
            <label htmlFor="full_name">Full Name *</label>
            <input
              id="full_name"
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="e.g., John Doe"
            />
            {errors.full_name && (
              <small style={{ color: 'red' }}>{errors.full_name}</small>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date_of_birth">Date of Birth *</label>
            <input
              id="date_of_birth"
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
            />
            {errors.date_of_birth && (
              <small style={{ color: 'red' }}>{errors.date_of_birth}</small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="gender">Gender *</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="mobile_number">Mobile Number *</label>
            <input
              id="mobile_number"
              type="tel"
              name="mobile_number"
              value={formData.mobile_number}
              onChange={handleChange}
              placeholder="e.g., 9876543210"
            />
            {errors.mobile_number && (
              <small style={{ color: 'red' }}>{errors.mobile_number}</small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g., john@example.com"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="address">Address *</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Full residential address"
          />
          {errors.address && (
            <small style={{ color: 'red' }}>{errors.address}</small>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="pincode">Pincode *</label>
            <input
              id="pincode"
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="e.g., 110001"
            />
            {errors.pincode && (
              <small style={{ color: 'red' }}>{errors.pincode}</small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="state">State *</label>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            {errors.state && (
              <small style={{ color: 'red' }}>{errors.state}</small>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">City *</label>
            <input
              id="city"
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g., New Delhi"
            />
            {errors.city && (
              <small style={{ color: 'red' }}>{errors.city}</small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="enrollment_center">Enrollment Center</label>
            <input
              id="enrollment_center"
              type="text"
              name="enrollment_center"
              value={formData.enrollment_center}
              onChange={handleChange}
              placeholder="e.g., Delhi Central Branch"
            />
          </div>
        </div>

        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <button
            type="submit"
            className="button btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Enrollment'}
          </button>
          <button
            type="button"
            className="button btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateEnrollment;
