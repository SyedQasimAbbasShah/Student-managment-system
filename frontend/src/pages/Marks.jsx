import React, { useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Award, Plus, CheckCircle } from 'lucide-react';

const Marks = () => {
  const { isStudent } = useContext(AuthContext);
  const [marks, setMarks] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    course: '',
    student: '',
    exam_name: 'Midterm Exam',
    marks_obtained: '',
    total_marks: 100,
    remarks: 'Good',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const resMarks = await API.get('marks/');
      setMarks(resMarks.data);

      if (!isStudent) {
        const [resC, resS] = await Promise.all([
          API.get('courses/'),
          API.get('students/')
        ]);
        setCourses(resC.data);
        setStudents(resS.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMark = async (e) => {
    e.preventDefault();
    try {
      await API.post('marks/', form);
      setShowModal(false);
      setForm({ course: '', student: '', exam_name: 'Midterm Exam', marks_obtained: '', total_marks: 100, remarks: '' });
      fetchData();
    } catch (err) {
      alert('Error entering examination marks.');
    }
  };

  const getGradeBadge = (grade) => {
    switch (grade) {
      case 'A+': case 'A': return 'bg-success';
      case 'B': return 'bg-primary';
      case 'C': return 'bg-info text-dark';
      case 'D': return 'bg-warning text-dark';
      case 'F': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  return (
    <div className="p-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">{isStudent ? 'My Academic Transcript' : 'Marks & Grade Evaluation'}</h2>
          <p className="text-muted">{isStudent ? 'View examination results, letter grades, and academic feedback.' : 'Record examination results and automatically calculate letter grades.'}</p>
        </div>
        {!isStudent && (
          <button className="btn btn-primary d-flex align-items-center gap-2 fw-semibold px-3 py-2 rounded-3" onClick={() => setShowModal(true)}>
            <Plus size={18} />
            Enter Exam Marks
          </button>
        )}
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
                  <th>Student</th>
                  <th>Course</th>
                  <th>Exam Name</th>
                  <th>Marks Obtained</th>
                  <th>Total Marks</th>
                  <th>Grade</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {marks.map(m => (
                  <tr key={m.id}>
                    <td>
                      <div className="fw-bold">{m.student_name}</div>
                      <div className="small text-muted">{m.student_roll}</div>
                    </td>
                    <td>
                      <div className="fw-semibold text-primary">{m.course_code}</div>
                      <div className="small text-muted">{m.course_title}</div>
                    </td>
                    <td className="fw-semibold">{m.exam_name}</td>
                    <td className="fw-bold">{m.marks_obtained}</td>
                    <td>{m.total_marks}</td>
                    <td>
                      <span className={`badge ${getGradeBadge(m.grade)} fs-6 px-3 py-1 rounded-pill`}>
                        {m.grade}
                      </span>
                    </td>
                    <td className="text-muted small">{m.remarks || '-'}</td>
                  </tr>
                ))}
                {marks.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center text-muted py-4">No examination mark records found.</td>
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
                <h5 className="modal-title fw-bold">Enter Student Exam Marks</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleCreateMark}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Select Course</label>
                    <select className="form-select" required value={form.course} onChange={(e) => setForm({...form, course: e.target.value})}>
                      <option value="">Select Course</option>
                      {courses.map(c => (
                        <option key={c.id} value={c.id}>{c.code} - {c.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Select Student</label>
                    <select className="form-select" required value={form.student} onChange={(e) => setForm({...form, student: e.target.value})}>
                      <option value="">Select Student</option>
                      {students.map(s => (
                        <option key={s.id} value={s.id}>{s.user?.first_name} {s.user?.last_name} ({s.roll_number})</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Exam Name</label>
                    <input type="text" className="form-control" placeholder="e.g. Midterm / Quiz 1 / Final Exam" required value={form.exam_name} onChange={(e) => setForm({...form, exam_name: e.target.value})} />
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Marks Obtained</label>
                      <input type="number" step="0.1" className="form-control" required value={form.marks_obtained} onChange={(e) => setForm({...form, marks_obtained: e.target.value})} />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Total Marks</label>
                      <input type="number" step="0.1" className="form-control" required value={form.total_marks} onChange={(e) => setForm({...form, total_marks: e.target.value})} />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Remarks</label>
                    <input type="text" className="form-control" placeholder="e.g. Excellent / Satisfactory" value={form.remarks} onChange={(e) => setForm({...form, remarks: e.target.value})} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary fw-semibold">Save & Calculate Grade</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marks;
