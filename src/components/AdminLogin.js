import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // In a real application, this would be a proper API call
      // For now, we'll simulate a backend authentication
      const response = await fetch("http://localhost:5050/api/auth/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminUser", loginData.username);
        navigate("/admin-dashboard");
      } else {
        setError("Invalid admin credentials");
      }
    } catch (error) {
      // Fallback for development - remove in production
      if (loginData.username === "admin" && loginData.password === "admin123") {
        localStorage.setItem("adminToken", "admin-logged-in");
        localStorage.setItem("adminUser", loginData.username);
        navigate("/admin-dashboard");
      } else {
        setError("Invalid admin credentials");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="login-wrapper">
      <header className="login-header">
        <img src="/logo.png" alt="Logo" className="logo-img" />
        <h1 className="title">Admin Portal</h1>
        <p className="subtitle">Blood & Organ Donation Registry</p>
      </header>

      <main className="login-main">
        <div className="form-container">
          <div className="admin-login-form">
            <h2 className="form-title">Administrator Login</h2>
            <div className="admin-badge">
              <i className="fas fa-shield-alt"></i>
              <span>Secure Admin Access</span>
            </div>

            {error && (
              <div className="error-message">
                <i className="fas fa-exclamation-triangle"></i>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>
                  <i className="fas fa-user"></i>
                  Admin Username
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter admin username"
                  value={loginData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <i className="fas fa-lock"></i>
                  Admin Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter admin password"
                  value={loginData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group checkbox-group">
                <input type="checkbox" id="remember-admin" />
                <label htmlFor="remember-admin">Remember this session</label>
              </div>

              <button
                type="submit"
                className="submit-btn admin-submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Authenticating...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt"></i>
                    Login as Administrator
                  </>
                )}
              </button>
            </form>

            <div className="login-footer">
              <a href="/" className="back-link">
                <i className="fas fa-arrow-left"></i>
                Back to Main Site
              </a>
            </div>
          </div>
        </div>
      </main>

      <footer className="login-footer">
        <div className="footer-content">
          <p>&copy; 2024 BloodMatch. All rights reserved.</p>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact Support</a>
          </div>
        </div>
      </footer>

      <div className="demo-credentials">
        <h4>Demo Credentials:</h4>
        <p>
          <strong>Username:</strong> admin
        </p>
        <p>
          <strong>Password:</strong> admin123
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
