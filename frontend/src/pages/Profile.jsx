import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, Shield, Building2, Calendar, Award } from 'lucide-react';

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="fw-bold text-dark mb-1">User Profile</h2>
        <p className="text-muted">Account details and personal information.</p>
      </div>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 text-center p-4">
            <div className="bg-primary text-white p-4 rounded-circle d-inline-flex mx-auto mb-3 shadow-sm" style={{ width: '100px', height: '100px', alignItems: 'center', justifyContent: 'center' }}>
              <User size={50} />
            </div>
            <h4 className="fw-bold text-dark mb-1">{user.first_name || user.username} {user.last_name}</h4>
            <p className="text-muted mb-2">@{user.username}</p>
            <div>
              <span className="badge bg-primary px-3 py-2 text-uppercase fs-6 fw-bold rounded-pill">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <h5 className="fw-bold text-dark mb-4 border-bottom pb-2">Account Overview</h5>
            <div className="row g-3">
              <div className="col-6">
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-light p-2.5 rounded-3 text-primary"><Mail size={20} /></div>
                  <div>
                    <div className="text-muted small fw-semibold">Email Address</div>
                    <div className="fw-semibold text-dark">{user.email || 'N/A'}</div>
                  </div>
                </div>
              </div>

              <div className="col-6">
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-light p-2.5 rounded-3 text-success"><Phone size={20} /></div>
                  <div>
                    <div className="text-muted small fw-semibold">Contact Phone</div>
                    <div className="fw-semibold text-dark">{user.phone || 'N/A'}</div>
                  </div>
                </div>
              </div>

              <div className="col-6">
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-light p-2.5 rounded-3 text-warning"><Building2 size={20} /></div>
                  <div>
                    <div className="text-muted small fw-semibold">Department</div>
                    <div className="fw-semibold text-dark">{user.department || 'Unassigned'}</div>
                  </div>
                </div>
              </div>

              {user.roll_number && (
                <div className="col-6">
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-light p-2.5 rounded-3 text-info"><Award size={20} /></div>
                    <div>
                      <div className="text-muted small fw-semibold">Roll Number</div>
                      <div className="fw-bold text-primary">{user.roll_number}</div>
                    </div>
                  </div>
                </div>
              )}

              {user.employee_id && (
                <div className="col-6">
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-light p-2.5 rounded-3 text-info"><Award size={20} /></div>
                    <div>
                      <div className="text-muted small fw-semibold">Employee ID</div>
                      <div className="fw-bold text-success">{user.employee_id}</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="col-12 mt-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-light p-2.5 rounded-3 text-secondary"><MapPin size={20} /></div>
                  <div>
                    <div className="text-muted small fw-semibold">Address</div>
                    <div className="fw-semibold text-dark">{user.address || 'Not specified'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
