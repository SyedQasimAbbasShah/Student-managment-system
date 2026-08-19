import React, { useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Users, Plus, Search, User, Phone, BookOpen, AlertCircle } from 'lucide-react';

const Students = () => {
  const [students, setStudents] = useState([]);
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
    roll_number: '',
    department_id: '',
    phone: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resStu, resDept] = await Promise.all([
        API.get('students/'),
        API.get('departments/')
      ]);
      setStudents(resStu.data);
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
        role: 'STUDENT',
      });
      setShowModal(false);
      setFormData({ username: '', password: '', email: '', first_name: '', last_name: '', roll_number: '', department_id: '', phone: '' });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to register student.');
    }
  };

  const filteredStudents = students.filter((s) => {
    const name = `${s.user?.first_name} ${s.user?.last_name}`.toLowerCase();
    const roll = s.roll_number.toLowerCase();
    const query = search.toLowerCase();
    return name.includes(query) || roll.includes(query);
  });

  return (
    <div className="p-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Student Directory</h2>
          <p className="text-muted">Manage student profiles, academic records, and department allocations.</p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary d-flex align-items-center gap-2 fw-semibold px-3 py-2 rounded-3" onClick={() => setShowModal(true)}>
            <Plus size={18} />
            Register Student
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
            placeholder="Search by student name or roll number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Roll Number</th>
                  <th>Student Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Academic Year</th>
                  <th>Attendance %</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s) => (
                  <tr key={s.id}>
                    <td className="fw-bold text-primary">{s.roll_number}</td>
                    <td className="fw-semibold">{s.user?.first_name} {s.user?.last_name}</td>
                    <td className="text-muted">{s.user?.email || 'N/A'}</td>
                    <td><span className="badge bg-light text-dark border">{s.department_name || 'Unassigned'}</span></td>
                    <td>{s.academic_year}</td>
                    <td><span className="badge bg-success fs-6">{s.attendance_percentage}%</span></td>
                  </tr>
                ))}
                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">No student records found.</td>
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
                <h5 className="modal-title fw-bold">Register New Student</h5>
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
                    <label className="form-label small fw-semibold">Roll Number</label>
                    <input type="text" className="form-control" placeholder="e.g. STU-2024-005" value={formData.roll_number} onChange={(e) => setFormData({...formData, roll_number: e.target.value})} />
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
                  <button type="submit" className="btn btn-primary fw-semibold">Register Student</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
