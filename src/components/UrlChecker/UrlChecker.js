import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, Loader2, Clipboard, Trash2, CheckCircle, AlertTriangle, Shield, Bell, User, Menu, X, ChevronDown, Settings, LogOut, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import './UrlChecker.css';
import React from 'react';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-container">Something went wrong rendering this component.</div>;
    }
    return this.props.children;
  }
}

const urlValidationService = {
  analyzeUrl: async (url) => {
    try {
      const response = await fetch('https://1zymipkl3d.execute-api.us-east-1.amazonaws.com/validate', {
        method: 'POST',
        'Content-Type': 'application/json',
        body: JSON.stringify({ url }),
      });
      const data = await response.json();

     
      console.log("Full API Response:", data);
      
    
      const processedData = {
        url: data.details?.input || url,
        status: data.success ? 'Safe' : 'Phishing',
        details: data.message || 'No details provided',
        
      
        riskleveldata: data.details?.riskLevel || 'Unknown',
        riskScore: data.details?.riskScore || 0,
        
     
        ip: data.details?.analysis?.dnsLookup?.ip,
        domain: data.details?.format?.hostname,
        
      
        redirectChain: data.details?.analysis?.redirects?.redirectChain,
        finalUrl: data.details?.analysis?.redirects?.finalUrl,
        
      
        certificate: data.details?.analysis?.certificate,
        
        
        security: data.details?.security,
        
        
        timestamp: data.timestamp,
      };
      
      return processedData;
    } catch (error) {
      throw new Error(error.message || 'Network error occurred');
    }
  },
};

const handleDownloadReport = (data) => {
  const doc = new jsPDF();
  let y = 10;
  doc.setFontSize(12);
  doc.text("🔍 URL Analysis Report", 10, y);

  const lines = [
    `🌐 URL: ${data.url}`,
    `🛡️ Status: ${data.status}`,
    `ℹ️ Details: ${data.details}`,
    `🌍 Domain: ${data.domain || 'N/A'}`,
    `⚠️ Risk Level: ${data.riskleveldata || 'Unknown'}`,
    data.riskScore && `📊 Risk Score: ${data.riskScore}`,
    
    data.finalUrl && `🔄 Final Destination: ${data.finalUrl}`,
    data.certificate?.valid !== undefined && `🔒 SSL Certificate: ${data.certificate.valid ? 'Valid' : 'Invalid'}`,
    data.certificate?.issuer && `🔏 Certificate Issuer: ${data.certificate.issuer}`,
    data.timestamp && `🕒 Scanned At: ${new Date(data.timestamp).toLocaleString()}`,
    data.redirectChain?.length > 0 ? `➡️ Redirect Chain:\n${Array.isArray(data.redirectChain) ? data.redirectChain.join('\n') : 'N/A'}` : null,
  ].filter(Boolean);

  lines.forEach((line) => {
    const split = doc.splitTextToSize(line, 180);
    y += 8;
    doc.text(split, 10, y);
    y += split.length * 6;
  });

  doc.save(`url-report-${Date.now()}.pdf`);
};

const Button = ({ children, className = '', ...props }) => (
  <button className={`custom-button ${className}`} {...props}>
    {children}
  </button>
);

const Input = ({ className = '', ...props }) => (
  <input className={`custom-input ${className}`} {...props} />
);

const Card = ({ children, className = '' }) => (
  <div className={`custom-card ${className}`}>{children}</div>
);

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="toast-message" role="alert">
      <CheckCircle size={18} />
      {message}
    </div>
  );
};

const ResultDisplay = ({ result, onClear }) => {
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  

  return (
    <div className="result-display">
      {/* Your result display implementation */}
    </div>
  );
};


const ScanDetailsModal = ({ scan, onClose }) => {
  useEffect(() => {
    if (scan) {
      console.group('📊 Scan Details Modal');
      console.log('Current Scan:', scan);
      console.groupEnd();
    }
  }, [scan]);

  if (!scan) return null;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="scan-details-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>🔍 URL Security Analysis</h3>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-content">
          {/* Basic Information */}
          <div className="modal-section">
            <h4 className="section-title">Basic Information</h4>
            <div className="scan-detail-item">
              <span className="detail-label">🌐 URL:</span>
              <span className="detail-value">{scan.url}</span>
            </div>
            <div className="scan-detail-item">
              <span className="detail-label">🛡️ Status:</span>
              <span className={`detail-value status-${scan.status.toLowerCase()}`}>
                {scan.status === 'Safe' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                {scan.status}
              </span>
            </div>
            <div className="scan-detail-item">
              <span className="detail-label">ℹ️ Details:</span>
              <span className="detail-value">{scan.details}</span>
            </div>
          </div>

          {/* Risk Assessment */}
          <div className="modal-section">
            <h4 className="section-title">Risk Assessment</h4>
            <div className="scan-detail-item">
              <span className="detail-label">⚠️ Risk Level:</span>
              <span className={`detail-value risk-${scan.riskleveldata?.toLowerCase()}`}>
                {scan.riskleveldata || 'Unknown'}
              </span>
            </div>
            <div className="scan-detail-item">
              <span className="detail-label">📊 Risk Score:</span>
              <div className="detail-value">
                <div className="risk-score-bar">
                  <div 
                    className={`risk-score-fill risk-${scan.riskleveldata?.toLowerCase()}`}
                    style={{ width: `${scan.riskScore || 0}%` }}
                  />
                </div>
                <span className="risk-score-value">{scan.riskScore || 0}</span>
              </div>
            </div>
            {scan.security?.suspiciousPatterns?.length > 0 && (
              <div className="scan-detail-item">
                <span className="detail-label">🚨 Suspicious Patterns:</span>
                <div className="detail-value">
                  <ul className="risk-factors">
                    {scan.security.suspiciousPatterns.map((pattern, index) => (
                      <li key={index} className="risk-factor">
                        <AlertTriangle size={14} />
                        {pattern}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Domain Information */}
          <div className="modal-section">
            <h4 className="section-title">Domain Information</h4>
            {scan.domain && (
              <div className="scan-detail-item">
                <span className="detail-label">🌍 Domain:</span>
                <div className="detail-value domain-info">
                  <span className="domain-name">{scan.domain}</span>
                  {scan.security?.isTrustedDomain && (
                    <span className="domain-warning">
                      <Shield size={14} />
                      Trusted Domain
                    </span>
                  )}
                </div>
              </div>
            )}
            {scan.finalUrl && (
              <div className="scan-detail-item">
                <span className="detail-label">🔄 Final URL:</span>
                <div className="detail-value final-url">
                  <span className="url-text">{scan.finalUrl}</span>
                </div>
              </div>
            )}
          </div>

          {/* Security Checks */}
          <div className="modal-section">
            <h4 className="section-title">Security Checks</h4>
            <div className="scan-detail-item">
              <span className="detail-label">🔐 HTTPS:</span>
              <span className={`detail-value ${scan.security?.useHttps ? 'status-safe' : 'status-phishing'}`}>
                {scan.security?.useHttps ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="scan-detail-item">
              <span className="detail-label">⛔ Blocklisted:</span>
              <span className={`detail-value ${scan.security?.isBlocklisted ? 'status-phishing' : 'status-safe'}`}>
                {scan.security?.isBlocklisted ? 'Yes' : 'No'}
              </span>
            </div>
          </div>

          {/* SSL Certificate */}
          {scan.certificate && (
            <div className="modal-section">
              <h4 className="section-title">SSL Certificate</h4>
              <div className="scan-detail-item">
                <span className="detail-label">🔒 Valid:</span>
                <span className={`detail-value ${scan.certificate.valid ? 'status-safe' : 'status-phishing'}`}>
                  {scan.certificate.valid ? 'Yes' : 'No'}
                </span>
              </div>
              {scan.certificate.issuer && (
                <div className="scan-detail-item">
                  <span className="detail-label">🔏 Issuer:</span>
                  <span className="detail-value">{scan.certificate.issuer}</span>
                </div>
              )}
            </div>
          )}

          {/* Redirect Chain */}
          {scan.redirectChain && scan.redirectChain.length > 0 && (
            <div className="modal-section">
              <h4 className="section-title">Redirect Chain</h4>
              <div className="redirect-chain">
                {scan.redirectChain.map((redirect, index) => (
                  <div key={index} className="redirect-item">
                    <span className="redirect-number">{index + 1}</span>
                    <span className="redirect-url">{redirect.to}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Scan Information */}
          <div className="modal-section">
            <h4 className="section-title">Scan Information</h4>
            <div className="scan-detail-item">
              <span className="detail-label">🕒 Scanned At:</span>
              <span className="detail-value">{new Date(scan.timestamp).toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="modal-button secondary" onClick={onClose}>Close</button>
          <button className="modal-button primary" onClick={() => handleDownloadReport(scan)}>
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
};


const useUserStorage = (userId) => {
  const getStorageKey = (key) => `user_${userId}_${key}`;
  
  const getItem = (key, defaultValue = null) => {
    try {
      const value = localStorage.getItem(getStorageKey(key));
      return value ? JSON.parse(value) : defaultValue;
    } catch (e) {
      console.error(`Error retrieving ${key} from storage:`, e);
      return defaultValue;
    }
  };
  
  const setItem = (key, value) => {
    try {
      localStorage.setItem(getStorageKey(key), JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving ${key} to storage:`, e);
    }
  };
  
  const removeItem = (key) => {
    localStorage.removeItem(getStorageKey(key));
  };
  
  return { getItem, setItem, removeItem };
};

const UrlChecker = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [username, setUsername] = useState('');
  const [recentScans, setRecentScans] = useState([]);
  const inputRef = useRef(null);
  const profileMenuRef = useRef(null);
  const profileBtnRef = useRef(null);
  const [selectedScan, setSelectedScan] = useState(null);
  const [userId, setUserId] = useState('');
  
  
  const userStorage = useUserStorage(userId);

  
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
      
      const generatedUserId = btoa(storedUsername).replace(/[^a-zA-Z0-9]/g, '');
      setUserId(generatedUserId);
    } else {
    
      navigate('/');
    }
  }, [navigate]);

 
  useEffect(() => {
    if (!userId) return;
    
   
    const savedResult = userStorage.getItem('urlAnalysisResult');
    const savedUrl = userStorage.getItem('urlInput');
    const savedScans = userStorage.getItem('recentScans', []);
    
    if (savedResult) setResult(savedResult);
    if (savedUrl) setUrl(savedUrl);
    if (savedScans) setRecentScans(savedScans);
    
  }, [userId]); // Only run when userId changes

  
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
  
    localStorage.removeItem('username');
    navigate('/');
  }, [navigate]);

  const clearUserData = useCallback(() => {
    
    if (!userId) return;
    
    
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(`user_${userId}_`)) {
        localStorage.removeItem(key);
      }
    });
  }, [userId]);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const toggleProfileMenu = useCallback(() => {
    setShowProfileMenu(prev => !prev);
  }, []);

  const normalizeUrl = (url) => url.startsWith('http') ? url : `https://${url}`;
  const isValidUrl = (url) => { try { new URL(normalizeUrl(url)); return true; } catch { return false; } };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
   
    if (!userId) {
      setError('⚠️ User not logged in');
      navigate('/');
      return;
    }
    
    const trimmed = url.trim();
    const normalized = normalizeUrl(trimmed);

    if (!trimmed) {
      setError('⚠️ Please enter a URL');
      inputRef.current?.focus();
      return;
    }

    if (!isValidUrl(trimmed)) {
      setError('⚠️ Invalid URL format.');
      return;
    }

    setError('');
    setIsAnalyzing(true);
    try {
      const analysis = await urlValidationService.analyzeUrl(normalized);
      setResult(analysis);
      setUrl(trimmed);

      
      console.group('🔍 URL Scan Details');
      console.log('Basic Information:', {
        url: analysis.url,
        status: analysis.status,
        details: analysis.details,
        timestamp: new Date(analysis.timestamp).toLocaleString()
      });
      
      console.log('Risk Assessment:', {
        riskLevel: analysis.riskleveldata,
        riskScore: analysis.riskScore,
        riskFactors: analysis.details?.riskFactors || []
      });
      
      console.log('Domain Information:', {
        domain: analysis.domain,
        ip: analysis.ip,
        finalUrl: analysis.finalUrl,
        redirectChain: analysis.redirectChain
      });
      
      console.log('Security Information:', {
        useHttps: analysis.security?.useHttps,
        usesIpAddress: analysis.security?.usesIpAddress,
        isBlocklisted: analysis.security?.isBlocklisted,
        securityChecks: analysis.security
      });
      
      console.log('SSL Certificate:', {
        valid: analysis.certificate?.valid,
        issuer: analysis.certificate?.issuer,
        expiryDate: analysis.certificate?.expiryDate,
        certificateDetails: analysis.certificate
      });
      
      console.log('Full Analysis Data:', analysis);
      console.groupEnd();

   
      userStorage.setItem('urlAnalysisResult', analysis);
      userStorage.setItem('urlInput', trimmed);

   
      const newScan = {
        id: Date.now(),
        url: trimmed,
        status: analysis.status,
        timestamp: new Date().toISOString(),
        details: analysis.details,
        riskleveldata: analysis.riskleveldata,
        riskScore: analysis.riskScore,
        domain: analysis.domain,
        ip: analysis.ip,
        security: analysis.security,
        certificate: analysis.certificate,
        redirectChain: analysis.redirectChain
      };
      
      const updatedScans = [newScan, ...recentScans].slice(0, 3);
      setRecentScans(updatedScans);
      userStorage.setItem('recentScans', updatedScans);
    } catch (err) {
      console.error('❌ Scan Error:', err);
      setError(`❌ ${err.message || 'Analysis failed'}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setUrl('');
    setResult(null);
    setError('');
    if (userId) {
      userStorage.removeItem('urlAnalysisResult');
      userStorage.removeItem('urlInput');
    }
    inputRef.current?.focus();
  };

  const handleScanClick = (scan) => {
    setSelectedScan(scan);
  };

  
  if (!userId) {
    return (
      <div className="redirect-container">
        <Card>
          <h2>Session Expired</h2>
          <p>Please log in again to continue.</p>
          <Button className="primary" onClick={() => navigate('/')}>
            Go to Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="background-elements">
        <div className="bg-element bg-element-1"></div>
        <div className="bg-element bg-element-2"></div>
      </div>
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
                <span>{username || 'User'}</span>
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

      <div className="url-checker-container">
        <div className="content-wrapper">
          <Card className="card-container">
            <form onSubmit={handleSubmit} className="form-container">
              <div className="input-group">
                <div className="input-wrapper">
                  <Input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter URL (e.g., example.com)"
                    disabled={isAnalyzing}
                    ref={inputRef}
                    aria-label="URL to analyze"
                  />
                  <Search className="search-icon" aria-hidden="true" />
                </div>
                <Button type="submit" className="submit-button" disabled={isAnalyzing} aria-busy={isAnalyzing}>
                  {isAnalyzing ? (<><Loader2 className="loader-icon" />Analyzing...</>) : 'Analyze URL'}
                </Button>
              </div>
              {error && (
                <div className="error-message" role="alert">
                  <AlertTriangle size={16} />
                  {error}
                </div>
              )}
            </form>
          </Card>

          {/* Recent Scans Section */}
          {recentScans.length > 0 && (
            <div className="recent-scans-section">
              <h3>Recent Scans</h3>
              <div className="recent-scans-list">
                {recentScans.map((scan) => (
                  <div 
                    key={scan.id} 
                    className="scan-item"
                    onClick={() => handleScanClick(scan)}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => e.key === 'Enter' && handleScanClick(scan)}
                  >
                    <div className={`scan-icon ${scan.status.toLowerCase()}`}>
                      {scan.status === 'Safe' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                    </div>
                    <div className="scan-info">
                      <div className="scan-title">{scan.url}</div>
                      <div className="scan-details">{scan.details}</div>
                      <div className="scan-meta">
                        <span className={`scan-status ${scan.status.toLowerCase()}`}>{scan.status}</span>
                        <span className="scan-time">{new Date(scan.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result && (
            <div className="result-container">
              <ErrorBoundary>
                <ResultDisplay result={result} onClear={handleClear} />
              </ErrorBoundary>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedScan && (
        <ScanDetailsModal 
          scan={selectedScan} 
          onClose={() => setSelectedScan(null)} 
        />
      )}
    </>
  );
};

export default UrlChecker;