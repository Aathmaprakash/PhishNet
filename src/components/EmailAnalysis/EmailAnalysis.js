// EmailPhishingDetection.jsx
import React, { useState } from "react";
import { Loader2, AlertTriangle, CheckCircle, Mail, Upload } from "lucide-react";
import NavBar from "../NavBar/NavBar";
import "./EmailAnalysis.css";

const EmailPhishingDetection = () => {
  const [emailContent, setEmailContent] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const phishingWords = [
    "urgent", "immediate", "alert", "expires", "suspended", "verify", 
    "account locked", "security warning", "update password"
  ];




  
  const analyzeEmail = () => {
    if (!emailContent.trim()) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);

    setTimeout(() => {
      let foundWords = phishingWords.filter(word =>
        new RegExp(`\\b${word}\\b`, "i").test(emailContent)
      );
      
      if (foundWords.length > 0) {
        setAnalysisResult({ status: "danger", issues: foundWords });
      } else {
        setAnalysisResult({ status: "safe", issues: [] });
      }
      
      setIsAnalyzing(false);
    }, 1500);
  };

  const clearEmail = () => {
    setEmailContent("");
    setAnalysisResult(null);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEmailContent(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="email-phishing-container">
    <div className="background-elements" aria-hidden="true">
        <div className="bg-element bg-element-1"></div>
        <div className="bg-element bg-element-2"></div>
      </div>
      <NavBar />
      
      <div className="page-content">
        <div className="analysis-content">
          <h1 className="analysis-heading">Email Phishing Detection</h1>
          <p className="analysis-subheading">Upload an email file to analyze for phishing threats.</p>

          <div className="upload-section">
            <label htmlFor="file-upload" className="file-upload-label">
              <Upload size={20} />
              <span>Upload Email File</span>
              <input
                id="file-upload"
                type="file"
                accept=".txt,.eml"
                className="file-upload-input"
                onChange={handleFileUpload}
              />
            </label>
          </div>

          <textarea
            className="email-input"
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            placeholder="Paste or upload email content here..."
          />

          <div className="button-group">
            <button 
              className="analyze-button" 
              onClick={analyzeEmail} 
              disabled={isAnalyzing || !emailContent.trim()}
            >
              {isAnalyzing ? <Loader2 className="spinner" size={20} /> : <Mail size={20} />}
              {isAnalyzing ? " Analyzing..." : " Analyze Email"}
            </button>
            <button 
              className="clear-button" 
              onClick={clearEmail}
              disabled={!emailContent}
            >
              Clear
            </button>
          </div>

          {isAnalyzing && (
            <div className="loading-indicator">
              <Loader2 className="spinner" size={20} />
              <span>Analyzing email content...</span>
            </div>
          )}

          {analysisResult && (
            <div className={`results-section ${analysisResult.status}`}>
              <div className="result-content">
                {analysisResult.status === "safe" ? (
                  <CheckCircle size={28} color="#10b981" />
                ) : (
                  <AlertTriangle size={28} color="#f59e0b" />
                )}
                <div className="result-details">
                  <h2 className="result-title">
                    {analysisResult.status === "safe" ? "No Phishing Detected" : "Phishing Risk Detected"}
                  </h2>
                  <ul className="issue-list">
                    {analysisResult.issues.length > 0 ? (
                      analysisResult.issues.map((issue, idx) => (
                        <li key={idx} className="issue-item">
                          <span className="issue-marker">!</span>
                          <span>Suspicious Word: {issue}</span>
                        </li>
                      ))
                    ) : (
                      <li className="no-issues">No phishing indicators found.</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailPhishingDetection;