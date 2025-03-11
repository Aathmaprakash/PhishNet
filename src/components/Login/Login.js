import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useState(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt with:', { email, password });
  };
  
  return (
    <div className="auth-container">
      {/* Background Elements */}
      <div className="background-elements">
        <div className="bg-element bg-element-1"></div>
        <div className="bg-element bg-element-2"></div>
      </div>
      
      <div className={`auth-card`}>
        <div className="auth-header">
          <div className="auth-badge">
            <Shield className="badge-icon" />
            <span>Secure Authentication</span>
          </div>
          
          <h1 className="auth-title">Welcome <span className="highlight">Back</span></h1>
          <p className="auth-description">
            Sign in to your account to access our AI-powered phishing detection system.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
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
            <div className="form-label-row">
              <label htmlFor="password" className="form-label">Password</label>
              <Link to="/forgot-password" className="form-link">Forgot password?</Link>
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
          className="auth-button" 
          onClick={() => navigate('/dashboard')}
          disabled={!email.includes('@') || password.length < 1}
        >
          Sign In
          <Lock className="button-icon" />
        </button>
        </form>     
       
        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/signup" className="auth-link">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;