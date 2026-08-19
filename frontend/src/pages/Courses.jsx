import React, { useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, Plus, UserPlus, Users, Building2 } from 'lucide-react';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');

  const [courseForm, setCourseForm] = useState({
    code: '',
    title: '',
    credits: 3,
    department: '',
    teacher: '',
  });

  const { isAdmin, isTeacher } = useContext(AuthContext);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resC, resD, resT, resS] = await Promise.all([
        API.get('courses/'),
        API.get('departments/'),
        API.get('teachers/'),
        API.get('students/')
      ]);
      setCourses(resC.data);
      setDepartments(resD.data);
      setTeachers(resT.data);
      setStudents(resS.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await API.post('courses/', courseForm);
      setShowCourseModal(false);
      setCourseForm({ code: '', title: '', credits: 3, department: '', teacher: '' });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Error creating course');
    }
  };

  const handleEnrollStudent = async (e) => {
    e.preventDefault();
    if (!selectedCourseId || !selectedStudentId) return;
    try {
      await API.post('enrollments/', {
        course: selectedCourseId,
        student: selectedStudentId,
      });
      setShowEnrollModal(false);
      setSelectedCourseId('');
      setSelectedStudentId('');
      fetchData();
      alert('Student successfully enrolled in course.');
    } catch (err) {
      alert('Student is already enrolled or invalid selection.');
    }
  };

  return (
    <div className="p-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Course Catalogue</h2>
          <p className="text-muted">Manage active courses, faculty assignments, and student enrollments.</p>
        </div>
        <div className="d-flex gap-2">
          {(isAdmin || isTeacher) && (
            <button className="btn btn-outline-primary d-flex align-items-center gap-2 fw-semibold px-3 py-2 rounded-3" onClick={() => setShowEnrollModal(true)}>
              <UserPlus size={18} />
              Enroll Student
            </button>
          )}
          {isAdmin && (
            <button className="btn btn-primary d-flex align-items-center gap-2 fw-semibold px-3 py-2 rounded-3" onClick={() => setShowCourseModal(true)}>
              <Plus size={18} />
              Create Course
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : (
        <div className="row g-4">
          {courses.map((c) => (
            <div className="col-md-4" key={c.id}>
              <div className="card border-0 shadow-sm rounded-4 h-100 p-3">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="badge bg-primary fs-6 px-3 py-1 rounded-pill">{c.code}</span>
                  <span className="text-muted small fw-semibold">{c.credits} Credits</span>
                </div>
                <h5 className="fw-bold text-dark mb-2">{c.title}</h5>
                <div className="mb-3 text-muted small">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <Building2 size={16} className="text-primary" />
                    <span>Department: <strong>{c.department_name}</strong></span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <BookOpen size={16} className="text-success" />
                    <span>Teacher: <strong>{c.teacher_name}</strong></span>
                  </div>
                </div>
                <div className="mt-auto pt-3 border-top d-flex align-items-center justify-content-between">
                  <span className="badge bg-light text-dark border d-flex align-items-center gap-1">
                    <Users size={14} />
                    {c.enrolled_students_count} Enrolled Students
                  </span>
                </div>
              </div>
            </div>
          ))}
          {courses.length === 0 && (
            <div className="col-12">
              <div className="card border-0 shadow-sm p-4 text-center text-muted">
                No active courses found in catalogue.
              </div>
            </div>
          )}
        </div>
      )}

      {showCourseModal && (
        <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Create New Course</h5>
                <button type="button" className="btn-close" onClick={() => setShowCourseModal(false)}></button>
              </div>
              <form onSubmit={handleCreateCourse}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Course Code</label>
                    <input type="text" className="form-control" placeholder="e.g. CS301" required value={courseForm.code} onChange={(e) => setCourseForm({...courseForm, code: e.target.value})} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Course Title</label>
                    <input type="text" className="form-control" placeholder="e.g. Data Structures & Algorithms" required value={courseForm.title} onChange={(e) => setCourseForm({...courseForm, title: e.target.value})} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Credits</label>
                    <input type="number" min="1" max="6" className="form-control" required value={courseForm.credits} onChange={(e) => setCourseForm({...courseForm, credits: e.target.value})} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Department</label>
                    <select className="form-select" required value={courseForm.department} onChange={(e) => setCourseForm({...courseForm, department: e.target.value})}>
                      <option value="">Select Department</option>
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Assign Teacher (Optional)</label>
                    <select className="form-select" value={courseForm.teacher} onChange={(e) => setCourseForm({...courseForm, teacher: e.target.value})}>
                      <option value="">Unassigned</option>
                      {teachers.map((t) => (
                        <option key={t.id} value={t.id}>{t.user?.first_name} {t.user?.last_name} ({t.employee_id})</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowCourseModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary fw-semibold">Create Course</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showEnrollModal && (
        <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Enroll Student in Course</h5>
                <button type="button" className="btn-close" onClick={() => setShowEnrollModal(false)}></button>
              </div>
              <form onSubmit={handleEnrollStudent}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Select Course</label>
                    <select className="form-select" required value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)}>
                      <option value="">Select Course</option>
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>{c.code} - {c.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Select Student</label>
                    <select className="form-select" required value={selectedStudentId} onChange={(e) => setSelectedStudentId(e.target.value)}>
                      <option value="">Select Student</option>
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>{s.user?.first_name} {s.user?.last_name} ({s.roll_number})</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowEnrollModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary fw-semibold">Confirm Enrollment</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;
