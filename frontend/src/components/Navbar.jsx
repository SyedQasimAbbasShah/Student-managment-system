import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { GraduationCap, LogOut, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'ADMIN': return 'bg-danger';
      case 'TEACHER': return 'bg-success';
      case 'STUDENT': return 'bg-primary';
      default: return 'bg-secondary';
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 shadow-sm">
      <Link className="navbar-brand d-flex align-items-center gap-2 font-weight-bold" to="/">
        <GraduationCap size={28} className="text-primary" />
        <span className="fs-4 fw-bold tracking-tight text-white">EduManager SMS</span>
      </Link>
      
      <div className="ms-auto d-flex align-items-center gap-3">
        {user && (
          <>
            <span className={`badge ${getRoleBadgeColor(user.role)} px-3 py-2 text-uppercase fs-6 fw-bold rounded-pill`}>
              {user.role}
            </span>
            <Link to="/profile" className="text-decoration-none text-light d-flex align-items-center gap-2">
              <UserIcon size={20} className="text-info" />
              <span className="fw-semibold">{user.first_name || user.username}</span>
            </Link>
            <button className="btn btn-outline-light btn-sm d-flex align-items-center gap-1 ms-2" onClick={logout}>
              <LogOut size={16} />
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
