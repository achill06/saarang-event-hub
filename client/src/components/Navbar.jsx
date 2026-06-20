import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.svg'; 

const Navbar = () => {
  const { user, logout } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getLinkClass = (path) => {
    return location.pathname === path ? "navl active" : "navl";
  };

  return (
    <nav className="nav">
      <Link to="/" className="logo-wrapper">
        <img className="logo-img" src={logo} alt="Saarang Logo" />
        <div className="logo-text">
          Saarang<sub>IIT Madras · Est. 1974</sub>
        </div>
      </Link>

      <div className="nav-divider"></div>

      <Link to="/" className={getLinkClass('/')}>Events</Link>

      {user ? (
        <>
          <Link to="/my-registrations" className={getLinkClass('/my-registrations')}>
            My Events
          </Link>

          {(user.role === 'admin' || user.role === 'super_admin') && (
            <Link to="/admin/add-event" className={getLinkClass('/admin/add-event')}>
              + Add Event
            </Link>
          )}

          {user.role === 'super_admin' && (
            <Link to="/manage-admins" className={getLinkClass('/manage-admins')}>
              Manage Admins
            </Link>
          )}

          <div className="nav-divider"></div>
          
          <span className="nav-greeting">Hi, {user.username || 'User'}</span>
          <button className="nav-btn" onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <div className="nav-divider"></div>
          <Link to="/login" className="nav-btn">Login</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;