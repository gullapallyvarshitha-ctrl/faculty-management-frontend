import React from 'react';
import { GraduationCap, LayoutDashboard, Users, Building2, LogIn, LogOut, ShieldCheck, ShieldAlert } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, user, onOpenLogin, onLogout }) {
  return (
    <header className="navbar-container">
      <div className="navbar-content">
        <div className="brand-section">
          <div className="brand-logo">
            <GraduationCap className="icon-logo" />
          </div>
          <div>
            <h1 className="brand-title">Faculty Management Portal</h1>
            <p className="brand-subtitle">University Academic Administration System</p>
          </div>
        </div>

        <nav className="nav-links">
          <button
            className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>

          <button
            className={`nav-btn ${activeTab === 'faculty' ? 'active' : ''}`}
            onClick={() => setActiveTab('faculty')}
          >
            <Users size={18} />
            <span>Faculty Directory</span>
          </button>

          <button
            className={`nav-btn ${activeTab === 'departments' ? 'active' : ''}`}
            onClick={() => setActiveTab('departments')}
          >
            <Building2 size={18} />
            <span>Departments</span>
          </button>
        </nav>

        <div className="auth-section">
          {user ? (
            <div className="user-profile-badge">
              <div className="badge-details">
                <span className="badge-role">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  {user.role === 'ROLE_ADMIN' ? 'Admin Access' : user.role}
                </span>
                <span className="badge-name">{user.fullName || user.email}</span>
              </div>
              <button className="btn-logout" onClick={onLogout} title="Log Out">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="guest-badge-wrap">
              <span className="guest-pill" title="Read-only mode. Log in to manage records.">
                <ShieldAlert size={14} /> Read Only
              </span>
              <button className="btn-login" onClick={onOpenLogin}>
                <LogIn size={16} />
                <span>Admin Login</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
