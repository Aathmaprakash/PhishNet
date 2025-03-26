import React, { useState, useEffect } from "react";
import { ShieldAlert, Loader2, CheckCircle, AlertTriangle, XCircle, Mail, Link, CreditCard, FileWarning, Lock, Info } from "lucide-react";
import "./EmailAnalysis.css";
import NavBar from "../NavBar/NavBar";

const EmailPhishingDetection = () => {
  const [emailContent, setEmailContent] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [checkOptions, setCheckOptions] = useState({
    urlAnalysis: true,
    sensitiveInfoCheck: true,
    brandSpoofing: true,
    socialEngineering: true
  });
  const [selectedExample, setSelectedExample] = useState("");
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [showTips, setShowTips] = useState(false);

  // Enhanced phishing example templates
  const examples = {
    safe: "Dear valued customer,\n\nThank you for your recent purchase from our online store. Your order #45789 has been processed and will be shipped within 2 business days.\n\nFor any questions, please contact our customer support at support@legitimatecompany.com or call us at (555) 123-4567.\n\nBest regards,\nCustomer Service Team\nLegitimate Company Inc.",
    
    spoofing: "URGENT: Your Amazon Account Has Been Suspended\n\nDear Customer,\n\nWe have detected unusual activity on your Amazon account. Your account has been temporarily suspended.\n\nTo restore your account access, please verify your information immediately by clicking on the link below:\n\nhttp://amazon-account-verify.tk/secure.php\n\nFailure to verify within 24 hours will result in permanent account suspension.\n\nAmazon Security Team",
    
    credential: "**Important Security Alert**\n\nDear User,\n\nYour Microsoft 365 password will expire in 24 hours. To avoid service interruption, please update your credentials immediately.\n\nClick here to update your password: https://microsoft-365-update.info/login\n\nRequired information:\n- Current email\n- Current password\n- New password\n\nIT Security Department",
    
    financial: "Notice: Unusual Transaction Activity\n\nDear Bank Customer,\n\nOur security systems have detected unusual transactions on your account. To prevent unauthorized charges, please verify your banking details immediately.\n\nClick here to secure your account: http://bank-secure-portal.com/verify\n\nYou will need to provide:\n- Full name\n- Account number\n- Social Security Number\n- Card verification code\n\nBank Security Team"
  };

  useEffect(() => {
    if (selectedExample) {
      setEmailContent(examples[selectedExample] || "");
    }
  }, [selectedExample]);

  // More sophisticated phishing detection analysis with improved patterns
  const analyzeEmail = () => {
    if (!emailContent.trim()) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);

    // Simulate API request timing with a more realistic delay
    setTimeout(() => {
      const issues = [];
      const details = [];
      let threatLevel = "safe";
      let score = 0;
      
      // URL analysis with improved pattern detection
      if (checkOptions.urlAnalysis) {
        const urlRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
        const urls = emailContent.match(urlRegex) || [];
        
        // Enhanced suspicious domain detection
        const suspiciousDomains = urls.filter(url => {
          const domain = url.toLowerCase();
          return domain.includes('-secure') || 
                 domain.includes('.tk') || 
                 domain.includes('.info') || 
                 domain.includes('.xyz') ||
                 domain.includes('.cc') ||
                 domain.includes('verify') ||
                 domain.includes('login') ||
                 domain.includes('account') ||
                 domain.includes('secure') ||
                 domain.includes('update') ||
                 (domain.includes('amazon') && !domain.includes('amazon.com')) ||
                 (domain.includes('microsoft') && !domain.includes('microsoft.com')) ||
                 (domain.includes('paypal') && !domain.includes('paypal.com')) ||
                 (domain.includes('apple') && !domain.includes('apple.com')) ||
                 (domain.includes('google') && !domain.includes('google.com')) ||
                 (domain.includes('bank') && !domain.endsWith('.bank.com'));
        });
        
        if (suspiciousDomains.length > 0) {
          issues.push("Suspicious URLs detected");
          details.push(`Found ${suspiciousDomains.length} suspicious links that may lead to phishing sites: ${suspiciousDomains.join(', ')}`);
          score += 35;
        }
        
        // URL/text mismatch detection
        const linkTextMismatches = urls.some(url => {
          const lowerEmail = emailContent.toLowerCase();
          const urlIndex = lowerEmail.indexOf(url.toLowerCase());
          
          // Check 10 characters before URL for misleading text
          if (urlIndex >= 10) {
            const textBefore = lowerEmail.substring(urlIndex - 10, urlIndex);
            if ((textBefore.includes('amazon') && !url.includes('amazon.com')) ||
                (textBefore.includes('paypal') && !url.includes('paypal.com')) ||
                (textBefore.includes('microsoft') && !url.includes('microsoft.com'))) {
              return true;
            }
          }
          return false;
        });
        
        if (linkTextMismatches) {
          issues.push("Misleading link text");
          details.push("Email contains links where the displayed text doesn't match the actual URL destination");
          score += 15;
        }
      }
      
      // Enhanced sensitive information requests check
      if (checkOptions.sensitiveInfoCheck) {
        const sensitivePatterns = [
          /password/i, 
          /credit\s?card/i, 
          /social\s?security/i, 
          /ssn/i, 
          /account\s?number/i, 
          /login/i,
          /credentials/i,
          /verify.{1,20}(information|details|account|identity)/i,
          /bank.{1,15}details/i,
          /personal\s?information/i,
          /billing\s?information/i,
          /update.{1,15}(account|information|details)/i,
          /mother('s)?\s?maiden\s?name/i,
          /security\s?question/i,
          /pin\s?number/i,
          /date\s?of\s?birth/i
        ];
        
        const foundPatterns = sensitivePatterns.filter(pattern => pattern.test(emailContent));
        
        if (foundPatterns.length > 0) {
          issues.push("Requests for sensitive information");
          details.push(`Email requests personal or financial information (${foundPatterns.length} instances) which legitimate organizations rarely do via email`);
          score += 25;
        }
      }
      // Brand spoofing detection
      if (checkOptions.brandSpoofing) {
        const brands = [
          { name: /amazon/i, legitimate: /(@amazon\.com|from: amazon)/i },
          { name: /paypal/i, legitimate: /(@paypal\.com|from: paypal)/i },
          { name: /microsoft/i, legitimate: /(@microsoft\.com|from: microsoft)/i },
          { name: /apple/i, legitimate: /(@apple\.com|from: apple)/i },
          { name: /google/i, legitimate: /(@google\.com|from: google)/i },
          { name: /bank/i, legitimate: /(@[a-z]+bank\.com|from: [a-z]+bank)/i }
        ];
        
        const spoofedBrands = brands.filter(brand => 
          brand.name.test(emailContent) && !brand.legitimate.test(emailContent)
        );
        
        if (spoofedBrands.length > 0) {
          issues.push("Potential brand impersonation");
          details.push("Email appears to come from a well-known company but lacks legitimate sender information");
          score += 20;
        }
      }
      
      // Social engineering tactics detection
      if (checkOptions.socialEngineering) {
        const urgencyPatterns = [
          /urgent/i, 
          /immediate/i, 
          /alert/i, 
          /security.{1,10}(breach|alert|issue)/i, 
          /suspicious.{1,10}activity/i,
          /limited time/i,
          /expires.{1,15}(hours|today)/i,
          /suspended/i,
          /unauthorized/i
        ];
        
        const foundUrgencyPatterns = urgencyPatterns.filter(pattern => pattern.test(emailContent));
        
        if (foundUrgencyPatterns.length > 0) {
          issues.push("Social engineering tactics detected");
          details.push("Email uses urgency or fear to prompt immediate action, a common phishing tactic");
          score += 20;
        }
      }
      
      // Determine overall threat level
      if (score >= 60) {
        threatLevel = "danger";
      } else if (score >= 30) {
        threatLevel = "warning";
      }
      
      setConfidenceScore(score);
      setAnalysisResult({ status: threatLevel, issues, details });
      setIsAnalyzing(false);
    }, 1500);
  };

  const getConfidenceClass = () => {
    if (confidenceScore >= 60) return "low";
    if (confidenceScore >= 30) return "medium";
    return "high";
  };

  const renderResultIcon = () => {
    switch (analysisResult?.status) {
      case "safe":
        return <CheckCircle className="result-icon" size={28} color="#10b981" />;
      case "warning":
        return <AlertTriangle className="result-icon" size={28} color="#f59e0b" />;
      case "danger":
        return <XCircle className="result-icon" size={28} color="#ef4444" />;
      default:
        return null;
    }
  };

  return (
    <div className="email-analysis-container">
      <NavBar />
      <h1 className="analysis-heading">Email Phishing Detection</h1>
      <p className="analysis-subheading">
        Analyze emails to identify potential phishing attempts and protect your personal and financial information.
      </p>

      <div className="examples-dropdown">
        <select value={selectedExample} onChange={(e) => setSelectedExample(e.target.value)}>
          <option value="">-- Select an Example Email --</option>
          <option value="safe">Safe Email (Legitimate)</option>
          <option value="spoofing">Brand Spoofing Email</option>
          <option value="credential">Credential Harvesting Email</option>score 
          <option value="financial">Financial Information Phishing</option>
        </select>
      </div>

      <div className="input-section">
        <textarea
          className="email-input"
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          placeholder="Paste the email content you want to analyze..."
        />
      </div>

      <div className="checkbox-group">
        <label className="checkbox-label">
          <input
            className="checkbox-input"
            type="checkbox"
            checked={checkOptions.urlAnalysis}
            onChange={() => setCheckOptions({ ...checkOptions, urlAnalysis: !checkOptions.urlAnalysis })}
          />
          <Link size={16} />
          URL ANALYSIS
        </label>
        
        <label className="checkbox-label">
          <input
            className="checkbox-input"
            type="checkbox"
            checked={checkOptions.sensitiveInfoCheck}
            onChange={() => setCheckOptions({ ...checkOptions, sensitiveInfoCheck: !checkOptions.sensitiveInfoCheck })}
          />
          <CreditCard size={16} />
          SENSITIVE INFO CHECK
        </label>
        
        <label className="checkbox-label">
          <input
            className="checkbox-input"
            type="checkbox"
            checked={checkOptions.brandSpoofing}
            onChange={() => setCheckOptions({ ...checkOptions, brandSpoofing: !checkOptions.brandSpoofing })}
          />
          <FileWarning size={16} />
          BRAND SPOOFING
        </label>
        
        <label className="checkbox-label">
          <input
            className="checkbox-input"
            type="checkbox"
            checked={checkOptions.socialEngineering}
            onChange={() => setCheckOptions({ ...checkOptions, socialEngineering: !checkOptions.socialEngineering })}
          />
          <Lock size={16} />
          SOCIAL ENGINEERING
        </label>
      </div>

      <button className="analyze-button" onClick={analyzeEmail} disabled={isAnalyzing || !emailContent.trim()}>
        {isAnalyzing ? (
          <>
            <Loader2 className="spinner" size={20} />
            Analyzing...
          </>
        ) : (
          <>
            <Mail size={20} />
            Analyze Email
          </>
        )}
      </button>

      {isAnalyzing && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Analyzing email content for phishing indicators...</p>
        </div>
      )}

      {analysisResult && (
        <div className={`results-section ${analysisResult.status}`}>
          <div className="result-card">
            <div className="result-header">
              {renderResultIcon()}
              <h2 className={`result-title ${analysisResult.status}`}>
                {analysisResult.status === "safe" 
                  ? "No Phishing Detected" 
                  : analysisResult.status === "warning"
                  ? "Potential Phishing Detected"
                  : "High-Risk Phishing Detected"}
              </h2>
            </div>
            
            <div className="result-details">
              {analysisResult.status === "safe" ? (
                <p>This email appears to be legitimate and does not contain common phishing indicators.</p>
              ) : (
                <>
                  <p>This email contains indicators commonly associated with phishing attempts:</p>
                  <ul className="details-list">
                    {analysisResult.issues.map((issue, idx) => (
                      <li key={idx}><strong>{issue}:</strong> {analysisResult.details[idx]}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
            
            <div className="confidence-meter">
              <div className="confidence-label">
                <span>Confidence Score</span>
                <span>{100 - confidenceScore}%</span>
              </div>
              <div className="confidence-bar">
                <div 
                  className={`confidence-fill ${getConfidenceClass()}`} 
                  style={{ width: `${100 - confidenceScore}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <button className="clear-button" onClick={() => {
            setAnalysisResult(null);
            setEmailContent("");
            setSelectedExample("");
          }}>
            Analyze Another Email
          </button>
        </div>
      )}
      
      <div className="background-elements">
        <div className="bg-element bg-element-1"></div>
        <div className="bg-element bg-element-2"></div>
      </div>
    </div>
  );
};

export default EmailPhishingDetection;