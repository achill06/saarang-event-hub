import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const EditEvent = () => {
  const { id } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '', description: '', date: '', venue: '', capacity: '', category: 'Cultural'
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (!token || (user?.role !== 'admin' && user?.role !== 'super_admin')) {
      navigate('/');
      return;
    }

    axios.get(`https://saarang-event-hub-5c2b.onrender.com/api/events/${id}`)
      .then(res => {
        const event = res.data;
        const formattedDate = new Date(event.date).toISOString().split('T')[0];
        
        setFormData({
          title: event.title,
          description: event.description,
          date: formattedDate,
          venue: event.venue,
          capacity: event.capacity,
          category: event.category || 'Cultural'
        });
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setMessage({ text: 'Failed to load event details.', type: 'error' });
        setLoading(false);
      });
  }, [id, token, user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    try {
      await axios.put(`https://saarang-event-hub-5c2b.onrender.com/api/events/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate(`/events/${id}`);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Failed to update event', type: 'error' });
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div className="form-section">
      <div className="form-card">
        
        <div className="form-head">
          <div className="form-head-dot"></div>
          <div className="form-head-title">Edit Event</div>
        </div>

        <div className="form-body">
          {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}
          
          <form onSubmit={handleSubmit}>
            
            {/* Title and Category side-by-side on desktop */}
            <div className="row2">
              <div className="fg">
                <label className="fl">Event Title</label>
                <input type="text" name="title" className="fi" value={formData.title} onChange={handleChange} required />
              </div>
              
              <div className="fg">
                <label className="fl">Category</label>
                <select name="category" className="fi" value={formData.category} onChange={handleChange}>
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
              <textarea name="description" className="ta" value={formData.description} onChange={handleChange} rows="3" required />
            </div>

            <div className="row2">
              <div className="fg">
                <label className="fl">Date</label>
                <input type="date" name="date" className="fi" value={formData.date} onChange={handleChange} required />
              </div>

              <div className="fg">
                <label className="fl">Venue</label>
                <input type="text" name="venue" className="fi" value={formData.venue} onChange={handleChange} required />
              </div>
            </div>

            <div className="fg">
              <label className="fl">Capacity</label>
              <input type="number" name="capacity" className="fi" value={formData.capacity} onChange={handleChange} required />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                Save Changes
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => navigate(`/events/${id}`)} style={{ flex: 1 }}>
                Cancel
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEvent;