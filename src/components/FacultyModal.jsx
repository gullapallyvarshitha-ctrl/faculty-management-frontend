import React, { useState, useEffect } from 'react';
import { X, Save, UserCheck, AlertCircle } from 'lucide-react';

export default function FacultyModal({ isOpen, onClose, onSave, facultyToEdit, departments, saving }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    department: '',
    designation: 'Assistant Professor',
    qualification: '',
    experience: 0,
    specialization: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (facultyToEdit) {
      setFormData({
        name: facultyToEdit.name || '',
        email: facultyToEdit.email || '',
        phoneNumber: facultyToEdit.phoneNumber || '',
        department: facultyToEdit.department || '',
        designation: facultyToEdit.designation || 'Assistant Professor',
        qualification: facultyToEdit.qualification || '',
        experience: facultyToEdit.experience !== undefined ? facultyToEdit.experience : 0,
        specialization: facultyToEdit.specialization || ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phoneNumber: '',
        department: departments.length > 0 ? departments[0].name : '',
        designation: 'Assistant Professor',
        qualification: '',
        experience: 3,
        specialization: ''
      });
    }
    setErrors({});
  }, [facultyToEdit, departments, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email format (e.g. name@university.edu)';
    }
    if (!formData.phoneNumber.trim()) errs.phoneNumber = 'Phone number is required';
    if (!formData.department.trim()) errs.department = 'Department must be selected';
    if (!formData.designation.trim()) errs.designation = 'Designation is required';
    if (!formData.qualification.trim()) errs.qualification = 'Academic qualification is required';
    if (formData.experience === '' || isNaN(formData.experience) || Number(formData.experience) < 0) {
      errs.experience = 'Experience must be a positive number';
    }
    if (!formData.specialization.trim()) errs.specialization = 'Academic specialization is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      ...formData,
      experience: Number(formData.experience)
    });
  };

  const designations = [
    'Professor',
    'Associate Professor',
    'Assistant Professor',
    'Lecturer',
    'Head of Department'
  ];

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <UserCheck className="text-blue-600" size={22} />
            <h3 className="modal-title">
              {facultyToEdit ? 'Edit Faculty Record' : 'Register New Faculty Member'}
            </h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} disabled={saving}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            {/* Full Name */}
            <div className="form-group col-span-2">
              <label className="form-label">Full Name & Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                className={`form-input ${errors.name ? 'input-error' : ''}`}
                placeholder="e.g. Dr. Alan Turing"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">University Email <span className="text-red-500">*</span></label>
              <input
                type="email"
                className={`form-input ${errors.email ? 'input-error' : ''}`}
                placeholder="e.g. alan.turing@university.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            {/* Phone */}
            <div className="form-group">
              <label className="form-label">Phone Number <span className="text-red-500">*</span></label>
              <input
                type="text"
                className={`form-input ${errors.phoneNumber ? 'input-error' : ''}`}
                placeholder="e.g. +1 (555) 019-2831"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              />
              {errors.phoneNumber && <span className="field-error">{errors.phoneNumber}</span>}
            </div>

            {/* Department */}
            <div className="form-group">
              <label className="form-label">Department <span className="text-red-500">*</span></label>
              <select
                className={`form-select ${errors.department ? 'input-error' : ''}`}
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                <option value="">-- Select Department --</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.name}>{d.name} ({d.code})</option>
                ))}
              </select>
              {errors.department && <span className="field-error">{errors.department}</span>}
            </div>

            {/* Designation */}
            <div className="form-group">
              <label className="form-label">Designation / Rank <span className="text-red-500">*</span></label>
              <select
                className={`form-select ${errors.designation ? 'input-error' : ''}`}
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              >
                {designations.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              {errors.designation && <span className="field-error">{errors.designation}</span>}
            </div>

            {/* Qualification */}
            <div className="form-group">
              <label className="form-label">Highest Qualification <span className="text-red-500">*</span></label>
              <input
                type="text"
                className={`form-input ${errors.qualification ? 'input-error' : ''}`}
                placeholder="e.g. Ph.D. in Computer Science"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
              />
              {errors.qualification && <span className="field-error">{errors.qualification}</span>}
            </div>

            {/* Experience */}
            <div className="form-group">
              <label className="form-label">Experience (Years) <span className="text-red-500">*</span></label>
              <input
                type="number"
                min="0"
                className={`form-input ${errors.experience ? 'input-error' : ''}`}
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              />
              {errors.experience && <span className="field-error">{errors.experience}</span>}
            </div>

            {/* Specialization */}
            <div className="form-group col-span-2">
              <label className="form-label">Primary Research / Teaching Specialization <span className="text-red-500">*</span></label>
              <input
                type="text"
                className={`form-input ${errors.specialization ? 'input-error' : ''}`}
                placeholder="e.g. Artificial Intelligence, Cryptography, Distributed Systems"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              />
              {errors.specialization && <span className="field-error">{errors.specialization}</span>}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              <Save size={16} />
              {saving ? 'Saving to Database...' : facultyToEdit ? 'Update Faculty' : 'Save Faculty Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
