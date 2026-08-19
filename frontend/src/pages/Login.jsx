import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { GraduationCap, Lock, User, LogIn, AlertCircle } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid username or password credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoUser, demoPass) => {
    setUsername(demoUser);
    setPassword(demoPass);
    setError('');
    setLoading(true);
    try {
      await login(demoUser, demoPass);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to login with demo account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light px-3">
      <div className="card border-0 shadow-lg p-4 rounded-4" style={{ maxWidth: '450px', width: '100%' }}>
        <div className="text-center mb-4">
          <div className="bg-primary text-white p-3 rounded-circle d-inline-flex mb-3 shadow">
            <GraduationCap size={40} />
          </div>
          <h2 className="fw-bold text-dark mb-1">Student Management</h2>
          <p className="text-muted">Centralized Academic Portal</p>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 mb-3 rounded-3" role="alert">
            <AlertCircle size={18} />
            <small>{error}</small>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold text-secondary">Username</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <User size={18} className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold text-secondary">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <Lock size={18} className="text-muted" />
              </span>
              <input
                type="password"
                className="form-control border-start-0 ps-0"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2.5 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2" disabled={loading}>
            <LogIn size={20} />
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 pt-3 border-top text-center">
          <p className="text-muted small fw-semibold mb-2">Quick Demo Accounts:</p>
          <div className="d-flex flex-wrap justify-content-center gap-2">
            <button className="btn btn-outline-danger btn-sm rounded-pill px-3" onClick={() => handleQuickLogin('admin', 'adminpassword')}>
              Admin
            </button>
            <button className="btn btn-outline-success btn-sm rounded-pill px-3" onClick={() => handleQuickLogin('teacher1', 'teacherpassword')}>
              Teacher
            </button>
            <button className="btn btn-outline-primary btn-sm rounded-pill px-3" onClick={() => handleQuickLogin('student1', 'studentpassword')}>
              Student
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
