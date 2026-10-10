import React, { useState } from 'react';
import { X, Lock, Mail, KeyRound, ShieldAlert, Sparkles } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onLogin, loading }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Both email and password are required');
      return;
    }
    setError('');
    try {
      await onLogin(email.trim(), password);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const fillDemoAdmin = () => {
    setEmail('admin@university.edu');
    setPassword('Admin@123');
    setError('');
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card modal-login-card">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Lock className="text-blue-600" size={22} />
            <h3 className="modal-title">Administrator Portal Authentication</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} disabled={loading}>
            <X size={20} />
          </button>
        </div>

        <div className="login-modal-body">
          <p className="login-intro">
            Administrative privileges are required to create, update, or remove university faculty records.
          </p>

          {/* Quick Demo Credentials Pill */}
          <div className="demo-credentials-pill">
            <div className="demo-header">
              <Sparkles size={14} className="text-amber-500" />
              <span>Initial Admin Credentials</span>
            </div>
            <p className="demo-details">
              Email: <code>admin@university.edu</code> | Password: <code>Admin@123</code>
            </p>
            <button
              type="button"
              className="btn-demo-autofill"
              onClick={fillDemoAdmin}
            >
              Fill Credentials Automatically
            </button>
          </div>

          {error && (
            <div className="alert-box mb-4">
              <ShieldAlert size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group mb-4">
              <label className="form-label">Email Address</label>
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
                  className="form-input with-left-icon"
                  placeholder="admin@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group mb-6">
              <label className="form-label">Password</label>
              <div className="input-with-icon">
                <KeyRound size={16} className="input-icon" />
                <input
                  type="password"
                  className="form-input with-left-icon"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="modal-footer px-0 pb-0">
              <button
                type="button"
                className="btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Sign In as Admin'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
