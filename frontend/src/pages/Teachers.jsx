import React, { useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { UserCheck, Plus, Search, Award, BookOpen } from 'lucide-react';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { isAdmin } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    first_name: '',
    last_name: '',
    employee_id: '',
    department_id: '',
    qualification: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resTch, resDept] = await Promise.all([
        API.get('teachers/'),
        API.get('departments/')
      ]);
      setTeachers(resTch.data);
      setDepartments(resDept.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await API.post('accounts/register/', {
        ...formData,
        role: 'TEACHER',
      });
      setShowModal(false);
      setFormData({ username: '', password: '', email: '', first_name: '', last_name: '', employee_id: '', department_id: '', qualification: '' });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to register teacher.');
    }
  };

  const filteredTeachers = teachers.filter((t) => {
    const name = `${t.user?.first_name} ${t.user?.last_name}`.toLowerCase();
    const emp = (t.employee_id || '').toLowerCase();
    const query = search.toLowerCase();
    return name.includes(query) || emp.includes(query);
  });

  return (
    <div className="p-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Teacher Directory</h2>
          <p className="text-muted">Faculty profiles, qualifications, and course assignments.</p>
        </div>
        {isAdmin && (
          <button className="btn btn-success d-flex align-items-center gap-2 fw-semibold px-3 py-2 rounded-3" onClick={() => setShowModal(true)}>
            <Plus size={18} />
            Register Teacher
          </button>
        )}
      </div>

      <div className="card border-0 shadow-sm rounded-4 p-3 mb-4">
        <div className="input-group">
          <span className="input-group-text bg-white border-end-0">
            <Search size={18} className="text-muted" />
          </span>
          <input
            type="text"
            className="form-control border-start-0 ps-0"
            placeholder="Search by teacher name or employee ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center p-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Employee ID</th>
                  <th>Teacher Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Qualification</th>
                  <th>Assigned Courses</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeachers.map((t) => (
                  <tr key={t.id}>
                    <td className="fw-bold text-success">{t.employee_id}</td>
                    <td className="fw-semibold">{t.user?.first_name} {t.user?.last_name}</td>
                    <td className="text-muted">{t.user?.email || 'N/A'}</td>
                    <td><span className="badge bg-light text-dark border">{t.department_name || 'Unassigned'}</span></td>
                    <td>{t.qualification || 'N/A'}</td>
                    <td><span className="badge bg-info text-dark">{t.courses_count} courses</span></td>
                  </tr>
                ))}
                {filteredTeachers.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">No teacher records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Register New Teacher</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleCreate}>
                <div className="modal-body">
                  {error && (
                    <div className="alert alert-danger py-2 px-3 mb-3 text-sm">
                      <small>{error}</small>
                    </div>
                  )}
                  <div className="row g-2 mb-2">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">First Name</label>
                      <input type="text" className="form-control" required value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Last Name</label>
                      <input type="text" className="form-control" required value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} />
                    </div>
                  </div>
                  <div className="mb-2">
                    <label className="form-label small fw-semibold">Username</label>
                    <input type="text" className="form-control" required value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label small fw-semibold">Password</label>
                    <input type="password" className="form-control" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label small fw-semibold">Email</label>
                    <input type="email" className="form-control" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label small fw-semibold">Employee ID</label>
                    <input type="text" className="form-control" placeholder="e.g. EMP-1003" value={formData.employee_id} onChange={(e) => setFormData({...formData, employee_id: e.target.value})} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label small fw-semibold">Qualification</label>
                    <input type="text" className="form-control" placeholder="e.g. Ph.D / M.Tech" value={formData.qualification} onChange={(e) => setFormData({...formData, qualification: e.target.value})} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label small fw-semibold">Department</label>
                    <select className="form-select" value={formData.department_id} onChange={(e) => setFormData({...formData, department_id: e.target.value})}>
                      <option value="">Select Department</option>
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-success fw-semibold">Register Teacher</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teachers;
