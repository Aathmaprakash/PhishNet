import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield, Link as LinkIcon, Mail, AlertTriangle, CheckCircle, Activity,
  Clock, ArrowRight, BarChart3, ChevronDown, Settings, Search, Bell, User,
  Menu, X, Download, FileText, RefreshCw, LogOut
} from 'lucide-react';
import './Dashboard.css';
import NavBar from '../NavBar/NavBar'; 
// Mock Data (Outside Component)
const mockData = [
  { id: 1, type: 'url', result: 'Safe', timestamp: Date.now(), url: 'https://example.com', details: 'Legitimate business site' },
  { id: 2, type: 'email', result: 'Suspicious', timestamp: Date.now() - 3600000, email: 'test@example.com', details: 'Unusual sender pattern' },
  { id: 3, type: 'url', result: 'Phishing', timestamp: Date.now() - 7200000, url: 'https://fake-site.com', details: 'Known phishing domain' },
  { id: 4, type: 'email', result: 'Safe', timestamp: Date.now() - 86400000, email: 'support@trusted.com', details: 'Verified sender' },
  { id: 5, type: 'url', result: 'Suspicious', timestamp: Date.now() - 172800000, url: 'https://unusual-domain.net', details: 'Recently registered domain' },
];

// Style mappings (to fix dynamic class issues)
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
  const navigate = useNavigate();
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [timeframe, setTimeframe] = useState('7d');
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
      safePercent: (totals.safe / totals.total) * 100 || 0,
      suspiciousPercent: (totals.suspicious / totals.total) * 100 || 0,
      phishingPercent: (totals.phishing / totals.total) * 100 || 0
    };
  }, [recentScans]);

  // Memoized helper functions
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

  const handleLogout = useCallback(() => {
    // Add your logout logic here (e.g., clear tokens, state)
    navigate('/');
  }, [navigate]);

  const refreshData = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      // In a real app, this would be an API call
      setRecentScans(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const toggleProfileMenu = useCallback(() => {
    setShowProfileMenu(prev => !prev);
  }, []);

  return (
    <div className="dashboard-container">
      <div className="background-elements" aria-hidden="true">
        <div className="bg-element bg-element-1"></div>
        <div className="bg-element bg-element-2"></div>
      </div>

      <header className="dashboard-header">
      <NavBar />
        
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

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Stats Section */}
        <section aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="sr-only">Security Statistics</h2>
          <div className="stats-container">
            {[
              { label: 'Safe', value: stats.safe, percent: stats.safePercent, status: 'safe' },
              { label: 'Suspicious', value: stats.suspicious, percent: stats.suspiciousPercent, status: 'suspicious' },
              { label: 'Phishing', value: stats.phishing, percent: stats.phishingPercent, status: 'phishing' }
            ].map(({ label, value, percent, status }) => {
              const styles = getStatusStyles(status);
              return (
                <div key={label} className={`stat-card ${styles.statCard}`}>
                  <div className={`stat-icon ${styles.statIcon}`}>
                    <CheckCircle className={styles.statText} aria-hidden="true" />
                  </div>
                  <div className="stat-info">
                    <p>{label}</p>
                    <h2>{value} <span>({percent.toFixed(1)}%)</span></h2>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recent Scans Section */}
        <section className="recent-scans" aria-labelledby="recent-scans-heading">
          <div className="section-header">
            <h3 id="recent-scans-heading">Recent Scans</h3>
            <button 
              className="refresh-btn" 
              onClick={refreshData}
              disabled={loading}
              aria-label="Refresh scans"
            >
              <RefreshCw className={`icon-sm ${loading ? 'animate-spin' : ''}`} aria-hidden="true" /> 
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
          <div className="scan-list" role="list">
            {loading ? (
              <div className="loading-indicator">
                <RefreshCw className="icon animate-spin" />
                <p>Loading scan results...</p>
              </div>
            ) : recentScans.length === 0 ? (
              <p className="empty-state">No scans available. Try scanning a URL or email.</p>
            ) : (
              recentScans.map(scan => {
                const styles = getStatusStyles(scan.result);
                return (
                  <div key={scan.id} className="scan-item" role="listitem">
                    <div className={`scan-icon ${styles.bg}`}>
                      {scan.type === 'url' ? <LinkIcon aria-hidden="true" /> : <Mail aria-hidden="true" />}
                    </div>
                    <div className="scan-info">
                      <p className="scan-title">{scan.type === 'url' ? scan.url : scan.email}</p>
                      <div className="scan-details-row">
                        <span className={`status-badge ${styles.badge}`}>
                          {scan.result}
                        </span>
                        <span className="scan-details">{scan.details} - {formatTimeAgo(scan.timestamp)}</span>
                      </div>
                    </div>
                    <Link to={`/scan/${scan.id}`} className="scan-link">
                      View Details <ArrowRight className="icon-sm" aria-hidden="true" />
                    </Link>
                  </div>
                );
              })
            )}
          </div>
          {!loading && recentScans.length > 0 && (
            <div className="view-all-container">
              <Link to="/scans" className="view-all-link">
                View All Scans <ArrowRight className="icon-sm" aria-hidden="true" />
              </Link>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;