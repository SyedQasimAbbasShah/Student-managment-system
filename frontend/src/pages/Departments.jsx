import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Building2, Plus, Users, BookOpen, UserCheck } from 'lucide-react';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    code: '',
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await API.get('departments/');
      setDepartments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await API.post('departments/', form);
      setShowModal(false);
      setForm({ code: '', name: '', description: '' });
      fetchDepartments();
    } catch (err) {
      alert('Failed to create department.');
    }
  };

  return (
    <div className="p-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Academic Departments</h2>
          <p className="text-muted">Manage academic faculties, courses, and department allocations.</p>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2 fw-semibold px-3 py-2 rounded-3" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          Add Department
        </button>
      </div>

      {loading ? (
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : (
        <div className="row g-4">
          {departments.map((d) => (
            <div className="col-md-4" key={d.id}>
              <div className="card border-0 shadow-sm rounded-4 h-100 p-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="badge bg-dark fs-6 px-3 py-1 rounded-pill">{d.code}</span>
                  <Building2 size={24} className="text-primary" />
                </div>
                <h5 className="fw-bold text-dark mb-2">{d.name}</h5>
                <p className="text-muted small mb-4">{d.description || 'No description provided.'}</p>
                <div className="mt-auto pt-3 border-top d-flex justify-content-between text-muted small">
                  <span><strong>{d.student_count}</strong> Students</span>
                  <span><strong>{d.teacher_count}</strong> Teachers</span>
                  <span><strong>{d.course_count}</strong> Courses</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Add Academic Department</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleCreate}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Department Code</label>
                    <input type="text" className="form-control" placeholder="e.g. CS" required value={form.code} onChange={(e) => setForm({...form, code: e.target.value})} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Department Name</label>
                    <input type="text" className="form-control" placeholder="e.g. Computer Science" required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Description</label>
                    <textarea className="form-control" rows="3" placeholder="Department overview..." value={form.description} onChange={(e) => setForm({...form, description: e.target.value})}></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary fw-semibold">Create Department</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;
