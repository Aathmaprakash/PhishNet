// EmailPhishingDetection.jsx
import React, { useState, useEffect } from "react";
import { 
  Loader2, 
  AlertTriangle, 
  CheckCircle, 
  Mail, 
  Upload, 
  Shield, 
  Eye, 
  X, 
  Info,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from "lucide-react";
import NavBar from "../NavBar/NavBar";
import "./EmailAnalysis.css";

const EmailPhishingDetection = () => {
  const [emailContent, setEmailContent] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [isExpanded, setIsExpanded] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);


  useEffect(() => {
    if (analysisResult) {
      const resultsElement = document.querySelector('.analysis-results-wrapper');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [analysisResult]);

  
  useEffect(() => {
    if (isAnalyzing) {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);
      return () => clearInterval(interval);
    } else {
      setUploadProgress(0);
    }
  }, [isAnalyzing]);

  
  const phishingWords = [
    "urgent", "verify", "immediately", "account suspended", "security alert",
    "update your information", "suspicious activity", "password expired",
    "click here", "enter your credentials", "verify your identity",
    "lottery", "winner", "claim your prize", "inheritance", "bank transfer",
    "credit card", "social security", "login details", "banking information"
  ];

  const analyzeEmail = async () => {
    if (!emailContent.trim() && !emailSubject.trim()) {
      
      const input = document.querySelector('.email-input');
      input.classList.add('shake');
      setTimeout(() => input.classList.remove('shake'), 500);
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);
    setUploadProgress(0);

    try {
      console.group('📧 Email Analysis Request');
      console.log('Email Subject:', emailSubject);
      console.log('Email Content:', emailContent);
      console.groupEnd();

      const response = await fetch('https://rlru2wj7aa.execute-api.us-east-1.amazonaws.com/emailphishing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify({
          text: emailContent,
          subject: emailSubject
        })
      });

      if (!response.ok) {
         let errorBody = null;
         try {
            errorBody = await response.json();
         } catch (e) {
           
         }
         console.error("❌ API Response Error:", {
           status: response.status,
           statusText: response.statusText,
           errorBody
         });
         throw new Error(`API error! status: ${response.status}${errorBody ? ` - ${errorBody.error || errorBody.message || ''}` : ''}`);
      }

      const data = await response.json();
      
    
      console.group('🔍 Email Analysis Results');
      console.log('Full API Response:', data);
      
      console.group('📊 Risk Assessment');
      console.log('Risk Level:', data.riskLevel);
      console.log('Risk Score:', data.phishingIndicators?.riskScore);
      console.log('Phishing Indicators:', {
        urgencyCount: data.phishingIndicators?.urgencyCount,
        threatCount: data.phishingIndicators?.threatCount,
        actionCount: data.phishingIndicators?.actionCount,
        sensitiveInfoCount: data.phishingIndicators?.sensitiveInfoCount,
        suspiciousUrls: data.phishingIndicators?.suspiciousUrls
      });
      console.groupEnd();

      console.group('🎯 Content Analysis');
      console.log('Sentiment Analysis:', data.sentiment);
      console.log('Key Phrases:', data.keyPhrases);
      console.log('Entities:', data.entities);
      console.groupEnd();

      console.group('⏱️ Timing Information');
      console.log('Analysis Timestamp:', new Date().toISOString());
      console.groupEnd();
      
      console.groupEnd();

      setUploadProgress(100);
     
      await new Promise(resolve => setTimeout(resolve, 300));
      setAnalysisResult(data);

    } catch (error) {
      console.error('❌ Analysis Error:', {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      setAnalysisResult({
        status: "error",
        message: `Failed to analyze the email: ${error.message}`
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearEmail = () => {
    setEmailContent("");
    setEmailSubject("");
    setAnalysisResult(null);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        
     
        const subjectMatch = content.match(/Subject: (.*?)(\r?\n)/i);
        if (subjectMatch && subjectMatch[1]) {
          setEmailSubject(subjectMatch[1].trim());
        }
        
     
        const bodyStart = content.indexOf("\r\n\r\n");
        if (bodyStart > -1) {
          setEmailContent(content.substring(bodyStart).trim());
        } else {
          setEmailContent(content);
        }
      };
      reader.readAsText(file);
    }
  };

  const toggleSection = (section) => {
    setIsExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="email-phishing-container bg-slate-50 min-h-screen">
      <div className="background-elements" aria-hidden="true">
        <div className="bg-element bg-element-1 bg-blue-100 rounded-full opacity-20 w-96 h-96 fixed -top-20 -left-20 blur-3xl"></div>
        <div className="bg-element bg-element-2 bg-indigo-100 rounded-full opacity-20 w-96 h-96 fixed -bottom-20 -right-20 blur-3xl"></div>
      </div>
      <NavBar />

      <div className="page-content max-w-6xl mx-auto px-4 py-8">
        <div className="analysis-content bg-white rounded-xl shadow-lg p-6 relative overflow-hidden border border-slate-100">
          <div className="flex items-center mb-6">
            <Shield className="text-blue-600 mr-3" size={28} />
            <div>
              <h1 className="analysis-heading text-2xl font-bold text-slate-800">Email Phishing Detection</h1>
              <p className="analysis-subheading text-slate-500">Upload or paste an email to analyze for phishing threats</p>
            </div>
            <button 
              className="ml-auto text-slate-400 hover:text-blue-600 transition-colors"
              onClick={() => setShowHelp(!showHelp)}
              aria-label="Show help information"
            >
              <Info size={20} />
            </button>
          </div>

          {showHelp && (
            <div className="help-panel bg-blue-50 p-4 rounded-lg mb-6 relative">
              <button 
                className="absolute top-2 right-2 text-slate-500 hover:text-slate-700"
                onClick={() => setShowHelp(false)}
              >
                <X size={16} />
              </button>
              <h3 className="font-medium text-blue-800 mb-2">How it works</h3>
              <p className="text-sm text-slate-600 mb-2">
                This tool analyzes email content using natural language processing to detect potential phishing attempts.
                It checks for:
              </p>
              <ul className="text-sm text-slate-600 list-disc list-inside mb-2">
                <li>Suspicious language and common phishing phrases</li>
                <li>Emotional manipulation tactics</li>
                <li>Suspicious URLs or requests for sensitive information</li>
                <li>Overall sentiment and context using AWS Comprehend</li>
              </ul>
              <p className="text-sm text-slate-600">
                For best results, include the complete email content including headers.
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4 mb-4">

            <div className="upload-section">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email File (optional)
              </label>
              <label htmlFor="file-upload" className="file-upload-label flex items-center justify-center gap-2 w-full px-4 py-2 bg-slate-50 text-slate-700 rounded-lg border border-slate-200 hover:bg-slate-100 cursor-pointer transition-colors">
                <Upload size={18} />
                <span className="text-sm">Upload Email File</span>
                <input
                  id="file-upload"
                  type="file"
                  accept=".txt,.eml"
                  className="sr-only"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="email-content" className="block text-sm font-medium text-slate-700 mb-1">
              Email Content
            </label>
            <textarea
              id="email-content"
              className="email-input w-full px-4 py-3 h-64 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              placeholder="Paste or upload email content here..."
            />
          </div>

          <div className="button-group flex flex-wrap gap-3">
            <button
              className="analyze-button flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:pointer-events-none"
              onClick={analyzeEmail}
              disabled={isAnalyzing || !emailContent.trim()}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Analyzing... {uploadProgress}%</span>
                </>
              ) : (
                <Shield size={18} />
              )}
            </button>
            
            <button
              className="clear-button flex items-center gap-2 px-6 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:pointer-events-none"
              onClick={clearEmail}
              disabled={!emailContent && !emailSubject}
            >
              <X size={18} />
              Clear
            </button>
          </div>

          {isAnalyzing && (
            <div className="loading-indicator flex items-center justify-center bg-blue-50 rounded-lg p-6 mt-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <Loader2 className="animate-spin text-blue-600" size={40} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-2 border-blue-200 border-t-blue-600 animate-spin"></div>
                  </div>
                </div>
                <span className="text-blue-800 font-medium">Analyzing email content...</span>
                <div className="w-full max-w-md bg-blue-100 rounded-full h-2 mt-4">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <span className="text-slate-500 text-sm mt-3">Running advanced threat detection</span>
              </div>
            </div>
          )}

          {analysisResult && analysisResult.phishingIndicators && (
            <div className={`analysis-results-wrapper mt-8 rounded-xl border overflow-hidden shadow-lg ${
              analysisResult.riskLevel === "LOW" ? "border-green-200 bg-green-50/30"
              : analysisResult.riskLevel === "MEDIUM" ? "border-yellow-200 bg-yellow-50/30"
              : analysisResult.riskLevel === "HIGH" ? "border-red-200 bg-red-50/30"
              : "border-red-300 bg-red-50/30"
            }`}>
              <div className={`analysis-results-header p-6 flex flex-col gap-4 border-b ${
                analysisResult.riskLevel === "LOW" ? "bg-green-50 border-green-100"
                : analysisResult.riskLevel === "MEDIUM" ? "bg-yellow-50 border-yellow-100"
                : analysisResult.riskLevel === "HIGH" ? "bg-red-50 border-red-100"
                : "bg-red-100 border-red-200"
              }`}>
                <div className="flex items-center gap-4">
                  <div className={`result-icon p-3 rounded-full ${
                    analysisResult.riskLevel === "LOW" ? "bg-green-100 text-green-600"
                    : analysisResult.riskLevel === "MEDIUM" ? "bg-yellow-100 text-yellow-600"
                    : analysisResult.riskLevel === "HIGH" ? "bg-red-100 text-red-600"
                    : "bg-red-200 text-red-700"
                  }`}>
                    {analysisResult.riskLevel === "LOW" ? (
                      <CheckCircle size={32} />
                    ) : (
                      <AlertTriangle size={32} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="result-title font-bold text-2xl mb-2">
                      {analysisResult.riskLevel === "LOW" ? "Low Phishing Risk"
                      : analysisResult.riskLevel === "MEDIUM" ? "Medium Phishing Risk"
                      : analysisResult.riskLevel === "HIGH" ? "High Phishing Risk"
                      : "Critical Phishing Risk"}
                    </h2>
                    <div className="flex flex-col gap-2">
                      <div className="risk-score-display bg-white rounded-lg p-4 border border-slate-100">
                        <div className="text-sm font-medium text-slate-600 mb-1">Risk Score</div>
                        <div className={`text-3xl font-bold ${
                          analysisResult.riskLevel === "LOW" ? "text-green-600"
                          : analysisResult.riskLevel === "MEDIUM" ? "text-yellow-600"
                          : analysisResult.riskLevel === "HIGH" ? "text-red-600"
                          : "text-red-700"
                        }`}>
                          {analysisResult.riskScore || 0}
                          <span className="text-lg font-medium text-slate-500">/100</span>
                        </div>
                        <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              analysisResult.riskLevel === "LOW" ? "bg-green-500"
                              : analysisResult.riskLevel === "MEDIUM" ? "bg-yellow-500"
                              : analysisResult.riskLevel === "HIGH" ? "bg-red-500"
                              : "bg-red-600"
                            }`}
                            style={{ width: `${analysisResult.riskScore || 0}%` }}
                          />
                        </div>
                      </div>
                      <div className="analysis-time text-sm text-slate-500 bg-white rounded-lg p-2 border border-slate-100">
                        Analyzed at {new Date().toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="analysis-results-content p-6 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Phishing Indicators Card */}
                  <div className="phishing-indicators-card bg-white rounded-lg p-6 border border-slate-100">
                    <h3 className="section-title text-lg font-semibold text-slate-800 mb-6 pb-2 border-b border-slate-100">
                      Phishing Indicators
                    </h3>
                    
                    <div className="grid grid-cols-1 gap-6">
                      <div className="indicator-stats space-y-4">
                        <div className="stat-item bg-slate-50 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-slate-600">Urgency Level:</span>
                            <span className={`text-sm font-semibold ${
                              analysisResult.phishingIndicators.urgency?.count > 2 ? 'text-red-600' : 'text-slate-700'
                            }`}>
                              {analysisResult.phishingIndicators.urgency?.count || 0}
                            </span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                analysisResult.phishingIndicators.urgency?.count > 2 ? 'bg-red-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${Math.min((analysisResult.phishingIndicators.urgency?.count || 0) * 25, 100)}%` }}
                            />
                          </div>
                        </div>

                        <div className="stat-item bg-slate-50 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-slate-600">Threat Count:</span>
                            <span className={`text-sm font-semibold ${
                              analysisResult.phishingIndicators.threat?.count > 1 ? 'text-red-600' : 'text-slate-700'
                            }`}>
                              {analysisResult.phishingIndicators.threat?.count || 0}
                            </span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                analysisResult.phishingIndicators.threat?.count > 1 ? 'bg-red-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${Math.min((analysisResult.phishingIndicators.threat?.count || 0) * 50, 100)}%` }}
                            />
                          </div>
                        </div>

                        <div className="stat-item bg-slate-50 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-slate-600">Action Requests:</span>
                            <span className="text-sm font-semibold text-slate-700">
                              {analysisResult.phishingIndicators.action?.count || 0}
                            </span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full bg-blue-500"
                              style={{ width: `${Math.min((analysisResult.phishingIndicators.action?.count || 0) * 25, 100)}%` }}
                            />
                          </div>
                        </div>

                        <div className="stat-item bg-slate-50 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-slate-600">Sensitive Info Requests:</span>
                            <span className={`text-sm font-semibold ${
                              analysisResult.phishingIndicators.sensitiveInfo?.count > 0 ? 'text-red-600' : 'text-slate-700'
                            }`}>
                              {analysisResult.phishingIndicators.sensitiveInfo?.count || 0}
                            </span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                analysisResult.phishingIndicators.sensitiveInfo?.count > 0 ? 'bg-red-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${Math.min((analysisResult.phishingIndicators.sensitiveInfo?.count || 0) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Suspicious URLs Card */}
                      <div className="suspicious-urls-card bg-slate-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-sm font-semibold text-slate-700">Suspicious URLs</h4>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            analysisResult.phishingIndicators.suspiciousUrls?.length > 0 
                              ? "bg-red-100 text-red-700" 
                              : "bg-green-100 text-green-700"
                          }`}>
                            {analysisResult.phishingIndicators.suspiciousUrls?.length || 0} URLs Found
                          </span>
                        </div>
                        {analysisResult.phishingIndicators.suspiciousUrls?.length > 0 ? (
                          <div className="url-list space-y-2 max-h-48 overflow-y-auto pr-2">
                            {analysisResult.phishingIndicators.suspiciousUrls.map((url, idx) => (
                              <div 
                                key={idx} 
                                className="url-item bg-white border border-red-100 rounded-lg p-3 flex items-start gap-2 hover:bg-red-50 transition-colors"
                              >
                                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-red-700 break-all">{url}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="no-urls-message bg-white border border-green-100 rounded-lg p-4 text-center">
                            <p className="text-sm text-green-700">No suspicious URLs detected</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content Analysis Card */}
                  <div className="content-analysis-card bg-white rounded-lg p-6 border border-slate-100">
                    <h3 className="section-title text-lg font-semibold text-slate-800 mb-6 pb-2 border-b border-slate-100">
                      Content Analysis
                    </h3>

                    <div className="space-y-6">
                      {/* Sentiment Analysis */}
                      <div className="sentiment-analysis">
                        <h4 className="text-sm font-semibold text-slate-700 mb-4">Sentiment Analysis</h4>
                        <div className="sentiment-display bg-slate-50 rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              analysisResult.sentiment?.overall === "POSITIVE" ? "bg-green-100 text-green-800"
                              : analysisResult.sentiment?.overall === "NEGATIVE" ? "bg-red-100 text-red-800"
                              : analysisResult.sentiment?.overall === "MIXED" ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                            }`}>
                              {analysisResult.sentiment?.overall || 'NEUTRAL'}
                            </span>
                          </div>
                          {analysisResult.sentiment?.scores && (
                            <div className="sentiment-scores grid grid-cols-2 gap-4">
                              {Object.entries(analysisResult.sentiment.scores).map(([sentiment, score]) => (
                                <div key={sentiment} className="score-item bg-white rounded-lg p-3 border border-slate-100">
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-slate-600 capitalize">{sentiment}</span>
                                    <span className={`text-sm font-semibold ${
                                      sentiment === "NEGATIVE" && score > 0.5 ? "text-red-600"
                                      : sentiment === "POSITIVE" && score > 0.5 ? "text-green-600"
                                      : "text-slate-700"
                                    }`}>
                                      {Math.abs(Math.round(score * 100))}%
                                    </span>
                                  </div>
                                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full rounded-full ${
                                        sentiment === "NEGATIVE" ? "bg-red-500"
                                        : sentiment === "POSITIVE" ? "bg-green-500"
                                        : "bg-blue-500"
                                      }`}
                                      style={{ width: `${Math.round(score * 100)}%` }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {analysisResult && analysisResult.status === "error" && (
            <div className="error-message mt-6 bg-red-100 border border-red-300 text-red-800 rounded-lg p-4 flex items-start gap-3 shadow-md">
              <AlertTriangle size={24} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Analysis Failed</h3>
                <p className="text-sm">{analysisResult.message}</p>
                <p className="text-xs text-red-700 mt-2">Please check your connection or the API service and try again.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailPhishingDetection;