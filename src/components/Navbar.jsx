import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Monitor, FileText, User } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <Monitor size={24} className="text-blue-600" />
        <span>Online Cyber Center</span>
      </Link>
      
      <ul className="navbar-links">
        <li>
          <Link to="/" className={`nav-link ${isActive('/')}`}>Services</Link>
        </li>
        <li>
          <Link to="/status" className={`nav-link ${isActive('/status')}`}>Check Status</Link>
        </li>
      </ul>

      <Link to="/dashboard" className="nav-cta">
        Admin Dashboard
      </Link>
    </nav>
  );
};

export default Navbar;
