import React, { useState } from 'react';
import { Search, Filter, Plus, Eye, Edit3, Trash2, RefreshCw, XCircle, Phone, Mail, GraduationCap } from 'lucide-react';

export default function FacultyList({
  facultyList,
  departments,
  loading,
  searchQuery,
  setSearchQuery,
  selectedDept,
  setSelectedDept,
  selectedDesig,
  setSelectedDesig,
  onResetFilters,
  onAddFaculty,
  onViewProfile,
  onEditFaculty,
  onDeleteFaculty,
  user
}) {
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const designations = [
    'Professor',
    'Associate Professor',
    'Assistant Professor',
    'Lecturer',
    'Head of Department'
  ];

  return (
    <div className="faculty-list-wrapper">
      {/* Control Bar: Search and Filters */}
      <div className="table-controls-card">
        <div className="controls-row">
          {/* Search Box */}
          <div className="search-box-wrap">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search faculty by name, email, specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button className="search-clear-btn" onClick={() => setSearchQuery('')}>
                <XCircle size={16} />
              </button>
            )}
          </div>

          {/* Department Filter */}
          <div className="filter-select-wrap">
            <Filter size={16} className="filter-icon" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="filter-select"
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.name}>{d.name} ({d.code})</option>
              ))}
            </select>
          </div>

          {/* Designation Filter */}
          <div className="filter-select-wrap">
            <GraduationCap size={16} className="filter-icon" />
            <select
              value={selectedDesig}
              onChange={(e) => setSelectedDesig(e.target.value)}
              className="filter-select"
            >
              <option value="">All Designations</option>
              {designations.map((desig) => (
                <option key={desig} value={desig}>{desig}</option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          {(searchQuery || selectedDept || selectedDesig) && (
            <button className="btn-secondary" onClick={onResetFilters} title="Reset all filters">
              Reset Filters
            </button>
          )}

          {/* Add Faculty Button */}
          <button className="btn-primary ml-auto" onClick={onAddFaculty}>
            <Plus size={16} /> Add Faculty
          </button>
        </div>

        {/* Counter Summary */}
        <div className="filter-status-row">
          <span className="results-count">
            Found <strong>{facultyList.length}</strong> faculty record{facultyList.length === 1 ? '' : 's'}
          </span>
          {!user && (
            <span className="guest-notice">
              * Note: You are in guest mode. Log in as Administrator to create, edit, or delete records.
            </span>
          )}
        </div>
      </div>

      {/* Table Section */}
      <div className="dashboard-panel">
        {loading ? (
          <div className="loading-state">
            <RefreshCw className="spinner-icon" size={28} />
            <p>Filtering faculty database...</p>
          </div>
        ) : facultyList.length === 0 ? (
          <div className="empty-state">
            <Search size={48} className="text-muted mb-2" />
            <h4 className="empty-title">No Faculty Records Found</h4>
            <p className="empty-desc">
              {searchQuery || selectedDept || selectedDesig
                ? 'Try adjusting your search criteria or clearing filters.'
                : 'Your faculty database is empty. Add the first faculty record!'}
            </p>
            {(searchQuery || selectedDept || selectedDesig) ? (
              <button className="btn-secondary mt-3" onClick={onResetFilters}>
                Clear All Filters
              </button>
            ) : (
              <button className="btn-primary mt-3" onClick={onAddFaculty}>
                <Plus size={16} /> Add Faculty
              </button>
            )}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Faculty Member</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Experience</th>
                  <th>Contact</th>
                  <th>Specialization</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {facultyList.map((faculty) => (
                  <tr key={faculty.id} className="table-row-hover">
                    <td className="font-mono text-muted">#{faculty.id}</td>
                    <td>
                      <div className="faculty-name-cell">
                        <span className="faculty-name">{faculty.name}</span>
                        <span className="faculty-sub-email">
                          <Mail size={12} /> {faculty.email}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="dept-tag">{faculty.department}</span>
                    </td>
                    <td>
                      <span className={`pill-badge ${faculty.designation.includes('Professor') ? 'pill-blue' : 'pill-teal'}`}>
                        {faculty.designation}
                      </span>
                    </td>
                    <td>
                      <strong>{faculty.experience}</strong> yrs
                    </td>
                    <td>
                      <span className="contact-text">
                        <Phone size={12} /> {faculty.phoneNumber}
                      </span>
                    </td>
                    <td className="specialization-cell" title={faculty.specialization}>
                      {faculty.specialization}
                    </td>
                    <td className="text-right">
                      <div className="action-buttons-group">
                        <button
                          className="btn-icon-action btn-view"
                          title="View Complete Profile"
                          onClick={() => onViewProfile(faculty)}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="btn-icon-action btn-edit"
                          title="Edit Faculty Record"
                          onClick={() => onEditFaculty(faculty)}
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          className="btn-icon-action btn-delete"
                          title="Delete Faculty Record"
                          onClick={() => setDeleteConfirmId(faculty.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* In-row Delete Confirmation Modal */}
                      {deleteConfirmId === faculty.id && (
                        <div className="delete-confirm-popover">
                          <p>Delete record for <strong>{faculty.name}</strong>?</p>
                          <div className="popover-actions">
                            <button
                              className="btn-popover-cancel"
                              onClick={() => setDeleteConfirmId(null)}
                            >
                              Cancel
                            </button>
                            <button
                              className="btn-popover-danger"
                              onClick={() => {
                                onDeleteFaculty(faculty.id);
                                setDeleteConfirmId(null);
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
