# 🎣 PhishNet – Serverless Phishing & Email Legitimacy Detector on AWS

> ⚡ Real-time phishing URL and email content analysis powered entirely by AWS cloud services.  
> Built with React frontend and fully serverless backend.

---

## 🚀 Project Overview

**PhishNet** is a real-time phishing detection system that empowers users to verify the legitimacy of emails and URLs. It leverages multiple AWS services to deliver a **secure, scalable, and intelligent** analysis workflow.

This project features:
- 🔐 Authentication via AWS Cognito
- 🧠 NLP & phishing detection via AWS Lambda + AWS Comprehend
- 🌐 Secure routing through Amazon API Gateway
- 🖥️ React-based frontend (not yet deployed)
- 🛠️ Optional additions: S3 for hosting, DynamoDB for user history

---

## 🧠 Key Features

- ✅ Analyze email content and embedded links for phishing indicators
- 🔒 Secure user registration/login using AWS Cognito
- 🧠 Detect suspicious content using AWS Comprehend (NLP)
- 📡 Route all traffic via API Gateway to AWS Lambda
- ⚙️ Fully serverless — no EC2 or traditional servers used

---

## 🛠️ Tech Stack

| Layer           | Technology                        |
|-----------------|------------------------------------|
| Frontend        | React (JavaScript)                 |
| Authentication  | AWS Cognito                        |
| API Management  | Amazon API Gateway                 |
| Backend Logic   | AWS Lambda (Python script)         |
| NLP Engine      | AWS Comprehend                     |
| Optional Hosting| Amazon S3 (Static Frontend)        |
| Optional DB     | Amazon DynamoDB (for logs/history) |

---

## 🧰 Architecture

```plaintext
[React Frontend (local)]
       │
       ▼
[Amazon Cognito]
  🔐 Auth (Sign Up / Sign In)
       │
       ▼
[API Gateway]
  🌐 Routes requests
       │
       ▼
[AWS Lambda (Python)]
  🔄 Processes URLs & emails
       │
       ▼
[AWS Comprehend]
  🧠 NLP-based sentiment and phishing analysis
