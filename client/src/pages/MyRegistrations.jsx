import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const MyRegistrations = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    axios.get('https://saarang-event-hub-5c2b.onrender.com/api/events/my/registrations', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setRegistrations(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [token, navigate]);

  const handleUnregister = async (eventId) => {
    try {
      await axios.delete(`https://saarang-event-hub-5c2b.onrender.com/api/events/${eventId}/register`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRegistrations(registrations.filter(reg => reg.event._id !== eventId));
    } catch (err) {
      console.error(err);
    }
  };

  const getCategoryStyles = (category) => {
    const cat = category?.toLowerCase() || 'cultural';
    switch (cat) {
      case 'dance': return { bar: 'bar-teal', badge: 'cat-dance' };
      case 'lecture': return { bar: 'bar-gold', badge: 'cat-lecture' };
      case 'music': return { bar: 'bar-rose', badge: 'cat-music' };
      default: return { bar: 'bar-crimson', badge: 'cat-cultural' };
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading your events...</div>;

  return (
    <>
      
      <div className="sec-bar">
        <span className="sec-name">Your Events ({registrations.length})</span>
      </div>

      <div className="events-section" style={{ minHeight: '400px' }}>
        {registrations.length === 0 ? (
          <div style={{ padding: '40px 24px', textAlign: 'center', color: 'rgba(28,10,8,0.5)' }}>
            <p style={{ marginBottom: '16px' }}>You haven't registered for any events yet.</p>
            <Link to="/" className="btn btn-primary" style={{ textDecoration: 'none' }}>
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="events-grid">
            {registrations.map(reg => {
              const event = reg.event;
              const styles = getCategoryStyles(event.category);
              
              return (
                <div className="ecard" key={reg._id}>
                  <div className={`ecard-bar ${styles.bar}`}></div>
                  <div className="ecard-body">
                    <div className="ecard-top">
                      <span className={`cat ${styles.badge}`}>{event.category || 'Cultural'}</span>
                      <span className="seats-left" style={{ color: 'var(--green)' }}>✓ Registered</span>
                    </div>
                    <div className="ecard-title">{event.title}</div>
                    <div className="emeta">📅 {new Date(event.date).toDateString()}</div>
                    <div className="emeta">📍 {event.venue}</div>
                  </div>
                  <div className="ecard-foot">
                    <button 
                      onClick={() => handleUnregister(event._id)} 
                      className="btn btn-unregister"
                    >
                      Unregister
                    </button>
                    <Link to={`/events/${event._id}`} className="btn btn-ghost" style={{textDecoration: 'none'}}>
                      Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default MyRegistrations;