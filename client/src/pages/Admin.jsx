import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const AdminAddEvent = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', date: '', venue: '', capacity: '', category: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    if (!token) return navigate('/login');
    
    try {
      await axios.post('https://saarang-event-hub-5c2b.onrender.com/api/events', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage({ text: 'Event created successfully!', type: 'success' });
      setForm({ title: '', description: '', date: '', venue: '', capacity: '', category: '' });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Failed to create event', type: 'error' });
    }
  };

  if (!token) return <div style={{ padding: '40px', textAlign: 'center' }}>You must be logged in.</div>;

  return (
    <>
      <div className="form-section">
        <div className="form-card">
          
          <div className="form-head">
            <div className="form-head-dot"></div>
            <span className="form-head-title">Add New Event</span>
          </div>
          
          <div className="form-body">
            {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}

            <form onSubmit={handleSubmit}>
              <div className="row2">
                <div className="fg">
                  <label className="fl">Event Title</label>
                  <input className="fi" name="title" value={form.title} onChange={handleChange} required />
                </div>
                <div className="fg">
                  <label className="fl">Category</label>
                  <select className="fi" name="category" value={form.category} onChange={handleChange} required>
                    <option value="">Select a tag...</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Dance">Dance</option>
                    <option value="Music">Music</option>
                    <option value="Lecture">Lecture</option>
                    <option value="Fine Arts">Fine Arts</option>
                    <option value="Literary">Literary</option>
                    <option value="Dramatics">Dramatics</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Workshops">Workshops</option>
                    <option value="Proshows">Proshows</option>
                    <option value="Informals">Informals</option>
                    <option value="Design & Digital Arts">Design & Digital Arts</option>
                  </select>
                </div>
              </div>

              <div className="fg">
                <label className="fl">Description</label>
                <textarea className="ta" name="description" value={form.description} onChange={handleChange} required />
              </div>

              <div className="row2">
                <div className="fg">
                  <label className="fl">Date</label>
                  <input className="fi" type="date" name="date" value={form.date} onChange={handleChange} required />
                </div>
                <div className="fg">
                  <label className="fl">Venue</label>
                  <input className="fi" name="venue" value={form.venue} onChange={handleChange} required />
                </div>
              </div>

              <div className="fg">
                <label className="fl">Capacity</label>
                <input className="fi" type="number" name="capacity" value={form.capacity} onChange={handleChange} required style={{ maxWidth: '140px' }} />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px' }}>
                  Create Event
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => navigate('/')} style={{ padding: '10px 18px' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </>
  );
};

export default AdminAddEvent;