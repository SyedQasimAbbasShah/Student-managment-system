import React, { useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { CalendarCheck, Save, CheckCircle, XCircle, Clock } from 'lucide-react';

const Attendance = () => {
  const { user, isStudent } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      if (isStudent) {
        const resAtt = await API.get('attendance/');
        setHistory(resAtt.data);
      } else {
        const resC = await API.get('courses/');
        setCourses(resC.data);
        if (resC.data.length > 0) {
          setSelectedCourse(resC.data[0].id);
          fetchStudentsForCourse(resC.data[0].id, selectedDate);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentsForCourse = async (courseId, dateVal) => {
    setLoading(true);
    try {
      const [resEnr, resAtt] = await Promise.all([
        API.get(`enrollments/?course=${courseId}`),
        API.get(`attendance/?course=${courseId}&date=${dateVal}`)
      ]);
      const studs = resEnr.data;
      setEnrolledStudents(studs);

      const existingMap = {};
      resAtt.data.forEach(att => {
        existingMap[att.student] = att.status;
      });

      const initialMap = {};
      studs.forEach(item => {
        initialMap[item.student] = existingMap[item.student] || 'PRESENT';
      });
      setAttendanceMap(initialMap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseChange = (e) => {
    const cId = e.target.value;
    setSelectedCourse(cId);
    if (cId) {
      fetchStudentsForCourse(cId, selectedDate);
    }
  };

  const handleDateChange = (e) => {
    const dVal = e.target.value;
    setSelectedDate(dVal);
    if (selectedCourse) {
      fetchStudentsForCourse(selectedCourse, dVal);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceMap(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSaveAttendance = async () => {
    if (!selectedCourse || !selectedDate) return;
    setSaving(true);
    try {
      const records = Object.keys(attendanceMap).map(studentId => ({
        student_id: parseInt(studentId),
        status: attendanceMap[studentId]
      }));

      await API.post('attendance/bulk-mark/', {
        course_id: selectedCourse,
        date: selectedDate,
        records: records
      });

      alert('Daily attendance successfully recorded!');
    } catch (err) {
      alert('Error saving attendance records.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="fw-bold text-dark mb-1">Attendance Tracker</h2>
        <p className="text-muted">Record and monitor daily classroom attendance.</p>
      </div>

      {isStudent ? (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="card-header bg-white py-3 border-0">
            <h5 className="fw-bold text-dark mb-0">My Attendance History</h5>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Date</th>
                  <th>Course Code</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map(item => (
                  <tr key={item.id}>
                    <td className="fw-bold">{item.date}</td>
                    <td className="text-primary fw-semibold">{item.course_code}</td>
                    <td>
                      {item.status === 'PRESENT' && <span className="badge bg-success"><CheckCircle size={14} className="me-1" />Present</span>}
                      {item.status === 'ABSENT' && <span className="badge bg-danger"><XCircle size={14} className="me-1" />Absent</span>}
                      {item.status === 'LATE' && <span className="badge bg-warning text-dark"><Clock size={14} className="me-1" />Late</span>}
                    </td>
                  </tr>
                ))}
                {history.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center text-muted py-4">No attendance records recorded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <>
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <div className="row g-3 align-items-end">
              <div className="col-md-5">
                <label className="form-label small fw-semibold">Select Course</label>
                <select className="form-select" value={selectedCourse} onChange={handleCourseChange}>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.code} - {c.title}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-semibold">Date</label>
                <input type="date" className="form-control" value={selectedDate} onChange={handleDateChange} />
              </div>
              <div className="col-md-3">
                <button className="btn btn-primary w-100 fw-semibold d-flex align-items-center justify-content-center gap-2 py-2" onClick={handleSaveAttendance} disabled={saving || enrolledStudents.length === 0}>
                  <Save size={18} />
                  {saving ? 'Saving...' : 'Save Attendance'}
                </button>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Roll Number</th>
                    <th>Student Name</th>
                    <th>Attendance Status</th>
                  </tr>
                </thead>
                <tbody>
                  {enrolledStudents.map(item => (
                    <tr key={item.id}>
                      <td className="fw-bold text-primary">{item.student_roll}</td>
                      <td className="fw-semibold">{item.student_name}</td>
                      <td>
                        <div className="btn-group" role="group">
                          <button
                            type="button"
                            className={`btn btn-sm ${attendanceMap[item.student] === 'PRESENT' ? 'btn-success' : 'btn-outline-success'}`}
                            onClick={() => handleStatusChange(item.student, 'PRESENT')}
                          >
                            Present
                          </button>
                          <button
                            type="button"
                            className={`btn btn-sm ${attendanceMap[item.student] === 'ABSENT' ? 'btn-danger' : 'btn-outline-danger'}`}
                            onClick={() => handleStatusChange(item.student, 'ABSENT')}
                          >
                            Absent
                          </button>
                          <button
                            type="button"
                            className={`btn btn-sm ${attendanceMap[item.student] === 'LATE' ? 'btn-warning text-dark' : 'btn-outline-warning text-dark'}`}
                            onClick={() => handleStatusChange(item.student, 'LATE')}
                          >
                            Late
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {enrolledStudents.length === 0 && (
                    <tr>
                      <td colSpan="3" className="text-center text-muted py-4">No students enrolled in this course.</td>
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

export default Attendance;
