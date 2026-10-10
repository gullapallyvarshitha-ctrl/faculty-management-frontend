import React, { useState } from 'react';
import { Building2, Plus, Trash2, X, Save, AlertCircle } from 'lucide-react';

export default function DepartmentModal({ departments, onAddDepartment, onDeleteDepartment, user, saving }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', code: '', description: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      setError('Department name and code are required');
      return;
    }
    setError('');
    onAddDepartment(formData, () => {
      setFormData({ name: '', code: '', description: '' });
      setShowAddForm(false);
    });
  };

  return (
    <div className="departments-wrapper">
      <div className="welcome-banner">
        <div>
          <h2 className="banner-heading">Academic Department Directory</h2>
          <p className="banner-subtext">Manage academic schools, divisions, and departmental administrative units.</p>
        </div>
        <div>
          <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
            <Plus size={16} /> {showAddForm ? 'Close Form' : 'New Department'}
          </button>
        </div>
      </div>

      {/* Add Department Form Dropdown */}
      {showAddForm && (
        <div className="add-dept-card mb-6">
          <div className="panel-header">
            <h4 className="panel-title">Register New Academic Department</h4>
            <button className="modal-close-btn" onClick={() => setShowAddForm(false)}>
              <X size={18} />
            </button>
          </div>
          {error && (
            <div className="alert-box mb-4">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-group">
              <label className="form-label">Department Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Biomedical Engineering"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Department Code <span className="text-red-500">*</span></label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. BME"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              />
            </div>
            <div className="form-group col-span-2">
              <label className="form-label">Description / Mission Statement</label>
              <input
                type="text"
                className="form-input"
                placeholder="Brief summary of instructional focus..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="form-actions-right col-span-2">
              <button type="button" className="btn-secondary" onClick={() => setShowAddForm(false)} disabled={saving}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={saving}>
                <Save size={16} /> {saving ? 'Adding...' : 'Save Department'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Department Cards Grid */}
      <div className="departments-grid">
        {departments.map((dept) => (
          <div key={dept.id} className="department-card">
            <div className="dept-card-header">
              <div className="dept-code-badge">{dept.code}</div>
              {user && (
                <button
                  className="btn-icon-action btn-delete"
                  title="Delete department"
                  onClick={() => onDeleteDepartment(dept.id)}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
            <h3 className="dept-card-title">{dept.name}</h3>
            <p className="dept-card-desc">
              {dept.description || 'Standard academic instruction and research division.'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
