import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo">
        <Link to="/home" className="logo">
          <img src="/logo.png" alt="Logo" />
        </Link>
      </div>
      <div className="navigation">
        <ul>
          <li>
            <Link to="/home">
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link to="/search">
              <span>Search</span>
            </Link>
          </li>
          <li>
            <Link to="/yourlib">
              <span>Your Library</span>
            </Link>
          </li>
        </ul>
      </div>
      <div className="footer-links">
        <ul>
          <li>
            <Link to="/about">
              <span>About Us</span>
            </Link>
          </li>
          <li>
            <Link to="/contact">
              <span>Contact Us</span>
            </Link>
          </li>
          <li>
            <Link to="/privacy">
              <span>Privacy Policy</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar; 