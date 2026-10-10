import React from 'react';
import { X, Mail, Phone, Building2, Award, Briefcase, GraduationCap, Edit3, Calendar } from 'lucide-react';

export default function FacultyProfileModal({ isOpen, onClose, faculty, onEdit }) {
  if (!isOpen || !faculty) return null;

  const getInitials = (name) => {
    if (!name) return 'FC';
    const parts = name.replace(/^Dr\.\s*|^Prof\.\s*|^Mr\.\s*|^Ms\.\s*/i, '').trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card modal-profile-card">
        {/* Banner with Academic Avatar */}
        <div className="profile-banner">
          <button className="modal-close-white" onClick={onClose}>
            <X size={20} />
          </button>
          <div className="avatar-circle">
            {getInitials(faculty.name)}
          </div>
        </div>

        <div className="profile-body">
          <div className="profile-header-info">
            <h2 className="profile-name">{faculty.name}</h2>
            <div className="profile-badges-row">
              <span className="pill-badge pill-blue font-semibold">
                {faculty.designation}
              </span>
              <span className="pill-badge pill-gray">
                {faculty.department}
              </span>
              <span className="pill-badge pill-teal">
                {faculty.experience} Years Experience
              </span>
            </div>
          </div>

          <div className="profile-details-grid">
            {/* Contact Box */}
            <div className="detail-box">
              <h4 className="detail-box-title">Contact Information</h4>
              <div className="detail-item">
                <Mail size={16} className="text-blue-600" />
                <div>
                  <span className="item-label">University Email</span>
                  <a href={`mailto:${faculty.email}`} className="item-value text-blue-600 hover:underline">
                    {faculty.email}
                  </a>
                </div>
              </div>
              <div className="detail-item">
                <Phone size={16} className="text-emerald-600" />
                <div>
                  <span className="item-label">Direct Phone</span>
                  <span className="item-value">{faculty.phoneNumber}</span>
                </div>
              </div>
            </div>

            {/* Academic Credentials Box */}
            <div className="detail-box">
              <h4 className="detail-box-title">Academic Credentials</h4>
              <div className="detail-item">
                <GraduationCap size={16} className="text-indigo-600" />
                <div>
                  <span className="item-label">Highest Qualification</span>
                  <span className="item-value font-semibold">{faculty.qualification}</span>
                </div>
              </div>
              <div className="detail-item">
                <Building2 size={16} className="text-amber-600" />
                <div>
                  <span className="item-label">Academic Department</span>
                  <span className="item-value">{faculty.department}</span>
                </div>
              </div>
            </div>

            {/* Specialization Box */}
            <div className="detail-box col-span-2">
              <h4 className="detail-box-title">Domain Expertise & Specialization</h4>
              <div className="detail-item">
                <Award size={16} className="text-purple-600" />
                <div>
                  <span className="item-label">Key Research / Teaching Domains</span>
                  <p className="specialization-full-text">{faculty.specialization}</p>
                </div>
              </div>
            </div>

            {/* Metadata Box */}
            <div className="detail-box col-span-2 metadata-box">
              <div className="meta-item">
                <span className="meta-label">Record ID:</span>
                <span className="font-mono">FAC-{String(faculty.id).padStart(4, '0')}</span>
              </div>
              {faculty.createdAt && (
                <div className="meta-item">
                  <Calendar size={14} className="text-muted inline mr-1" />
                  <span className="meta-label">Registered:</span>
                  <span>{new Date(faculty.createdAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn-secondary" onClick={onClose}>
              Close
            </button>
            <button
              className="btn-primary"
              onClick={() => {
                onClose();
                onEdit(faculty);
              }}
            >
              <Edit3 size={16} /> Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
