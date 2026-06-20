import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const ManageAdmins = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (!token || user?.role !== 'super_admin') {
      navigate('/');
      return;
    }
    axios.get('https://saarang-event-hub-5c2b.onrender.com/api/auth/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setUsers(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [token, navigate, user]);

  const makeAdmin = async (userId) => {
    setMessage({ text: '', type: '' });
    try {
      const res = await axios.patch(
        `https://saarang-event-hub-5c2b.onrender.com/api/auth/make-admin/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage({ text: res.data.message || 'User promoted to admin', type: 'success' });
      setUsers(users.map(u => u._id === userId ? { ...u, role: 'admin' } : u));
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Failed to promote user', type: 'error' });
    }
  };

  const removeAdmin = async (userId) => {
    setMessage({ text: '', type: '' });
    try {
      const res = await axios.patch(
        `https://saarang-event-hub-5c2b.onrender.com/api/auth/remove-admin/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage({ text: res.data.message || 'Admin privileges removed', type: 'success' });
      setUsers(users.map(u => u._id === userId ? { ...u, role: 'user' } : u));
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Failed to remove admin', type: 'error' });
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading users...</div>;

  return (
    <>
      <div className="admin-section">
        
        {message.text && (
          <div style={{ maxWidth: '1000px', margin: '0 auto 16px' }}>
            <div className={`alert alert-${message.type}`}>{message.text}</div>
          </div>
        )}

        <div className="tbl-card">
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td style={{ fontWeight: '600' }}>{u.username}</td>
                  <td style={{ color: 'rgba(28,10,8,0.5)' }}>{u.email}</td>
                  <td>
                    <span className={`badge badge-${u.role === 'super_admin' ? 'super' : u.role === 'admin' ? 'admin' : 'user'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    {/* Assuming user context stores the ID in user.id or user._id */}
                    {u._id === user?.id || u._id === user?._id ? (
                      <span style={{ color: 'rgba(28,10,8,0.3)', fontSize: '11px', fontWeight: '600' }}>You</span>
                    ) : u.role === 'admin' ? (
                      <button className="act-btn act-rem" onClick={() => removeAdmin(u._id)}>
                        Remove Admin
                      </button>
                    ) : u.role === 'user' ? (
                      <button className="act-btn act-make" onClick={() => makeAdmin(u._id)}>
                        Make Admin
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ManageAdmins;