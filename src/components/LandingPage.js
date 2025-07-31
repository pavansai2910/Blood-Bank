import React from "react";
import { useNavigate } from "react-router-dom";
import "../new.css";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleUserAccess = () => {
    navigate("/user-dashboard");
  };

  const handleAdminAccess = () => {
    navigate("/admin-login");
  };

  return (
    <div className="landing-wrapper">
      <header className="landing-header">
        <img src="/logo.png" alt="Logo" className="logo-img" />
        <h1 className="title">LifeLink</h1>
        <p className="subtitle">Blood & Organ Donation Registry</p>
      </header>

      <main className="landing-main">
        <div className="landing-content">
          <div className="welcome-section">
            <h2>Welcome to LifeLink</h2>
            <p>Connecting donors and recipients for life-saving transplants</p>
          </div>

          <div className="access-options">
            <div className="access-card user-access">
              <div className="access-icon">
                <i className="fas fa-user"></i>
              </div>
              <h3>User Access</h3>
              <p>View blood inventory, organ registry, and system status</p>
              <ul>
                <li>View blood inventory status</li>
                <li>Browse organ registry</li>
                <li>Check system notifications</li>
                <li>Access match requests</li>
              </ul>
              <button
                className="access-btn user-btn"
                onClick={handleUserAccess}
              >
                <i className="fas fa-arrow-right"></i>
                Continue as User
              </button>
            </div>

            <div className="access-card admin-access">
              <div className="access-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>Administrator Access</h3>
              <p>Manage donors, recipients, and system settings</p>
              <ul>
                <li>Add and manage donors</li>
                <li>Register recipients</li>
                <li>System configuration</li>
                <li>Database management</li>
              </ul>
              <button
                className="access-btn admin-btn"
                onClick={handleAdminAccess}
              >
                <i className="fas fa-lock"></i>
                Admin Login
              </button>
            </div>
          </div>

          <div className="features-section">
            <h3>System Features</h3>
            <div className="features-grid">
              <div className="feature-item">
                <i className="fas fa-tint"></i>
                <h4>Blood Management</h4>
                <p>Track blood inventory levels and availability</p>
              </div>
              <div className="feature-item">
                <i className="fas fa-heartbeat"></i>
                <h4>Organ Registry</h4>
                <p>Manage organ donors and recipients</p>
              </div>
              <div className="feature-item">
                <i className="fas fa-handshake"></i>
                <h4>Matching System</h4>
                <p>Connect donors with recipients efficiently</p>
              </div>
              <div className="feature-item">
                <i className="fas fa-chart-line"></i>
                <h4>Analytics</h4>
                <p>Monitor system performance and trends</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="landing-footer">
        <div className="footer-content">
          <p>&copy; 2024 LifeLink. All rights reserved.</p>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
