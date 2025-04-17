import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import Player from './components/layout/Player';
import Home from './pages/Home';
import ContactUs from './pages/ContactUs';
import AboutUs from './pages/AboutUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Auth from './pages/Auth';
import Search from './components/pages/Search';
import YourLib from './components/pages/YourLib';
import './App.css';
import './styles/audioPlayer.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppContent = () => {
  const { user } = useAuth();

  return (
    <div className="app">
      {user && <Sidebar />}
      <div className="main-content">
        {user && <Topbar />}
        <div className="main-container">
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <Search />
                </ProtectedRoute>
              }
            />
            <Route
              path="/yourlib"
              element={
                <ProtectedRoute>
                  <YourLib />
                </ProtectedRoute>
              }
            />
            <Route
              path="/about"
              element={
                <ProtectedRoute>
                  <AboutUs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contact"
              element={
                <ProtectedRoute>
                  <ContactUs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/privacy"
              element={
                <ProtectedRoute>
                  <PrivacyPolicy />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
      {user && <Player />}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <PlayerProvider>
        <Router>
          <AppContent />
        </Router>
      </PlayerProvider>
    </AuthProvider>
  );
};

export default App;
