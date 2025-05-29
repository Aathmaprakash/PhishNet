import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import {
  Shield, Link as LinkIcon, Mail, AlertTriangle, CheckCircle, Activity,
  Clock, ArrowRight, BarChart3, ChevronDown, Settings, Search, Bell, User,
  Menu, X, Download, FileText, RefreshCw, LogOut, TrendingUp, Info, Coffee
} from 'lucide-react';
import './Dashboard.css';

// Mock Data
const mockData = [
  { id: 1, type: 'url', result: 'Safe', timestamp: Date.now(), url: 'https://example.com', details: 'Legitimate business site' },
  { id: 2, type: 'email', result: 'Suspicious', timestamp: Date.now() - 3600000, email: 'test@example.com', details: 'Unusual sender pattern' },
  { id: 3, type: 'url', result: 'Phishing', timestamp: Date.now() - 7200000, url: 'https://fake-site.com', details: 'Known phishing domain' },
  { id: 4, type: 'email', result: 'Safe', timestamp: Date.now() - 86400000, email: 'support@trusted.com', details: 'Verified sender' },
  { id: 5, type: 'url', result: 'Suspicious', timestamp: Date.now() - 172800000, url: 'https://unusual-domain.net', details: 'Recently registered domain' },
];

// Style mappings
const statusColorMap = {
  safe: {
    badge: 'bg-emerald-100 text-emerald-800',
    bg: 'bg-emerald-500',
    statCard: 'bg-emerald-50',
    statIcon: 'bg-emerald-100',
    statText: 'text-emerald-600'
  },
  suspicious: {
    badge: 'bg-amber-100 text-amber-800',
    bg: 'bg-amber-500',
    statCard: 'bg-amber-50',
    statIcon: 'bg-amber-100',
    statText: 'text-amber-600'
  },
  phishing: {
    badge: 'bg-rose-100 text-rose-800',
    bg: 'bg-rose-500',
    statCard: 'bg-rose-50',
    statIcon: 'bg-rose-100',
    statText: 'text-rose-600'
  }
};



const Dashboard = () => {
  // States
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [timeframe, setTimeframe] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');
  const [username, setUsername] = useState('');
  
  // Refs
  const profileMenuRef = useRef(null);
  const profileBtnRef = useRef(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

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

  // Fetch data
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchData = async () => {
      try {
        // Simulating API fetch with timeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        setRecentScans(mockData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Compute Statistics (Memoized)
  const stats = useMemo(() => {
    if (!recentScans.length) return { safe: 0, suspicious: 0, phishing: 0, total: 0, safePercent: 0, suspiciousPercent: 0, phishingPercent: 0 };
    
    const totals = recentScans.reduce(
      (acc, scan) => {
        acc[scan.result.toLowerCase()]++;
        return acc;
      },
      { safe: 0, suspicious: 0, phishing: 0, total: recentScans.length }
    );
    
    return {
      ...totals,
      safePercent: Math.round((totals.safe / totals.total) * 100) || 0,
      suspiciousPercent: Math.round((totals.suspicious / totals.total) * 100) || 0,
      phishingPercent: Math.round((totals.phishing / totals.total) * 100) || 0
    };
  }, [recentScans]);


  // Helper functions
  const getStatusStyles = useCallback((result) => {
    const statusKey = result?.toLowerCase() || 'safe';
    return statusColorMap[statusKey] || statusColorMap.safe;
  }, []);

  const formatTimeAgo = useCallback((timestamp) => {
    const diff = (Date.now() - timestamp) / 1000;
    return diff < 60 ? 'just now'
      : diff < 3600 ? `${Math.floor(diff / 60)}m ago`
      : diff < 86400 ? `${Math.floor(diff / 3600)}h ago`
      : `${Math.floor(diff / 86400)}d ago`;
  }, []);

  const refreshData = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      // In a real app, this would be an API call
      setRecentScans(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  // Navigation handlers
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const toggleProfileMenu = useCallback(() => {
    setShowProfileMenu(prev => !prev);
  }, []);

  const handleLogout = useCallback(() => {
    // Add logout logic here
    alert('Logout functionality would be implemented here');
  }, []);

  return (
    <div className="dashboard-container">
      {/* Background Elements */}
      <div className="background-elements" aria-hidden="true">
        <div className="bg-element bg-element-1"></div>
        <div className="bg-element bg-element-2"></div>
        <div className="bg-element bg-element-3"></div>
      </div>

      {/* Header/Navigation */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="left-section">
            <button className="menu-btn" onClick={toggleMobileMenu} aria-label="Toggle Menu">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            <div className="logo">
              <Shield size={24} className="text-primary" />
              <h1>PhishGuard</h1>
            </div>
            
            <nav className="desktop-nav">
              <a href="#" className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                 onClick={() => setActiveTab('overview')}>
                Overview
              </a>
              <a href="#" className={`nav-link ${activeTab === 'url-analysis' ? 'active' : ''}`}
                 onClick={() => setActiveTab('url-analysis')}>
                URL Analysis
              </a>
              <a href="#" className={`nav-link ${activeTab === 'email-analysis' ? 'active' : ''}`}
                 onClick={() => setActiveTab('email-analysis')}>
                Email Analysis
              </a>
              <a href="#" className={`nav-link ${activeTab === 'reports' ? 'active' : ''}`}
                 onClick={() => setActiveTab('reports')}>
                Reports
              </a>
            </nav>
          </div>
          
          <div className="right-section">
            <div className="search-container">
              <Search size={16} className="icon-sm" />
              <input type="text" placeholder="Search..." aria-label="Search" />
            </div>
            
            <button className="notification-btn" aria-label="Notifications">
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </button>
            
            <div className="profile-dropdown">
              <button 
                ref={profileBtnRef}
                className="profile-btn" 
                onClick={toggleProfileMenu}
                aria-expanded={showProfileMenu}
                aria-haspopup="true"
              >
                <User size={16} className="icon-sm" />
                <span>{username || 'John Doe'}</span>
                <ChevronDown size={16} className="icon-sm" />
              </button>
              
              {showProfileMenu && (
                <div ref={profileMenuRef} className="profile-menu">
                  <button className="menu-item">
                    <User size={16} />
                    My Account
                  </button>
                  <button className="menu-item">
                    <Settings size={16} />
                    Settings
                  </button>
                  <button className="menu-item">
                    <Download size={16} />
                    Download Reports
                  </button>
                  <button className="menu-item" onClick={handleLogout}>
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="mobile-nav" aria-label="Mobile Navigation">
            <a href="#" className={`mobile-nav-link ${activeTab === 'overview' ? 'active' : ''}`}
               onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }}>
              Overview
            </a>
            <a href="#" className={`mobile-nav-link ${activeTab === 'url-analysis' ? 'active' : ''}`}
               onClick={() => { setActiveTab('url-analysis'); setMobileMenuOpen(false); }}>
              URL Analysis
            </a>
            <a href="#" className={`mobile-nav-link ${activeTab === 'email-analysis' ? 'active' : ''}`}
               onClick={() => { setActiveTab('email-analysis'); setMobileMenuOpen(false); }}>
              Email Analysis
            </a>
            <a href="#" className={`mobile-nav-link ${activeTab === 'reports' ? 'active' : ''}`}
               onClick={() => { setActiveTab('reports'); setMobileMenuOpen(false); }}>
              Reports
            </a>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Welcome Banner */}
        <section className="welcome-banner">
          <div className="welcome-content">
            <h2>Welcome back, John!</h2>
            <p>Your security dashboard is showing {stats.suspicious + stats.phishing} potential threats that need your attention.</p>
          </div>
          <div className="welcome-actions">
            <button className="primary-btn">
              <AlertTriangle size={16} />
              View Threats
            </button>
            <button className="secondary-btn">
              <Activity size={16} />
              Run New Scan
            </button>
          </div>
        </section>

      
      

        {/* Educational Resources */}
        <section className="educational-resources">
          <div className="section-header">
            <h3>
              <span role="img" aria-label="Book" className="mr-2">📚</span>
              Educational Resources
            </h3>
          </div>
          <div className="resources-grid">
            <a className="resource-card" href="https://www.consumer.ftc.gov/articles/how-recognize-and-avoid-phishing-scams" target="_blank" rel="noopener noreferrer">
              <div className="resource-icon blue">
                <Info size={24} />
              </div>
              <div className="resource-content">
                <h4>How to Recognize and Avoid Phishing Scams</h4>
                <p>Official guide from the FTC on spotting phishing attempts.</p>
                <div className="resource-source">Federal Trade Commission</div>
              </div>
            </a>
            <a className="resource-card" href="https://www.cisa.gov/news-events/news/phishing-attacks-common-and-dangerous" target="_blank" rel="noopener noreferrer">
              <div className="resource-icon amber">
                <AlertTriangle size={24} />
              </div>
              <div className="resource-content">
                <h4>Phishing Attacks - Common and Dangerous</h4>
                <p>Learn about the latest phishing threats and prevention methods.</p>
                <div className="resource-source">CISA</div>
              </div>
            </a>
            <a className="resource-card" href="https://www.youtube.com/watch?v=UzvPP6_LRHc" target="_blank" rel="noopener noreferrer">
              <div className="resource-icon rose">
                <Coffee size={24} />
              </div>
              <div className="resource-content">
                <h4>Phishing: How to Spot a Scam</h4>
                <p>A short video on identifying phishing emails and messages.</p>
                <div className="resource-source">Google</div>
              </div>
            </a>
            <a className="resource-card" href="https://www.phishing.org/10-ways-to-avoid-phishing-scams" target="_blank" rel="noopener noreferrer">
              <div className="resource-icon green">
                <Shield size={24} />
              </div>
              <div className="resource-content">
                <h4>10 Ways to Avoid Phishing Scams</h4>
                <p>Practical tips to protect yourself from phishing attempts.</p>
                <div className="resource-source">Phishing.org</div>
              </div>
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <Shield size={20} />
            <span>PhishGuard</span>
          </div>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact Support</a>
          </div>
          <div className="footer-copyright">
            © 2025 PhishGuard. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;