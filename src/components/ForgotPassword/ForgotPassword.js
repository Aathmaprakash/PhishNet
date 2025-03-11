import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useState(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle password reset logic here
    setIsSubmitted(true);
  };

  return (
    <div className="auth-container">
      {/* Background Elements */}
      <div className="background-elements">
        <div className="bg-element bg-element-1"></div>
        <div className="bg-element bg-element-2"></div>
      </div>

      <div className={`auth-card ${isVisible ? 'visible' : 'hidden'}`}>
        <div className="auth-header">
          <div className="auth-badge">
            <Shield className="badge-icon" />
            <span>Password Recovery</span>
          </div>

          <h1 className="auth-title">Reset your <span className="highlight">Password</span></h1>
          <p className="auth-description">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        {!isSubmitted ? (
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

            <button 
              type="submit" 
              className="auth-button"
              disabled={!email.includes('@')}
            >
              Send Reset Instructions
            </button>
          </form>
        ) : (
          <div className="success-message">
            <CheckCircle className="success-icon" />
            <p>Reset instructions have been sent to your email.</p>
          </div>
        )}

        <div className="auth-footer">
          <Link to="/" className="back-link">
            <ArrowLeft className="back-icon" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 