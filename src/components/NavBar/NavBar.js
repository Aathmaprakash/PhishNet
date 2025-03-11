import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield, Search, Bell, User, Menu, X, ChevronDown, Settings, LogOut
} from 'lucide-react';
import './NavBar.css';

const NavBar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const profileBtnRef = useRef(null);

  // Click outside handler for profile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showProfileMenu && 
        profileMenuRef.current && 
        profileBtnRef.current && 
        !profileMenuRef.current.contains(event.target) &&
        !profileBtnRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu]);

  const handleLogout = useCallback(() => {
    // Add your logout logic here (e.g., clear tokens, state)
    navigate('/');
  }, [navigate]);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const toggleProfileMenu = useCallback(() => {
    setShowProfileMenu(prev => !prev);
  }, []);

  return (
    <header className="navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          <button 
            className="menu-btn" 
            onClick={toggleMobileMenu}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="icon" /> : <Menu className="icon" />}
          </button>
          <div className="logo">
            <Shield className="icon-lg text-indigo-600" aria-hidden="true" />
            <h1>PhishNet</h1>
          </div>
          <nav className="desktop-nav">
            {['Dashboard', 'URL Analysis', 'Email Analysis', 'Reports'].map((item) => (
              <Link 
                key={item} 
                to={`/${item.toLowerCase().replace(' ', '-')}`} 
                className="nav-link"
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>
        <div className="navbar-right">
          <div className="search-container">
            <Search className="icon-sm" aria-hidden="true" />
            <input type="text" placeholder="Search" aria-label="Search dashboard" />
          </div>
          <button className="icon-btn" aria-label="Notifications">
            <Bell className="icon" />
          </button>
          <div className="profile-dropdown">
            <button 
              ref={profileBtnRef}
              className="profile-btn"
              onClick={toggleProfileMenu}
              aria-expanded={showProfileMenu}
              aria-haspopup="true"
            >
              <User className="icon-sm" aria-hidden="true" />
              <span>John Doe</span>
              <ChevronDown className="icon-sm" aria-hidden="true" />
            </button>
            {showProfileMenu && (
              <div 
                ref={profileMenuRef}
                className="profile-menu" 
                role="menu"
              >
                <button className="menu-item" role="menuitem">
                  <User className="icon-sm" aria-hidden="true" />
                  Profile
                </button>
                <button className="menu-item" role="menuitem">
                  <Settings className="icon-sm" aria-hidden="true" />
                  Settings
                </button>
                <button className="menu-item" onClick={handleLogout} role="menuitem">
                  <LogOut className="icon-sm" aria-hidden="true" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="mobile-nav" aria-label="Mobile Navigation">
          {['Dashboard', 'URL Analysis', 'Email Analysis', 'Reports'].map((item) => (
            <Link 
              key={item} 
              to={`/${item.toLowerCase().replace(' ', '-')}`} 
              className="mobile-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default NavBar;