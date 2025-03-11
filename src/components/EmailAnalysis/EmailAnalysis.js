import React, { useState, useEffect } from "react";
import AWS from "aws-sdk";
import "./EmailAnalysis.css";
import NavBar from "../NavBar/NavBar";
import { ShieldAlert, Loader2, CheckCircle, XCircle } from "lucide-react";

const EmailAnalysis = () => {
  const [emailContent, setEmailContent] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [checkOptions, setCheckOptions] = useState({
    spamCheck: true,
    phishingCheck: true,
    malwareCheck: true,
  });
  const [selectedExample, setSelectedExample] = useState("");

  // Sample email templates
  const examples = {
    safe: "Dear customer,\n\nThank you for choosing AWS Secure Email Services. Your monthly subscription invoice is attached.",
    spam: "WIN A FREE AMAZON GIFT CARD NOW! Click below to claim your prize!",
    phishing: "Dear AWS User,\n\nYour account is compromised. Click below to reset your credentials immediately: http://aws-secure-update.tk"
  };

  // AWS SDK Configuration
  AWS.config.update({
    region: "us-east-1",  // Change to your AWS region
    credentials: new AWS.Credentials("YOUR_ACCESS_KEY", "YOUR_SECRET_KEY"),
  });

  const comprehend = new AWS.Comprehend();

  useEffect(() => {
    if (selectedExample) {
      setEmailContent(examples[selectedExample] || "");
    }
  }, [selectedExample]);

  const analyzeEmail = async () => {
    if (!emailContent.trim()) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const params = {
        Text: emailContent,
        LanguageCode: "en",
      };

      // Sentiment Analysis
      const sentimentData = await comprehend.detectSentiment(params).promise();
      const sentiment = sentimentData.Sentiment;

      // Key Phrase Extraction
      const keyPhrasesData = await comprehend.detectKeyPhrases(params).promise();
      const keyPhrases = keyPhrasesData.KeyPhrases.map((phrase) => phrase.Text.toLowerCase());

      const issues = [];

      // Spam detection
      if (checkOptions.spamCheck && keyPhrases.some((word) => /win|free|offer|prize/i.test(word))) {
        issues.push("Spam-like language detected");
      }

      // Phishing detection
      if (checkOptions.phishingCheck && keyPhrases.some((word) => /verify|click|login|aws-security/i.test(word))) {
        issues.push("Phishing attempt suspected");
      }

      // Malware detection
      if (checkOptions.malwareCheck && keyPhrases.some((word) => /attachment|download|.exe|enable macros/i.test(word))) {
        issues.push("Potential malware threat detected");
      }

      let status = "safe";
      if (issues.length > 2) status = "danger";
      else if (issues.length > 0) status = "warning";

      setAnalysisResult({ status, issues, sentiment });
    } catch (error) {
      console.error("Error analyzing email:", error);
    }

    setIsAnalyzing(false);
  };

  return (
    <div className="email-analysis-container">
      <NavBar />
      <h2>Email Threat Detection (AWS Secure)</h2>
      <p>Analyze emails for potential phishing, spam, and malware threats using AWS Comprehend.</p>

      <select className="examples-dropdown" value={selectedExample} onChange={(e) => setSelectedExample(e.target.value)}>
        <option value="">-- Select an Example --</option>
        <option value="safe">Safe Email</option>
        <option value="spam">Spam Email</option>
        <option value="phishing">Phishing Email</option>
      </select>

      <textarea
        className="email-input"
        value={emailContent}
        onChange={(e) => setEmailContent(e.target.value)}
        placeholder="Paste email content here..."
      />

      <div className="checkbox-group">
        {Object.keys(checkOptions).map((key) => (
          <label key={key} className="checkbox-label">
            <input
              type="checkbox"
              checked={checkOptions[key]}
              onChange={() => setCheckOptions({ ...checkOptions, [key]: !checkOptions[key] })}
            />
            {key.replace("Check", " Check").toUpperCase()}
          </label>
        ))}
      </div>

      <button className="analyze-button" onClick={analyzeEmail} disabled={isAnalyzing}>
        {isAnalyzing ? <Loader2 className="spinner" /> : "Analyze Email"}
      </button>

      {analysisResult && (
        <div className={`result-card ${analysisResult.status}`}>
          {analysisResult.status === "safe" && <CheckCircle className="icon safe" />}
          {analysisResult.status === "warning" && <ShieldAlert className="icon warning" />}
          {analysisResult.status === "danger" && <XCircle className="icon danger" />}

          <h3>{analysisResult.status === "safe" ? "No Threats Detected" : "Threats Found"}</h3>

          {analysisResult.issues.length > 0 ? (
            <ul>
              {analysisResult.issues.map((issue, idx) => (
                <li key={idx}>{issue}</li>
              ))}
            </ul>
          ) : (
            <p>No issues detected.</p>
          )}

          <p><strong>Sentiment Analysis:</strong> {analysisResult.sentiment}</p>
        </div>
      )}
    </div>
  );
};

export default EmailAnalysis;
