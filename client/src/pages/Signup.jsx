import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import chennaiBg from '../assets/chennai-1.svg';
import logo from '../assets/logo.svg';

const Signup = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('https://saarang-event-hub-5c2b.onrender.com/api/auth/signup', form);
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <>
      <div className="auth-section">
        <div className="auth-card">
          
          <div className="auth-head">
            <img className="auth-head-bg" src={chennaiBg} alt="Chennai Art" />
            <div className="auth-head-overlay"></div>
            <div className="auth-head-content">
              <img className="auth-logo-img" src={logo} alt="Saarang Logo" />
              <div className="auth-head-name">Saar<em>ang</em></div>
              <div className="auth-head-sub">Create an Account</div>
            </div>
          </div>

          <div className="auth-body">
            <div className="auth-title">Join the Festival</div>
            
            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="fg">
                <label className="fl">Username</label>
                <input 
                  className="fi" 
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Enter a username"
                  required
                />
              </div>
              <div className="fg">
                <label className="fl">Email</label>
                <input 
                  className="fi" 
                  name="email"
                  type="email" 
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="fg">
                <label className="fl">Password</label>
                <input 
                  className="fi" 
                  name="password"
                  type="password" 
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary" style={{flex: 1, padding: '10px'}}>
                  Sign Up
                </button>
              </div>
            </form>
          </div>

          <div className="auth-foot">
            Already have an account? <Link to="/login">Login</Link>
          </div>

        </div>
      </div>
    </>
  );
};

export default Signup;