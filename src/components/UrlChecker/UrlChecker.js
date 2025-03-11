import { useState, useRef } from 'react';
import { Search, Loader2, Clipboard, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';
import NavBar from '../NavBar/NavBar';
import './UrlChecker.css'
// Mock API with error simulation
const mockApi = {
  analyzeUrl: async (url) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate random errors (10% chance)
        if (Math.random() < 0.1) {
          reject(new Error("Network error occurred"));
          return;
        }
        
        resolve({
          url,
          status: Math.random() > 0.5 ? 'Safe' : 'Phishing',
          details: Math.random() > 0.5 
            ? 'No threats detected. The URL appears to be legitimate.' 
            : 'Potential phishing detected. Proceed with caution.',
        });
      }, 2000);
    });
  },
};

// Button component with accessibility improvements
const Button = ({ children, className = '', ...props }) => (
  <button className={`custom-button ${className}`} {...props}>
    {children}
  </button>
);

// Input component with accessibility improvements
const Input = ({ className = '', ...props }) => (
  <input className={`custom-input ${className}`} {...props} />
);

// Card component
const Card = ({ children, className = '' }) => (
  <div className={`custom-card ${className}`}>{children}</div>
);

// Toast notification component
const Toast = ({ message, onClose }) => {
  setTimeout(onClose, 3000);
  
  return (
    <div className="toast-message" role="alert">
      <CheckCircle size={18} />
      {message}
    </div>
  );
};

// Confirmation dialog component
const ConfirmDialog = ({ onConfirm, onCancel, message }) => (
  <div className="overlay" role="dialog" aria-modal="true">
    <div className="confirm-dialog">
      <h3>Confirm Action</h3>
      <p>{message}</p>
      <div className="dialog-buttons">
        <Button className="cancel-btn" onClick={onCancel}>
          Cancel
        </Button>
        <Button className="confirm-btn" onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </div>
  </div>
);

// Result display component with improved accessibility
const ResultDisplay = ({ result, onClear }) => {
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.url);
      setShowCopyToast(true);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleClearClick = () => {
    setShowConfirmDialog(true);
  };

  const confirmClear = () => {
    setShowConfirmDialog(false);
    onClear();
  };

  const cancelClear = () => {
    setShowConfirmDialog(false);
  };

  return (
    <div className="result-display">
      <h3>🔍 Analysis Result</h3>
      <p>
        <strong>🌐 URL:</strong> {result.url} 
        <button 
          onClick={handleCopy} 
          aria-label="Copy URL to clipboard"
          className="icon-button"
        >
          <Clipboard className="copy-icon" size={18} />
        </button>
      </p>
      <p>
        <strong>🛡️ Status:</strong> 
        <span className={result.status.toLowerCase()}>
          {result.status === 'Safe' ? (
            <>
              <CheckCircle size={16} />
              Safe
            </>
          ) : (
            <>
              <AlertTriangle size={16} />
              Phishing
            </>
          )}
        </span>
      </p>
      <p>
        <strong>ℹ️ Details:</strong> {result.details}
      </p>
      <Button className="clear-button" onClick={handleClearClick}>
        <Trash2 className="icon" size={18} /> Clear Results
      </Button>
      
      {showCopyToast && (
        <Toast 
          message="URL copied to clipboard" 
          onClose={() => setShowCopyToast(false)} 
        />
      )}
      
      {showConfirmDialog && (
        <ConfirmDialog 
          message="Are you sure you want to clear the results?"
          onConfirm={confirmClear}
          onCancel={cancelClear}
        />
      )}
    </div>
  );
};

// Main URL Checker component
const UrlChecker = () => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  // Improved URL validation
  const isValidUrl = (str) => {
    try {
      // Try to construct a URL - this handles most validation cases
      new URL(normalizeUrl(str));
      return true;
    } catch (e) {
      return false;
    }
  };

  // Normalize URL by adding protocol if missing
  const normalizeUrl = (url) => {
    if (!url) return url;
    return url.startsWith('http://') || url.startsWith('https://') 
      ? url 
      : `https://${url}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Trim the URL input
    const trimmedUrl = url.trim();
    
    // Validate input
    if (!trimmedUrl) {
      setError('⚠️ Please enter a URL');
      inputRef.current?.focus();
      return;
    }
    
    // Normalize and validate URL
    const normalizedUrl = normalizeUrl(trimmedUrl);
    if (!isValidUrl(trimmedUrl)) {
      setError('⚠️ Invalid URL format. Please enter a valid web address.');
      return;
    }

    setError('');
    setIsAnalyzing(true);
    
    try {
      const analysisResult = await mockApi.analyzeUrl(normalizedUrl);
      setResult(analysisResult);
    } catch (error) {
      setError(`❌ ${error.message || 'Error during analysis. Please try again.'}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setUrl('');
    setResult(null);
    setError('');
    inputRef.current?.focus();
  };

  return (
    <>
      <div className="background-elements" >
        <div className="bg-element bg-element-1"></div>
        <div className="bg-element bg-element-2"></div>
      </div>
      <div className="url-checker-container">
        <NavBar />
        
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
              <Button 
                type="submit" 
                className="submit-button" 
                disabled={isAnalyzing}
                aria-busy={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="loader-icon" aria-hidden="true" /> 
                    Analyzing...
                  </>
                ) : 'Analyze URL'}
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
        
        {result && (
          <div className="result-container">
            <ResultDisplay result={result} onClear={handleClear} />
          </div>
        )}
      </div>
    </>
  );
};

export default UrlChecker;