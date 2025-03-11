import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, User, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { CognitoUserPool, CognitoUserAttribute, CognitoUser } from 'amazon-cognito-identity-js';
import './Signup.css';

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  
  // Cognito User Pool configuration
  const poolData = {
    UserPoolId: 'us-east-1_nUgA57dcy',
    ClientId: '4mg1ea8gb3hd998asfe0hm0l7k'
  };
  
  const userPool = new CognitoUserPool(poolData);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const passwordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const getPasswordStrengthText = () => {
    const strength = passwordStrength();
    if (strength === 0) return '';
    if (strength === 1) return 'Weak';
    if (strength === 2) return 'Fair';
    if (strength === 3) return 'Good';
    return 'Strong';
  };

  const getPasswordStrengthColor = () => {
    const strength = passwordStrength();
    if (strength === 1) return 'bg-red-500';
    if (strength === 2) return 'bg-yellow-500';
    if (strength === 3) return 'bg-blue-500';
    if (strength === 4) return 'bg-green-500';
    return '';
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    
    if (passwordStrength() < 2) {
      setErrorMessage('Password is too weak');
      return;
    }
    
    setLoading(true);
    setErrorMessage('');
    
    // Define Cognito user attributes
    const attributeList = [
      new CognitoUserAttribute({
        Name: 'name',
        Value: name
      }),
      new CognitoUserAttribute({
        Name: 'email',
        Value: email
      })
    ];
    
    try {
      // Sign up the user in Cognito
      userPool.signUp(email, password, attributeList, null, (err, result) => {
        setLoading(false);
        
        if (err) {
          console.error('Error during signup:', err);
          setErrorMessage(err.message || 'An error occurred during signup');
          return;
        }
        
        // Success - user account created
        console.log('User signup successful:', result);
        setConfirmationSent(true);
      });
    } catch (error) {
      setLoading(false);
      console.error('Exception during signup:', error);
      setErrorMessage('An unexpected error occurred');
    }
  };

  const handleConfirmation = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    
    const userData = {
      Username: email,
      Pool: userPool
    };
    
    const cognitoUser = new CognitoUser(userData);
    
    cognitoUser.confirmRegistration(confirmationCode, true, (err, result) => {
      setLoading(false);
      
      if (err) {
        console.error('Error confirming signup:', err);
        setErrorMessage(err.message || 'Failed to confirm signup');
        return;
      }
      
      // Success - redirect to login
      console.log('Confirmation successful:', result);
      navigate('/');
    });
  };
  
  // Render confirmation form if confirmation code needs to be entered
  if (confirmationSent) {
    return (
      <div className="auth-container">
        <div className="background-elements">
          <div className="bg-element bg-element-1"></div>
          <div className="bg-element bg-element-2"></div>
        </div>
        
        <div className={`auth-card ${isVisible ? 'visible' : 'hidden'}`}>
          <div className="auth-header">
            <div className="auth-badge">
              <Shield className="badge-icon" />
              <span>Email Verification</span>
            </div>
            <h1 className="auth-title">Confirm Your <span className="highlight">Account</span></h1>
            <p className="auth-subtitle">We've sent a confirmation code to your email. Please enter it below.</p>
          </div>
          
          <form onSubmit={handleConfirmation} className="auth-form">
            <div className="form-group">
              <label htmlFor="confirmationCode" className="form-label">Confirmation Code</label>
              <div className="input-wrapper">
                <Lock className="input-icon" />
                <input 
                  type="text" 
                  id="confirmationCode" 
                  className="form-input" 
                  placeholder="Enter your code" 
                  value={confirmationCode} 
                  onChange={(e) => setConfirmationCode(e.target.value)} 
                  required 
                />
              </div>
            </div>
            
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            
            <div className="form-action">
              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify Account'} <Shield className="button-icon" />
              </button>
              <div className="auth-footer">
                <p>Didn't receive a code? <button type="button" className="auth-link">Resend Code</button></p>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Main signup form
  return (
    <div className="auth-container">
      <div className="background-elements">
        <div className="bg-element bg-element-1"></div>
        <div className="bg-element bg-element-2"></div>
      </div>
      
      <div className={`auth-card ${isVisible ? 'visible' : 'hidden'}`}>
        <div className="auth-header">
          <div className="auth-badge">
            <Shield className="badge-icon" />
            <span>Secure Authentication</span>
          </div>
          <h1 className="auth-title">Get <span className="highlight">Started</span></h1>
        </div>
        
        <form onSubmit={handleSignup} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name" className="form-label">Full Name</label>
              <div className="input-wrapper">
                <User className="input-icon" />
                <input 
                  type="text" 
                  id="name" 
                  className="form-input" 
                  placeholder="John Doe" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                />
              </div>
            </div>
            
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
          </div>
          
          <div className="form-row">
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
              {password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div 
                      className={`strength-indicator ${getPasswordStrengthColor()}`} 
                      style={{ width: `${passwordStrength() * 25}%` }}
                    ></div>
                  </div>
                  <span className="strength-text">{getPasswordStrengthText()}</span>
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="confirmPassword" 
                  className="form-input" 
                  placeholder="••••••••" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required 
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="error-message">Passwords do not match</p>
              )}
            </div>
          </div>
          
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          
          <div className="form-action">
            <button 
              type="submit" 
              className="auth-button" 
              disabled={password !== confirmPassword || passwordStrength() < 2 || loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'} <Shield className="button-icon" />
            </button>
            
            <div className="auth-footer">
              <Link to="/" className="back-link">
                <ArrowLeft className="back-icon" />
                Back to Login
              </Link>
            </div>
            
            <div className="auth-footer">
              <p>Already have an account? <Link to="/" className="auth-link">Sign in</Link></p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;