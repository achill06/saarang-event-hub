import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import chennaiBg from '../assets/chennai.svg';
import chennaiArt from '../assets/chennai-1.svg';
import { useAuth } from '../context/AuthContext';

const EventList = () => {
  const { user } = useAuth(); 
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://saarang-event-hub-5c2b.onrender.com/api/events')
      .then(res => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredEvents = filter === 'All' 
    ? events 
    : events.filter(e => e.category?.toLowerCase() === filter.toLowerCase());

  const getCategoryStyles = (category) => {
    const cat = category?.toLowerCase().replace(/\s+/g, '') || 'cultural';
    switch (cat) {
      case 'dance': return { bar: 'bar-teal', badge: 'cat-dance' };
      case 'lecture': return { bar: 'bar-gold', badge: 'cat-lecture' };
      case 'music': return { bar: 'bar-rose', badge: 'cat-music' };
      case 'finearts': return { bar: 'bar-finearts', badge: 'cat-finearts' };
      case 'literary': return { bar: 'bar-literary', badge: 'cat-literary' };
      case 'dramatics': return { bar: 'bar-dramatics', badge: 'cat-dramatics' };
      case 'gaming': return { bar: 'bar-gaming', badge: 'cat-gaming' };
      case 'workshops': return { bar: 'bar-workshops', badge: 'cat-workshops' };
      case 'proshows': return { bar: 'bar-proshows', badge: 'cat-proshows' };
      case 'Informals': return { bar: 'bar-informals', badge: 'cat-informals' };
      case 'Design & Digital Arts': return { bar: 'bar-vfx', badge: 'cat-vfx' };
      default: return { bar: 'bar-crimson', badge: 'cat-cultural' };
    }
  };

  return (
    <>
      <div className="hero">
        <img className="hero-bg" src={chennaiBg} alt="Chennai" />
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-eyebrow">
            <div className="hero-dot"></div>
            Registrations Open — January 2027
          </div>
          <h1>Where Chennai<br />Comes <em>Alive.</em></h1>
          <div className="hero-rule"></div>
          <p className="hero-sub">IIT Madras &nbsp;·&nbsp; India's Second Oldest Cultural Festival &nbsp;·&nbsp; Five Days</p>
          <div className="hero-bottom">
            <div className="hero-stats">
              <div className="hstat"><div className="n">80K</div><div className="l">Visitors</div></div>
              <div className="hstat"><div className="n">12</div><div className="l">Events</div></div>
              <div className="hstat"><div className="n">50+</div><div className="l">Years</div></div>
            </div>
            <a href="#events-section" className="hero-cta">Browse Events →</a>
          </div>
        </div>
      </div>

      <div className="sec-bar" id="events-section">
        <span className="sec-name">Upcoming Events</span>
        <div className="filters">
          {[
            'All', 'Cultural', 'Dance', 'Music', 'Lecture', 
            'Fine Arts', 'Literary', 'Dramatics', 'Gaming', 'Workshops', 'Proshows', 'Informals', 'Design & Digital Arts'
          ].map(f => (
            <button 
              key={f}
              className={`filter ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="events-section" style={{ minHeight: '300px' }}>
        {loading ? (
          <div style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--crimson)' }}>
            Fetching events...
          </div>
        ) : filteredEvents.length === 0 ? (
          <div style={{ padding: '60px 24px', textAlign: 'center', color: 'rgba(28,10,8,0.5)' }}>
            <p style={{ fontSize: '14px', fontWeight: '500' }}>No upcoming events found.</p>
          </div>
        ) : (
          <div className="events-grid">
            {filteredEvents.map(event => {
              const styles = getCategoryStyles(event.category);
              
              return (
                <div className="ecard" key={event._id}>
                  {user && (user.role === 'admin' || user.role === 'super_admin') && (
                    <button 
                      className="edit-action"
                      onClick={() => navigate(`/admin/edit-event/${event._id}`)}
                    >
                      <svg viewBox="0 0 24 24">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                      </svg>
                      Edit
                    </button>
                  )}
                  <div className={`ecard-bar ${styles.bar}`}></div>
                  <div className="ecard-body">
                    <div className="ecard-top">
                      <span className={`cat ${styles.badge}`}>{event.category || 'Cultural'}</span>
                      <span className="seats-left">
                        Capacity: {event.capacity}
                      </span>
                    </div>
                    <div className="ecard-title">{event.title}</div>
                    <div className="emeta">📅 {new Date(event.date).toDateString()}</div>
                    <div className="emeta">📍 {event.venue}</div>
                  </div>
                  <div className="ecard-foot">
                    <button 
                      onClick={() => navigate(`/events/${event._id}`)} 
                      className="btn btn-primary"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <hr className="rule" />

      <div className="art-strip">
        <img src={chennaiArt} alt="Chennai Art" />
        <div className="art-strip-overlay"></div>
      </div>
    </>
  );
};

export default EventList;