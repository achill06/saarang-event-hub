import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import chennaiBg from '../assets/chennai.svg';

const EventDetail = () => {
  const { id } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    axios.get(`https://saarang-event-hub-5c2b.onrender.com/api/events/${id}`)
      .then(res => {
        setEvent(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    if (token) {
      axios.get('https://saarang-event-hub-5c2b.onrender.com/api/events/my/registrations', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        const alreadyRegistered = res.data.some(reg => reg.event._id === id);
        setRegistered(alreadyRegistered);
      })
      .catch(err => console.error(err));
    }
  }, [id, token]);

  const handleRegister = async () => {
    if (!token) return navigate('/login');
    setMessage({ text: '', type: '' });
    try {
      await axios.post(`https://saarang-event-hub-5c2b.onrender.com/api/events/${id}/register`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRegistered(true);
      setMessage({ text: 'Successfully registered!', type: 'success' });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Something went wrong', type: 'error' });
    }
  };

  const handleDeleteEvent = async () => {
    if (!window.confirm("Are you sure you want to permanently delete this event?")) return;
    
    try {
      await axios.delete(`https://saarang-event-hub-5c2b.onrender.com/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/');
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Failed to delete event', type: 'error' });
    }
  };

  const handleUnregister = async () => {
    setMessage({ text: '', type: '' });
    try {
      await axios.delete(`https://saarang-event-hub-5c2b.onrender.com/api/events/${id}/register`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRegistered(false);
      setMessage({ text: 'Unregistered successfully.', type: 'success' });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Something went wrong', type: 'error' });
    }
  };

  const getBadgeClass = (category) => {
    const cat = category?.toLowerCase() || 'cultural';
    switch (cat) {
      case 'dance': return 'cat-dance';
      case 'lecture': return 'cat-lecture';
      case 'music': return 'cat-music';
      case 'fine arts': return 'cat-finearts';
      case 'literary': return 'cat-literary';
      case 'dramatics': return 'cat-dramatics';
      case 'gaming': return 'cat-gaming';
      case 'workshops': return 'cat-workshops';
      case 'proshows': return 'cat-proshows';
      case 'informals': return 'cat-informals'; 
      case 'design & digital arts': return 'cat-vfx';
      default: return 'cat-cultural';
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading details...</div>;
  if (!event)  return <div style={{ padding: '40px', textAlign: 'center' }}>Event not found.</div>;

  return (
    <>
      <div className="detail">
        <div className="detail-card">
          
          <div className="detail-hero" style={{ position: 'relative' }}>
            {user && (user.role === 'admin' || user.role === 'super_admin') && (
              <button 
                className="edit-action"
                style={{ top: '20px', right: '20px', position: 'absolute' }}
                onClick={() => navigate(`/admin/edit-event/${event._id}`)}
              >
                <svg viewBox="0 0 24 24">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
                Edit
              </button>
            )}

            <img className="detail-hero-bg" src={chennaiBg} alt="Event Background" />
            <div className="detail-hero-overlay"></div>
            <div className="detail-content">
              <div className="detail-cat-row">
                <span className={`cat ${getBadgeClass(event.category)}`}>
                  {event.category || 'Cultural'}
                </span>
              </div>
              <div className="detail-title">{event.title}</div>
              <p className="detail-desc">{event.description}</p>
            </div>
          </div>

          <div className="detail-chips">
            <div className="chip"><div className="cl">Date</div><div className="cv">{new Date(event.date).toDateString()}</div></div>
            <div className="chip"><div className="cl">Venue</div><div className="cv">{event.venue}</div></div>
            <div className="chip"><div className="cl">Capacity</div><div className="cv">{event.capacity}</div></div>
          </div>

          {message.text && (
            <div style={{ padding: '10px 16px', background: '#fff' }}>
              <div className={`alert alert-${message.type}`}>{message.text}</div>
            </div>
          )}

          <div className="reg-strip" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            <div className="reg-status">
              {token ? (
                registered ? (
                  <p>✓ You are registered for this event</p>
                ) : (
                  <p style={{ color: 'rgba(28,10,8,0.6)' }}>Registrations are open</p>
                )
              ) : (
                <p style={{ color: 'rgba(28,10,8,0.6)' }}>You must be logged in to register.</p>
              )}
            </div>
            <div className="reg-actions" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              {token ? (
                registered ? (
                  <button className="btn btn-unregister" onClick={handleUnregister}>Unregister</button>
                ) : (
                  <button className="btn btn-primary" onClick={handleRegister}>Register Now</button>
                )
              ) : (
                <button className="btn btn-primary" onClick={() => navigate('/login')}>Login</button>
              )}
              {user && (user.role === 'admin' || user.role === 'super_admin') && (
                <button 
                  className="btn btn-unregister" 
                  style={{ border: '1px solid var(--crimson)' }} 
                  onClick={handleDeleteEvent}
                >
                  Delete Event
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default EventDetail;