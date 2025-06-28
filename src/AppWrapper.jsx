import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import StudentApplyForm from './components/StudentApplyForm';
import StudentApplications from './components/StudentApplications';
import AdminApplications from './components/AdminApplications';
import AdminCompanyAdd from './components/AdminCompanyAdd';
import AdminCompanyView from './components/AdminCompanyView';
import Login from './components/Login';
import Home from './components/Home';
import Register from './components/Register';
import './AppWrapper.css';
import { AuthContext } from './AuthContext'; // Import AuthContext
import { useNavigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import StudentCompanyView from './components/StudentCompanyView';


function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {

  const { token, role, logout } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [theme, setTheme] = useState('dark');

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login after logout
  }

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Initialize theme on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  return (
    <div className="app-container">
      <nav className="navbar">
        <Link to="/" className="nav-item">PlaceMate</Link>

        <div className="nav-links">
          {/* {!token && (
      <>
        <Link to="/login" className="nav-item">Login</Link>
        <Link to="/register" className="nav-item">Register</Link>
      </>
    )} */}

          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle dark/light mode"
          >
            {/* Use icons or emoji - example with emoji */}
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {token && (
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} /> {/* Login route */}
        <Route path="/register" element={<Register />} />
        <Route path="/apply" element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <StudentApplyForm />
          </ProtectedRoute>
        } />
        <Route path="/student/company" element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <StudentCompanyView />
          </ProtectedRoute>
        } />
        <Route path="/student" element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <StudentApplications />
          </ProtectedRoute>
        } />
        <Route path="/admin/all" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminApplications />
          </ProtectedRoute>
        } />
        <Route path="/admin/company/add" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminCompanyAdd />
          </ProtectedRoute>
        } />
        <Route path="/admin/company" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminCompanyView />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

export default AppWrapper;
