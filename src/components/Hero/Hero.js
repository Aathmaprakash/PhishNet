import { useEffect, useState } from 'react';
import { Shield, Lock, Mail, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../Hero/hero.css';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const { login } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      if (!email.trim() || !password.trim()) {
        throw new Error('Please fill in all fields');
      }
      
      await login(email, password);
      // The redirect will happen automatically
    } catch (error) {
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const LoginForm = () => (
    <div className="auth-form-container">
      <div className="auth-header">
        <div className="auth-badge">
          <Shield className="badge-icon" />
          <span>Secure Login</span>
        </div>
        <h2 className="auth-title">Welcome <span className="highlight">Back</span></h2>
        <p className="auth-description">Sign in to access your dashboard</p>
      </div>

      <form onSubmit={handleLogin} className="auth-form">
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email Address</label>
          <div className="input-wrapper">
            <Mail className="input-icon" />
            <input 
              type="email" 
              id="email" 
              className="form-input" 
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">Password</label>
          <div className="input-wrapper">
            <Lock className="input-icon" />
            <input 
              type={showPassword ? "text" : "password"}
              id="password" 
              className="form-input" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            <button 
              type="button" 
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="toggle-icon" /> : <Eye className="toggle-icon" />}
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          className={`auth-button ${isLoading ? 'loading' : ''}`}
          disabled={isLoading || !email.includes('@') || password.length < 1}
        >
          {isLoading ? (
            <>
              <RefreshCw className="icon-sm animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign In <Shield className="button-icon" />
            </>
          )}
        </button>

        <div className="auth-footer">
          {showLoginForm && (
            <button 
              type="button" 
              className="back-button"
              onClick={() => setShowLoginForm(false)}
            >
              Back to Home
            </button>
          )}
          <Link to="/forgot-password" className="auth-link">Forgot Password?</Link>
          <Link to="/signup" className="auth-link">Create Account</Link>
        </div>
      </form>
    </div>
  );
  
  return (
    <div className="hero">
      {/* Background Elements */}
      <div className="background-elements" aria-hidden="true">
        <div className="bg-element bg-element-1"></div>
        <div className="bg-element bg-element-2"></div>
      </div>
      
      <div className="section-container">
        {/* Left Column - Text Content */}
        <div className={`text-content ${isVisible ? 'visible' : 'hidden'}`}>
          {!showLoginForm ? (
            <>
              <div className="badge">
                <Shield className="badge-icon" />
                <span>Advanced Cloud-Based Security</span>
              </div>
              
              <h1 className="hero-title">
                Detect and <span className="highlight">Prevent</span> Phishing Attacks
              </h1>
              
              <p className="hero-description">
                Protect your organization with our AI-powered phishing detection system that identifies malicious URLs and emails before they can cause harm.
              </p>
              
             
            </>
          ) : (
            <LoginForm />
          )}
        </div>
        
        {/* Right Column - Visual Element */}
        <div className={`visual-element ${isVisible ? 'visible' : 'hidden'}`}>
          <div className="glow-effect"></div>
          
          <div className="glass-panel">
            <div className="protection-badge">
              <Shield className="badge-icon" />
              Secure Login
            </div>
            
            <div className="panel-content login-panel">
              <div className="auth-header">
                <h2 className="auth-title">Welcome <span className="highlight">Back</span></h2>
                <p className="auth-description">Sign in to your account to continue</p>
              </div>

              <form onSubmit={handleLogin} className="auth-form">
                {error && <div className="error-message">{error}</div>}
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <div className="input-wrapper">
                    <Mail className="input-icon" />
                    <input 
                      type="email" 
                      id="email" 
                      className="form-input" 
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="password-header">
                    <label htmlFor="password" className="form-label">Password</label>
                    <Link to="/forgot-password" className="forgot-link">Forgot?</Link>
                  </div>
                  <div className="input-wrapper">
                    <Lock className="input-icon" />
                    <input 
                      type={showPassword ? "text" : "password"}
                      id="password" 
                      className="form-input" 
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                    />
                    <button 
                      type="button" 
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="toggle-icon" /> : <Eye className="toggle-icon" />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className={`auth-button ${isLoading ? 'loading' : ''}`}
                  disabled={isLoading || !email.includes('@') || password.length < 1}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="icon-sm animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In <Shield className="button-icon" />
                    </>
                  )}
                </button>

                <div className="auth-footer">
                  <p className="signup-text">
                    Don't have an account? 
                    <Link to="/signup" className="auth-link">Sign up</Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;