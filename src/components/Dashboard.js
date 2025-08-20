import React, { useState, useEffect } from "react";
import "./dashboard.css";
import { useNavigate } from "react-router-dom";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import Request from "./Request";
import Integration from "./Integration";
import Registry from "./OrganRegistry";
import MatchPage from "./MatchPage";
import MainDashboard from "./MainDashboard";
import axios from "axios";
import { API } from "../api";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function Dashboard() {
  const [activeTab, setActiveTab] = useState("donors");
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");

  // State for real data from backend
  const [donors, setDonors] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [donorsLoading, setDonorsLoading] = useState(false);
  const [recipientsLoading, setRecipientsLoading] = useState(false);
  const [bloodInventory, setBloodInventory] = useState([]);
  const [bloodInventoryLoading, setBloodInventoryLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  // Dashboard statistics
  const [stats, setStats] = useState({
    totalDonors: 0,
    totalRecipients: 0,
    activeMatches: 0,
    pendingRequests: 0,
  });

  // Fetch data from backend
  const fetchDonors = async () => {
    setDonorsLoading(true);
    try {
      const response = await API.get("/donors");
      setDonors(response.data);
    } catch (error) {
      console.error("Error fetching donors:", error);
    } finally {
      setDonorsLoading(false);
    }
  };

  const fetchRecipients = async () => {
    setRecipientsLoading(true);
    try {
      const response = await API.get("/recipients");
      setRecipients(response.data);
    } catch (error) {
      console.error("Error fetching recipients:", error);
    } finally {
      setRecipientsLoading(false);
    }
  };

  const fetchBloodInventory = async () => {
    setBloodInventoryLoading(true);
    try {
      const response = await API.get(
        "/bloodinventories"
      );
      setBloodInventory(response.data);
    } catch (error) {
      console.error("Error fetching blood inventory:", error);
    } finally {
      setBloodInventoryLoading(false);
    }
  };

  const fetchNotifications = async () => {
    setNotificationsLoading(true);
    try {
      const response = await API.get(
        "/notifications"
      );
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setNotificationsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const [donorsRes, recipientsRes, requestsRes] = await Promise.all([
        API.get("/donors"),
        API.get("/recipients"),
        API.get("/requests"),
      ]);

      setStats({
        totalDonors: donorsRes.data.length,
        totalRecipients: recipientsRes.data.length,
        activeMatches: 0, // Will be calculated from actual matches
        pendingRequests: requestsRes.data.filter(
          (req) => req.status === "Pending"
        ).length,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchDonors();
    fetchRecipients();
    fetchBloodInventory();
    fetchNotifications();
    fetchStats();

    // Update every 30 seconds
    const interval = setInterval(() => {
      fetchDonors();
      fetchRecipients();
      fetchNotifications();
      fetchStats();
      setLastUpdated(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuClick = (menuItem) => {
    setActiveMenu(menuItem);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    window.location.href = "/";
  };

  const getStatusColor = (status) => {
    if (!status) return ""; // Return empty string if status is undefined/null

    switch (status) {
      case "Stable":
      case "High":
      case "Available":
      case "Immediate":
        return "status-green";
      case "Low":
      case "Medium Urgency":
      case "2 Hours":
        return "status-yellow";
      case "Pending":
      case "Awaiting Confirmation":
      case "Low Urgency":
        return "status-gray";
      case "Needed":
      case "High Urgency":
        return "status-red";
      default:
        return "";
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Handle match requests for donors
  const handleDonorMatch = async (donor, index) => {
    try {
      const matchRequestData = {
        donorId: donor._id || `donor_${index}`,
        recipientId: 'current_user', // This would be the logged-in user's ID
        organ: donor.donationType || 'Organ'
      };
      
      const response = await API.post('/matches', matchRequestData);
      
      if (response.status >= 200 && response.status < 300) {
        alert(`✅ Match request sent successfully for ${donor.name}!`);
      } else {
        alert(`❌ Failed to send match request for ${donor.name}`);
      }
    } catch (error) {
      console.error('Error sending match request:', error);
      alert(`❌ Error sending match request. Please try again.`);
    }
  };

  // Handle match requests for recipients
  const handleRecipientMatch = async (recipient, index) => {
    try {
      const matchRequestData = {
        donorId: 'current_user', // This would be the logged-in user's ID
        recipientId: recipient._id || `recipient_${index}`,
        organ: recipient.organNeeded || 'Organ'
      };
      
      const response = await API.post('/matches', matchRequestData);
      
      if (response.status >= 200 && response.status < 300) {
        alert(`✅ Match request sent successfully for ${recipient.name}!`);
      } else {
        alert(`❌ Failed to send match request for ${recipient.name}`);
      }
    } catch (error) {
      console.error('Error sending match request:', error);
      alert(`❌ Error sending match request. Please try again.`);
    }
  };

  const renderDashboard = () => (
    <main className="dashboard-main">
      {/* Dashboard Statistics */}
      <section className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-user-plus"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.totalDonors}</h3>
            <p>Total Donors</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-user-injured"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.totalRecipients}</h3>
            <p>Total Recipients</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-handshake"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.activeMatches}</h3>
            <p>Active Matches</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.pendingRequests}</h3>
            <p>Pending Requests</p>
          </div>
        </div>
      </section>

      <section className="dashboard-column organ-donation">
        <div className="column-header">
          <h2>
            <i className="fas fa-heartbeat"></i> Organ Donation Status
          </h2>
          <div className="last-updated">
            <i className="fas fa-clock"></i> {formatTime(lastUpdated)}
          </div>
        </div>

        <div className="organ-tabs">
          <button
            className={`tab-button ${activeTab === "donors" ? "active" : ""}`}
            onClick={() => setActiveTab("donors")}
          >
            Available Organs (Donors)
          </button>
          <button
            className={`tab-button ${
              activeTab === "recipients" ? "active" : ""
            }`}
            onClick={() => setActiveTab("recipients")}
          >
            Needed Organs (Recipients)
          </button>
        </div>

        <div className="organ-table-container">
          {activeTab === "donors" ? (
            donorsLoading ? (
              <p>Loading donors...</p>
            ) : donors.length > 0 ? (
              <table className="organ-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Location</th>
                    <th>Donation Type</th>
                    <th>Blood Type</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {donors.map((donor, index) => (
                    <tr
                      key={donor._id || index}
                      className={index % 2 === 0 ? "even" : "odd"}
                    >
                      <td>{donor.name}</td>
                      <td>{donor.age}</td>
                      <td>{donor.location}</td>
                      <td>{donor.donationType}</td>
                      <td>{donor.bloodType}</td>
                      <td className={getStatusColor("Available")}>Available</td>
                      <td>
                        <button 
                          className="match-button"
                          onClick={() => handleDonorMatch(donor, index)}
                        >
                          Match Now <i className="fas fa-arrow-right"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>
                No donors available. Administrators can add donors through the
                admin panel.
              </p>
            )
          ) : recipientsLoading ? (
            <p>Loading recipients...</p>
          ) : recipients.length > 0 ? (
            <table className="organ-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Location</th>
                  <th>Organ Needed</th>
                  <th>Blood Type</th>
                  <th>Urgency</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recipients.map((recipient, index) => (
                  <tr
                    key={recipient._id || index}
                    className={index % 2 === 0 ? "even" : "odd"}
                  >
                    <td>{recipient.name}</td>
                    <td>{recipient.age}</td>
                    <td>{recipient.location}</td>
                    <td>{recipient.organNeeded}</td>
                    <td>{recipient.bloodType}</td>
                    <td className={getStatusColor(recipient.urgency)}>
                      {recipient.urgency}
                    </td>
                    <td>
                      <button 
                        className="match-button"
                        onClick={() => handleRecipientMatch(recipient, index)}
                      >
                        Match Now <i className="fas fa-arrow-right"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>
              No recipients in need. Administrators can add recipients through
              the admin panel.
            </p>
          )}
        </div>
      </section>

      <section className="dashboard-column notifications">
        <div className="column-header">
          <h2>
            <i className="fas fa-bell"></i> Notifications
          </h2>
          <div className="last-updated">
            <i className="fas fa-clock"></i> {formatTime(lastUpdated)}
          </div>
        </div>

        <div className="notification-list">
          {notificationsLoading ? (
            <p>Loading notifications...</p>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification._id || notification.id}
                className={`notification-item ${
                  notification.urgent ? "urgent" : ""
                } ${notification.success ? "success" : ""}`}
              >
                <p>{notification.message || notification.text}</p>
                <span className="notification-time">
                  {notification.timestamp
                    ? formatTime(new Date(notification.timestamp))
                    : formatTime(lastUpdated)}
                </span>
              </div>
            ))
          ) : (
            <p>No notifications available.</p>
          )}
        </div>
      </section>
    </main>
  );

  const renderMainDashBoard = () => (
    <div className="page-content">
      <h2>Dashboard</h2>
      <MainDashboard />
    </div>
  );

  const renderBloodInventory = () => (
    <div className="page-content">
      <Request />
    </div>
  );

  const renderOrganRegistry = () => (
    <div className="page-content">
      <Registry />
    </div>
  );

  const renderMatches = () => (
    <div className="page-content">
      <MatchPage />
    </div>
  );

  const renderReports = () => (
    <div className="page-content">
      <Integration />
    </div>
  );

  const renderSettings = () => (
    <div className="page-content">
      <h2>Settings</h2>
      <div className="settings-container">
        <div className="setting-section">
          <h3>User Preferences</h3>
          <div className="setting-item">
            <label>Notifications</label>
            <input type="checkbox" defaultChecked />
          </div>
          <div className="setting-item">
            <label>Auto-refresh</label>
            <input type="checkbox" defaultChecked />
          </div>
        </div>
        <div className="setting-section">
          <h3>System Information</h3>
          <p>Version: 1.0.0</p>
          <p>Last Updated: {formatDate(lastUpdated)}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <div className="nav-icon">
            <i className="fas fa-heartbeat"></i>
          </div>
          <h1>BloodMatch Dashboard</h1>
        </div>
        <button className="mobile-menu-button" onClick={toggleMenu}>
          <i className={`fas ${isMenuOpen ? "fa-times" : "fa-bars"}`}></i>
        </button>
        <nav className={`header-nav ${isMenuOpen ? "open" : ""}`}>
          <ul>
            <li className={activeMenu === "dashboard" ? "active" : ""}>
              <a href="#" onClick={() => handleMenuClick("dashboard")}>
                <i className="fas fa-tachometer-alt"></i> Dashboard
              </a>
            </li>
            <li className={activeMenu === "blood" ? "active" : ""}>
              <a href="#" onClick={() => handleMenuClick("blood")}>
                <i className="fas fa-tint"></i> Requests
              </a>
            </li>
            <li className={activeMenu === "organ" ? "active" : ""}>
              <a href="#" onClick={() => handleMenuClick("organ")}>
                <i className="fas fa-heartbeat"></i> Organ Registry
              </a>
            </li>
            <li className={activeMenu === "matches" ? "active" : ""}>
              <a href="#" onClick={() => handleMenuClick("matches")}>
                <i className="fas fa-handshake"></i> Matches
              </a>
            </li>
            <li className={activeMenu === "reports" ? "active" : ""}>
              <a href="#" onClick={() => handleMenuClick("reports")}>
                <i className="fas fa-chart-bar"></i> Integration
              </a>
            </li>
            <li className={activeMenu === "settings" ? "active" : ""}>
              <a href="#" onClick={() => handleMenuClick("settings")}>
                <i className="fas fa-cog"></i> Settings
              </a>
            </li>
          </ul>
        </nav>
      </header>

      {activeMenu === "dashboard" && renderDashboard()}
      {activeMenu === "blood" && renderBloodInventory()}
      {activeMenu === "organ" && renderOrganRegistry()}
      {activeMenu === "matches" && renderMatches()}
      {activeMenu === "reports" && renderReports()}
      {activeMenu === "settings" && renderSettings()}

      <footer className="dashboard-footer">
        <div className="footer-content">
          <a href="#">Help</a>
          <a href="#">Contact Support</a>
          <a href="#" onClick={handleLogout}>
            Logout
          </a>
          <span>
            Last Updated: {formatDate(lastUpdated)} at {formatTime(lastUpdated)}
          </span>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;
