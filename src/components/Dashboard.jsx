import React from 'react';
import { Users, Building2, Award, Briefcase, UserPlus, FolderPlus, ArrowRight, RefreshCw } from 'lucide-react';

export default function Dashboard({ stats, loading, onRefresh, onAddFaculty, onAddDepartment, onViewFaculty, onViewProfile }) {
  if (loading) {
    return (
      <div className="loading-state">
        <RefreshCw className="spinner-icon" size={32} />
        <p>Loading university statistics...</p>
      </div>
    );
  }

  const {
    totalFaculty = 0,
    totalDepartments = 0,
    totalProfessors = 0,
    totalAssociateProfessors = 0,
    totalAssistantProfessors = 0,
    averageExperience = 0,
    facultyByDepartment = {},
    recentFaculty = []
  } = stats || {};

  return (
    <div className="dashboard-wrapper">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div>
          <h2 className="banner-heading">Executive Academic Dashboard</h2>
          <p className="banner-subtext">Real-time overview of university faculty records, departmental rosters, and academic designations.</p>
        </div>
        <div className="banner-actions">
          <button className="btn-secondary" onClick={onRefresh}>
            <RefreshCw size={16} /> Refresh
          </button>
          <button className="btn-primary" onClick={onAddFaculty}>
            <UserPlus size={16} /> Add Faculty
          </button>
          <button className="btn-secondary" onClick={onAddDepartment}>
            <FolderPlus size={16} /> New Department
          </button>
        </div>
      </div>

      {/* Key Metric Cards */}
      <div className="metrics-grid">
        <div className="metric-card card-blue">
          <div className="metric-icon-wrap bg-blue-100 text-blue-700">
            <Users size={24} />
          </div>
          <div>
            <span className="metric-label">Total Faculty</span>
            <h3 className="metric-value">{totalFaculty}</h3>
            <span className="metric-caption">Active academic staff</span>
          </div>
        </div>

        <div className="metric-card card-indigo">
          <div className="metric-icon-wrap bg-indigo-100 text-indigo-700">
            <Building2 size={24} />
          </div>
          <div>
            <span className="metric-label">Departments</span>
            <h3 className="metric-value">{totalDepartments}</h3>
            <span className="metric-caption">Academic divisions</span>
          </div>
        </div>

        <div className="metric-card card-sky">
          <div className="metric-icon-wrap bg-sky-100 text-sky-700">
            <Award size={24} />
          </div>
          <div>
            <span className="metric-label">Full Professors</span>
            <h3 className="metric-value">{totalProfessors}</h3>
            <span className="metric-caption">Tenured senior faculty</span>
          </div>
        </div>

        <div className="metric-card card-teal">
          <div className="metric-icon-wrap bg-teal-100 text-teal-700">
            <Briefcase size={24} />
          </div>
          <div>
            <span className="metric-label">Avg. Experience</span>
            <h3 className="metric-value">{averageExperience} <span className="unit">yrs</span></h3>
            <span className="metric-caption">Teaching & research span</span>
          </div>
        </div>
      </div>

      {/* Breakdown Row */}
      <div className="dashboard-grid-row">
        {/* Department Distribution */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h4 className="panel-title">Faculty Distribution by Department</h4>
            <span className="panel-badge">{Object.keys(facultyByDepartment).length} Departments</span>
          </div>
          <div className="dept-distribution-list">
            {Object.keys(facultyByDepartment).length === 0 ? (
              <p className="empty-text">No departmental records found.</p>
            ) : (
              Object.entries(facultyByDepartment).map(([dept, count]) => {
                const percentage = totalFaculty > 0 ? Math.round((count / totalFaculty) * 100) : 0;
                return (
                  <div key={dept} className="dept-progress-item">
                    <div className="dept-progress-labels">
                      <span className="dept-name">{dept}</span>
                      <span className="dept-count">
                        <strong>{count}</strong> ({percentage}%)
                      </span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Designation Breakdown */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h4 className="panel-title">Academic Rank Hierarchy</h4>
            <span className="panel-badge">Designations</span>
          </div>
          <div className="designation-cards">
            <div className="designation-item">
              <div className="desig-info">
                <span className="desig-title">Full Professor</span>
                <span className="desig-sub">Senior Faculty & Research Chairs</span>
              </div>
              <span className="desig-badge badge-prof">{totalProfessors}</span>
            </div>

            <div className="designation-item">
              <div className="desig-info">
                <span className="desig-title">Associate Professor</span>
                <span className="desig-sub">Mid-career instructional leaders</span>
              </div>
              <span className="desig-badge badge-assoc">{totalAssociateProfessors}</span>
            </div>

            <div className="designation-item">
              <div className="desig-info">
                <span className="desig-title">Assistant Professor / Lecturer</span>
                <span className="desig-sub">Emerging researchers & educators</span>
              </div>
              <span className="desig-badge badge-asst">{totalAssistantProfessors}</span>
            </div>

            <div className="quick-nav-box">
              <p>Explore detailed bios, contact numbers, and qualifications:</p>
              <button className="btn-link" onClick={onViewFaculty}>
                Go to Full Faculty Directory <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Faculty Additions */}
      <div className="dashboard-panel mt-6">
        <div className="panel-header">
          <h4 className="panel-title">Recently Appointed / Updated Faculty</h4>
          <button className="btn-link" onClick={onViewFaculty}>
            View All ({totalFaculty}) <ArrowRight size={16} />
          </button>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Experience</th>
                <th>Specialization</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentFaculty.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">No faculty records found.</td>
                </tr>
              ) : (
                recentFaculty.map((f) => (
                  <tr key={f.id}>
                    <td className="font-mono text-muted">#{f.id}</td>
                    <td className="font-semibold text-primary">{f.name}</td>
                    <td>{f.department}</td>
                    <td>
                      <span className={`pill-badge ${f.designation.includes('Professor') ? 'pill-blue' : 'pill-gray'}`}>
                        {f.designation}
                      </span>
                    </td>
                    <td>{f.experience} yrs</td>
                    <td className="text-muted">{f.specialization}</td>
                    <td>
                      <button className="btn-table-action" onClick={() => onViewProfile(f)}>
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
