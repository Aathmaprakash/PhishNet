import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Hero from './components/Hero/Hero';
import Dashboard from './components/Dashboard/Dashboard';
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import URLAnalysis from './components/UrlChecker/UrlChecker';
import EmailAnalysis from './components/EmailAnalysis/EmailAnalysis';
function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/api/auth/login" element={<Dashboard/>}/>
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/url-analysis" element={<URLAnalysis/>}/>
        <Route path="/email-analysis" element={<EmailAnalysis/>}/>
        {/* Add other routes as needed */}
      </Routes>
    </AuthProvider>
  );
}

export default App;
