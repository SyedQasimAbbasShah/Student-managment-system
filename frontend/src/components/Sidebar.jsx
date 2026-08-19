import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Users, GraduationCap, BookOpen, Building2, CalendarCheck, Award, UserCheck } from 'lucide-react';

const Sidebar = () => {
  const { user, isAdmin, isTeacher, isStudent } = useContext(AuthContext);

  const linkClass = ({ isActive }) =>
    `nav-link d-flex align-items-center gap-3 py-3 px-4 text-dark rounded-3 font-semibold ${
      isActive ? 'bg-primary text-white shadow-sm fw-bold' : 'hover-bg-light text-secondary'
    }`;

  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 bg-white border-end shadow-sm" style={{ width: '260px', minHeight: 'calc(100vh - 60px)' }}>
      <div className="nav nav-pills flex-column gap-2">
        <NavLink to="/dashboard" className={linkClass}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        {(isAdmin || isTeacher) && (
          <NavLink to="/students" className={linkClass}>
            <Users size={20} />
            <span>Students</span>
          </NavLink>
        )}

        {isAdmin && (
          <NavLink to="/teachers" className={linkClass}>
            <UserCheck size={20} />
            <span>Teachers</span>
          </NavLink>
        )}

        <NavLink to="/courses" className={linkClass}>
          <BookOpen size={20} />
          <span>Courses</span>
        </NavLink>

        {isAdmin && (
          <NavLink to="/departments" className={linkClass}>
            <Building2 size={20} />
            <span>Departments</span>
          </NavLink>
        )}

        <NavLink to="/attendance" className={linkClass}>
          <CalendarCheck size={20} />
          <span>Attendance</span>
        </NavLink>

        <NavLink to="/marks" className={linkClass}>
          <Award size={20} />
          <span>Marks & Grades</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
