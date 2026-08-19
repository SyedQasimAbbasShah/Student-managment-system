import React, { useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Users, UserCheck, BookOpen, Building2, CalendarCheck, Award, TrendingUp, Clock } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get('dashboard/');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="fw-bold text-dark mb-1">Welcome back, {user?.first_name || user?.username}!</h2>
        <p className="text-muted">Overview and academic performance metrics.</p>
      </div>

      {stats?.role === 'ADMIN' && (
        <>
          <div className="row g-4 mb-4">
            <div className="col-md-3">
              <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <span className="text-muted small fw-semibold">Total Students</span>
                    <h3 className="fw-bold text-primary mb-0 mt-1">{stats.total_students}</h3>
                  </div>
                  <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary">
                    <Users size={24} />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <span className="text-muted small fw-semibold">Total Teachers</span>
                    <h3 className="fw-bold text-success mb-0 mt-1">{stats.total_teachers}</h3>
                  </div>
                  <div className="bg-success bg-opacity-10 p-3 rounded-circle text-success">
                    <UserCheck size={24} />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <span className="text-muted small fw-semibold">Total Courses</span>
                    <h3 className="fw-bold text-warning mb-0 mt-1">{stats.total_courses}</h3>
                  </div>
                  <div className="bg-warning bg-opacity-10 p-3 rounded-circle text-warning">
                    <BookOpen size={24} />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <span className="text-muted small fw-semibold">Average Attendance</span>
                    <h3 className="fw-bold text-info mb-0 mt-1">{stats.average_attendance}%</h3>
                  </div>
                  <div className="bg-info bg-opacity-10 p-3 rounded-circle text-info">
                    <CalendarCheck size={24} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-4 p-4">
            <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <Clock size={20} className="text-primary" />
              Recent Student Registrations
            </h5>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Roll Number</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Academic Year</th>
                    <th>Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent_students?.map((s) => (
                    <tr key={s.id}>
                      <td className="fw-bold text-primary">{s.roll_number}</td>
                      <td>{s.user?.first_name} {s.user?.last_name}</td>
                      <td><span className="badge bg-light text-dark border">{s.department_name || 'N/A'}</span></td>
                      <td>{s.academic_year}</td>
                      <td><span className="badge bg-success">{s.attendance_percentage}%</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {stats?.role === 'TEACHER' && (
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted small fw-semibold">Assigned Courses</span>
                  <h3 className="fw-bold text-primary mb-0 mt-1">{stats.assigned_courses_count}</h3>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary">
                  <BookOpen size={24} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted small fw-semibold">Students Taught</span>
                  <h3 className="fw-bold text-success mb-0 mt-1">{stats.total_students_taught}</h3>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded-circle text-success">
                  <Users size={24} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted small fw-semibold">Marks Entries</span>
                  <h3 className="fw-bold text-warning mb-0 mt-1">{stats.marks_entered_count}</h3>
                </div>
                <div className="bg-warning bg-opacity-10 p-3 rounded-circle text-warning">
                  <Award size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {stats?.role === 'STUDENT' && (
        <>
          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <span className="text-muted small fw-semibold">Enrolled Courses</span>
                    <h3 className="fw-bold text-primary mb-0 mt-1">{stats.enrolled_courses}</h3>
                  </div>
                  <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary">
                    <BookOpen size={24} />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <span className="text-muted small fw-semibold">Attendance Rate</span>
                    <h3 className="fw-bold text-success mb-0 mt-1">{stats.attendance_percentage}%</h3>
                  </div>
                  <div className="bg-success bg-opacity-10 p-3 rounded-circle text-success">
                    <CalendarCheck size={24} />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <span className="text-muted small fw-semibold">Attendance Sessions</span>
                    <h3 className="fw-bold text-info mb-0 mt-1">{stats.total_attendance_sessions}</h3>
                  </div>
                  <div className="bg-info bg-opacity-10 p-3 rounded-circle text-info">
                    <TrendingUp size={24} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-4 p-4">
            <h5 className="fw-bold text-dark mb-3">Recent Marks & Evaluation</h5>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Course</th>
                    <th>Exam Name</th>
                    <th>Marks Obtained</th>
                    <th>Total</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent_marks?.map((m) => (
                    <tr key={m.id}>
                      <td className="fw-bold text-primary">{m.course_code}</td>
                      <td>{m.exam_name}</td>
                      <td>{m.marks_obtained}</td>
                      <td>{m.total_marks}</td>
                      <td><span className="badge bg-success fs-6">{m.grade}</span></td>
                    </tr>
                  ))}
                  {(!stats.recent_marks || stats.recent_marks.length === 0) && (
                    <tr>
                      <td colSpan="5" className="text-center text-muted py-3">No exam evaluation results recorded yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
