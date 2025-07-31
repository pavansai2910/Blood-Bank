import React, { useState, useEffect } from "react";
import "./request.css";
import defaultHospitalLogo from "./hackathon1.jpg";
import axios from "axios";

function MainDashboard() {
  const [activeTab, setActiveTab] = useState("donors");
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [hospitalLogo, setHospitalLogo] = useState(defaultHospitalLogo);
  const [hospitalName, setHospitalName] = useState("City General Hospital");

  // State for real data from backend
  const [donors, setDonors] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [donorsLoading, setDonorsLoading] = useState(false);
  const [recipientsLoading, setRecipientsLoading] = useState(false);
  const [bloodInventory, setBloodInventory] = useState([]);
  const [bloodInventoryLoading, setBloodInventoryLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  // Fetch data from backend
  const fetchDonors = async () => {
    setDonorsLoading(true);
    try {
      const response = await axios.get("http://localhost:5050/api/donors");
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
      const response = await axios.get("http://localhost:5050/api/recipients");
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
      const response = await axios.get(
        "http://localhost:5050/api/bloodinventories"
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
      const response = await axios.get(
        "http://localhost:5050/api/notifications"
      );
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setNotificationsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000);

    // Fetch data on component mount
    fetchDonors();
    fetchRecipients();
    fetchBloodInventory();
    fetchNotifications();

    return () => clearInterval(timer);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuClick = (menuItem) => {
    setActiveMenu(menuItem);
    setIsMenuOpen(false);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const logoUrl = reader.result;
        setHospitalLogo(logoUrl);
        localStorage.setItem("hospitalLogo", logoUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHospitalNameChange = (e) => {
    const newName = e.target.value;
    setHospitalName(newName);
    localStorage.setItem("hospitalName", newName);
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

  const renderDashboard = () => (
    <main className="dashboard-main">
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
                        <button className="match-button">
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
                      <button className="match-button">
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

  const renderBloodInventory = () => (
    <div className="page-content">
      <h2>Blood Inventory Management</h2>
      <p>Detailed blood inventory management content would go here.</p>
    </div>
  );

  const renderOrganRegistry = () => (
    <div className="page-content">
      <h2>Organ Registry</h2>
      <p>Organ registry management content would go here.</p>
    </div>
  );

  const renderMatches = () => (
    <div className="page-content">
      <h2>Matches</h2>
      <p>Matching system content would go here.</p>
    </div>
  );

  const renderReports = () => (
    <div className="page-content">
      <h2>Reports</h2>
      <p>Reporting system content would go here.</p>
    </div>
  );

  const renderSettings = () => (
    <div className="page-content">
      <h2>Hospital Settings</h2>
      <div className="settings-form">
        <div className="form-group">
          <label htmlFor="hospitalName">Hospital Name</label>
          <input
            type="text"
            id="hospitalName"
            value={hospitalName}
            onChange={handleHospitalNameChange}
          />
        </div>

        <div className="form-group">
          <label>Hospital Logo</label>
          <div className="logo-upload-container">
            <div className="current-logo-preview">
              <img
                src={hospitalLogo}
                alt="Current Hospital Logo"
                className="logo-preview"
              />
            </div>
            <div className="upload-controls">
              <input
                type="file"
                id="logoUpload"
                accept="image/*"
                onChange={handleLogoUpload}
                style={{ display: "none" }}
              />
              <label htmlFor="logoUpload" className="upload-button">
                <i className="fas fa-upload"></i> Upload New Logo
              </label>
              <p className="upload-hint">Recommended size: 200x200px</p>
            </div>
          </div>
        </div>

        <button className="save-settings-button">
          <i className="fas fa-save"></i> Save Settings
        </button>
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      {activeMenu === "dashboard" && renderDashboard()}
      {activeMenu === "blood" && renderBloodInventory()}
      {activeMenu === "organ" && renderOrganRegistry()}
      {activeMenu === "matches" && renderMatches()}
      {activeMenu === "reports" && renderReports()}
      {activeMenu === "settings" && renderSettings()}
    </div>
  );
}

export default MainDashboard;
