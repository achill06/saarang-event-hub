import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import EventList       from './pages/EventList';
import EventDetail     from './pages/EventDetail';
import Login           from './pages/Login';
import Signup          from './pages/Signup';
import MyRegistrations from './pages/MyRegistrations';
import Admin           from './pages/Admin';
import ManageAdmins    from './pages/ManageAdmins';
import EditEvent       from './pages/EditEvent';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="page">
          <Navbar />
          <Routes>
            <Route path="/"                  element={<EventList />} />
            <Route path="/events/:id"        element={<EventDetail />} />
            <Route path="/login"             element={<Login />} />
            <Route path="/signup"            element={<Signup />} />
            <Route path="/my-registrations"  element={<MyRegistrations />} />
            <Route path="/admin/add-event"   element={<Admin />} />
            <Route path="/manage-admins"     element={<ManageAdmins />} />
            <Route path="/admin/edit-event/:id" element={<EditEvent />} />
          </Routes>

          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;