import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './Topbar.css';

const Topbar = () => {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="topbar">
      <h1>WavyBoard</h1>
      {user && (
        <div className="user-section">
          <span className="user-email">{user.email}</span>
          <button type="button" className="logout-btn" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      )}
    </div>
  );
};

export default Topbar; 