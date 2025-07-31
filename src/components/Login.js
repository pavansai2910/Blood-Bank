
import React, { useState } from 'react';
import { login, register } from './api';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './new.css';
import Dashboard from './components/Dashboard';

// const Dashboard = () => (
//   <div className="dashboard-container">
//     🎉 Welcome to the Hospital/Blood Bank Dashboard!
//   </div>
//   // <Dashboard/>
// );

const LoginPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
  const [loginData, setLoginData] = useState({ id: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '', id: '', email: '', password: '', confirmPassword: '', location: ''
  });

 const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await login(loginData);
    console.log('Login Success:', res.data);
    navigate('/dashboard');
  } catch (err) {
    alert('Login failed');
    console.error(err);
  }
};

const handleRegister = async (e) => {
  e.preventDefault();
  try {
    const res = await register(registerData);
    console.log('Register Success:', res.data);
    setActiveTab('login');
  } catch (err) {
    alert('Registration failed');
    console.error(err);
  }
};

  return (
    <div className="login-wrapper">
      <header className="login-header">
        <img src="/logo.png" alt="Logo" className="logo-img" />
        <h1 className="title">Blood & Organ Donation Registry</h1>
      </header>
      <main className="login-main">
        <div className="form-container">
          <div className="tab-buttons">
            <button
              className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button
              className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => setActiveTab('register')}
            >
              Register
            </button>
          </div>

          {activeTab === 'login' ? (
            <form onSubmit={handleLogin}>
              <h2 className="form-title">Sign In</h2>
              <div className="form-group">
                <label>Hospital/Blood Bank ID</label>
                <input
                  type="text"
                  placeholder="e.g., HOSP001"
                  value={loginData.id}
                  onChange={(e) => setLoginData({ ...loginData, id: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                />
              </div>
              <div className="form-group checkbox-group">
                <input type="checkbox" />
                <span>Remember Me</span>
              </div>
              <button type="submit" className="submit-btn">Login</button>
              <p className="text-link">
                <a href="#">Forgot Password?</a>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <h2 className="form-title">Register Your Organization</h2>
              {['name', 'id', 'email', 'password', 'confirmPassword', 'location'].map((field, idx) => (
                <div className="form-group" key={idx}>
                  <label>{field.replace(/([A-Z])/g, ' $1')}</label>
                  <input
                    type={field.toLowerCase().includes('password') ? 'password' : 'text'}
                    placeholder={`Enter ${field}`}
                    value={registerData[field]}
                    onChange={(e) => setRegisterData({ ...registerData, [field]: e.target.value })}
                  />
                </div>
              ))}
              <div className="form-group checkbox-group">
                <input type="checkbox" />
                <span>I agree to the Terms & Conditions</span>
              </div>
              <button type="submit" className="submit-btn">Register</button>
            </form>
          )}
        </div>
      </main>
      <footer className="login-footer">
        <a href="#">Need Help? Contact Support</a>
      </footer>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default LoginPage;