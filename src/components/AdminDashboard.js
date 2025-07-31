import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import axios from "axios";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("donors");
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("admin-dashboard");

  // Admin form state for Donor
  const [donorForm, setDonorForm] = useState({
    name: "",
    age: "",
    gender: "",
    location: "",
    email: "",
    phone: "",
    donationType: "",
    bloodType: "",
    medicalHistory: "",
    consent1: false,
    consent2: false,
  });

  // Admin form state for Recipient
  const [recipientForm, setRecipientForm] = useState({
    name: "",
    age: "",
    gender: "",
    location: "",
    email: "",
    phone: "",
    organNeeded: "",
    bloodType: "",
    urgency: "",
    medicalHistory: "",
  });

  // Add state for donors list
  const [donors, setDonors] = useState([]);
  const [donorsLoading, setDonorsLoading] = useState(false);
  const [recipients, setRecipients] = useState([]);
  const [recipientsLoading, setRecipientsLoading] = useState(false);

  useEffect(() => {
    // Check if admin is logged in
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      navigate("/admin-login");
      return;
    }

    fetchDonors();
    fetchRecipients();
  }, [navigate]);

  const handleDonorFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDonorForm({
      ...donorForm,
      [name]: type === "checkbox" ? checked : value,
    });
  };

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

  const handleDonorFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5050/api/donors", donorForm);
      setDonorForm({
        name: "",
        age: "",
        gender: "",
        location: "",
        email: "",
        phone: "",
        donationType: "",
        bloodType: "",
        medicalHistory: "",
        consent1: false,
        consent2: false,
      });
      fetchDonors();
      alert("Donor added successfully!");
    } catch (error) {
      console.error("Error adding donor:", error);
      alert("Error adding donor. Please try again.");
    }
  };

  const handleRecipientFormChange = (e) => {
    const { name, value } = e.target;
    setRecipientForm({
      ...recipientForm,
      [name]: value,
    });
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

  const handleRecipientFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5050/api/recipients", recipientForm);
      setRecipientForm({
        name: "",
        age: "",
        gender: "",
        location: "",
        email: "",
        phone: "",
        organNeeded: "",
        bloodType: "",
        urgency: "",
        medicalHistory: "",
      });
      fetchRecipients();
      alert("Recipient added successfully!");
    } catch (error) {
      console.error("Error adding recipient:", error);
      alert("Error adding recipient. Please try again.");
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuClick = (menuItem) => {
    setActiveMenu(menuItem);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin-login");
  };

  const getStatusColor = (status) => {
    if (!status) return "#757575"; // Return default color if status is undefined/null

    switch (status.toLowerCase()) {
      case "available":
      case "high":
      case "stable":
        return "#4CAF50";
      case "pending":
      case "medium":
        return "#FF9800";
      case "needed":
      case "low":
      case "urgent":
        return "#F44336";
      default:
        return "#757575";
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString();
  };

  const formatDate = (date) => {
    return date.toLocaleDateString();
  };

  const renderAdminDashboard = () => (
    <div className="page-content">
      <div className="admin-stats-grid">
        <div className="stat-card">
          <h3>Total Donors</h3>
          <p className="stat-number">{donors.length}</p>
          <p className="stat-label">Registered</p>
        </div>
        <div className="stat-card">
          <h3>Total Recipients</h3>
          <p className="stat-number">{recipients.length}</p>
          <p className="stat-label">Waiting</p>
        </div>
        <div className="stat-card">
          <h3>Active Matches</h3>
          <p className="stat-number">0</p>
          <p className="stat-label">This Month</p>
        </div>
        <div className="stat-card">
          <h3>System Status</h3>
          <p className="stat-number" style={{ color: "#4CAF50" }}>
            Online
          </p>
          <p className="stat-label">All Systems</p>
        </div>
      </div>

      <div className="admin-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button
            className="action-btn"
            onClick={() => setActiveMenu("donor-management")}
          >
            <i className="fas fa-user-plus"></i>
            Add Donor
          </button>
          <button
            className="action-btn"
            onClick={() => setActiveMenu("recipient-management")}
          >
            <i className="fas fa-user-injured"></i>
            Add Recipient
          </button>
          <button className="action-btn">
            <i className="fas fa-chart-line"></i>
            Generate Report
          </button>
          <button className="action-btn">
            <i className="fas fa-cog"></i>
            System Settings
          </button>
        </div>
      </div>
    </div>
  );

  const renderDonorManagement = () => (
    <div className="page-content">
      <h2>Donor Management</h2>

      {/* Admin Add Donor Form */}
      <div className="admin-form-section">
        <h3>Add New Donor</h3>
        <form onSubmit={handleDonorFormSubmit} className="admin-form">
          <div className="form-row">
            <div className="form-group">
              <label>Name</label>
              <input
                name="name"
                value={donorForm.name}
                onChange={handleDonorFormChange}
                placeholder="Full Name"
                required
              />
            </div>
            <div className="form-group">
              <label>Age</label>
              <input
                name="age"
                type="number"
                value={donorForm.age}
                onChange={handleDonorFormChange}
                placeholder="Age"
                required
              />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select
                name="gender"
                value={donorForm.gender}
                onChange={handleDonorFormChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Location</label>
              <input
                name="location"
                value={donorForm.location}
                onChange={handleDonorFormChange}
                placeholder="City, State"
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                name="email"
                type="email"
                value={donorForm.email}
                onChange={handleDonorFormChange}
                placeholder="Email"
                required
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                name="phone"
                value={donorForm.phone}
                onChange={handleDonorFormChange}
                placeholder="Phone Number"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Donation Type</label>
              <select
                name="donationType"
                value={donorForm.donationType}
                onChange={handleDonorFormChange}
                required
              >
                <option value="">Select Type</option>
                <option value="Blood">Blood</option>
                <option value="Organ">Organ</option>
                <option value="Both">Both</option>
              </select>
            </div>
            <div className="form-group">
              <label>Blood Type</label>
              <select
                name="bloodType"
                value={donorForm.bloodType}
                onChange={handleDonorFormChange}
                required
              >
                <option value="">Select Blood Type</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
            <div className="form-group">
              <label>Medical History</label>
              <textarea
                name="medicalHistory"
                value={donorForm.medicalHistory}
                onChange={handleDonorFormChange}
                placeholder="Medical conditions, medications, etc."
                rows="3"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                name="consent1"
                checked={donorForm.consent1}
                onChange={handleDonorFormChange}
                id="consent1"
              />
              <label htmlFor="consent1">Consent to Blood Donation</label>
            </div>
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                name="consent2"
                checked={donorForm.consent2}
                onChange={handleDonorFormChange}
                id="consent2"
              />
              <label htmlFor="consent2">Consent to Organ Donation</label>
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Add Donor
          </button>
        </form>
      </div>

      {/* Donors List */}
      <div className="data-section">
        <h3>Registered Donors</h3>
        {donorsLoading ? (
          <p>Loading donors...</p>
        ) : donors.length > 0 ? (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Location</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Donation Type</th>
                  <th>Blood Type</th>
                  <th>Medical History</th>
                  <th>Consent</th>
                </tr>
              </thead>
              <tbody>
                {donors.map((donor, index) => (
                  <tr key={donor._id || index}>
                    <td>{donor.name}</td>
                    <td>{donor.age}</td>
                    <td>{donor.gender}</td>
                    <td>{donor.location}</td>
                    <td>{donor.email}</td>
                    <td>{donor.phone}</td>
                    <td>{donor.donationType}</td>
                    <td>{donor.bloodType}</td>
                    <td>{donor.medicalHistory}</td>
                    <td>
                      {donor.consent1 ? "✓" : "✗"} /{" "}
                      {donor.consent2 ? "✓" : "✗"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No donors found. Add a donor using the form above.</p>
        )}
      </div>
    </div>
  );

  const renderRecipientManagement = () => (
    <div className="page-content">
      <h2>Recipient Management</h2>

      {/* Admin Add Recipient Form */}
      <div className="admin-form-section">
        <h3>Add New Recipient</h3>
        <form onSubmit={handleRecipientFormSubmit} className="admin-form">
          <div className="form-row">
            <div className="form-group">
              <label>Name</label>
              <input
                name="name"
                value={recipientForm.name}
                onChange={handleRecipientFormChange}
                placeholder="Full Name"
                required
              />
            </div>
            <div className="form-group">
              <label>Age</label>
              <input
                name="age"
                type="number"
                value={recipientForm.age}
                onChange={handleRecipientFormChange}
                placeholder="Age"
                required
              />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select
                name="gender"
                value={recipientForm.gender}
                onChange={handleRecipientFormChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Location</label>
              <input
                name="location"
                value={recipientForm.location}
                onChange={handleRecipientFormChange}
                placeholder="City, State"
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                name="email"
                type="email"
                value={recipientForm.email}
                onChange={handleRecipientFormChange}
                placeholder="Email"
                required
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                name="phone"
                value={recipientForm.phone}
                onChange={handleRecipientFormChange}
                placeholder="Phone Number"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Organ Needed</label>
              <select
                name="organNeeded"
                value={recipientForm.organNeeded}
                onChange={handleRecipientFormChange}
                required
              >
                <option value="">Select Organ</option>
                <option value="Heart">Heart</option>
                <option value="Kidney">Kidney</option>
                <option value="Liver">Liver</option>
                <option value="Lungs">Lungs</option>
                <option value="Pancreas">Pancreas</option>
                <option value="Intestine">Intestine</option>
              </select>
            </div>
            <div className="form-group">
              <label>Blood Type</label>
              <select
                name="bloodType"
                value={recipientForm.bloodType}
                onChange={handleRecipientFormChange}
                required
              >
                <option value="">Select Blood Type</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
            <div className="form-group">
              <label>Urgency</label>
              <select
                name="urgency"
                value={recipientForm.urgency}
                onChange={handleRecipientFormChange}
                required
              >
                <option value="">Select Urgency</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Medical History</label>
              <textarea
                name="medicalHistory"
                value={recipientForm.medicalHistory}
                onChange={handleRecipientFormChange}
                placeholder="Medical conditions, medications, etc."
                rows="3"
              />
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Add Recipient
          </button>
        </form>
      </div>

      {/* Recipients List */}
      <div className="data-section">
        <h3>Registered Recipients</h3>
        {recipientsLoading ? (
          <p>Loading recipients...</p>
        ) : recipients.length > 0 ? (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Location</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Organ Needed</th>
                  <th>Blood Type</th>
                  <th>Urgency</th>
                  <th>Medical History</th>
                </tr>
              </thead>
              <tbody>
                {recipients.map((recipient, index) => (
                  <tr key={recipient._id || index}>
                    <td>{recipient.name}</td>
                    <td>{recipient.age}</td>
                    <td>{recipient.gender}</td>
                    <td>{recipient.location}</td>
                    <td>{recipient.email}</td>
                    <td>{recipient.phone}</td>
                    <td>{recipient.organNeeded}</td>
                    <td>{recipient.bloodType}</td>
                    <td style={{ color: getStatusColor(recipient.urgency) }}>
                      {recipient.urgency}
                    </td>
                    <td>{recipient.medicalHistory}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No recipients found. Add a recipient using the form above.</p>
        )}
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="page-content">
      <h2>System Settings</h2>
      <div className="settings-grid">
        <div className="setting-card">
          <h3>Database Management</h3>
          <button className="setting-btn">Backup Database</button>
          <button className="setting-btn">Restore Database</button>
          <button className="setting-btn">Clear Cache</button>
        </div>

        <div className="setting-card">
          <h3>User Management</h3>
          <button className="setting-btn">Manage Users</button>
          <button className="setting-btn">Role Permissions</button>
          <button className="setting-btn">Access Logs</button>
        </div>

        <div className="setting-card">
          <h3>System Configuration</h3>
          <button className="setting-btn">General Settings</button>
          <button className="setting-btn">Email Configuration</button>
          <button className="setting-btn">API Settings</button>
        </div>

        <div className="setting-card">
          <h3>Security</h3>
          <button className="setting-btn">Password Policy</button>
          <button className="setting-btn">Session Management</button>
          <button className="setting-btn">Audit Logs</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <div className="nav-icon">
            <i className="fas fa-shield-alt"></i>
          </div>
          <h1>Admin Dashboard</h1>
        </div>
        <button className="mobile-menu-button" onClick={toggleMenu}>
          <i className={`fas ${isMenuOpen ? "fa-times" : "fa-bars"}`}></i>
        </button>
        <nav className={`header-nav ${isMenuOpen ? "open" : ""}`}>
          <ul>
            <li className={activeMenu === "admin-dashboard" ? "active" : ""}>
              <a href="#" onClick={() => handleMenuClick("admin-dashboard")}>
                <i className="fas fa-tachometer-alt"></i> Dashboard
              </a>
            </li>
            <li className={activeMenu === "donor-management" ? "active" : ""}>
              <a href="#" onClick={() => handleMenuClick("donor-management")}>
                <i className="fas fa-user-plus"></i> Donor Management
              </a>
            </li>
            <li
              className={activeMenu === "recipient-management" ? "active" : ""}
            >
              <a
                href="#"
                onClick={() => handleMenuClick("recipient-management")}
              >
                <i className="fas fa-user-injured"></i> Recipient Management
              </a>
            </li>
            <li className={activeMenu === "system-settings" ? "active" : ""}>
              <a href="#" onClick={() => handleMenuClick("system-settings")}>
                <i className="fas fa-cog"></i> System Settings
              </a>
            </li>
            <li>
              <a href="#" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i> Logout
              </a>
            </li>
          </ul>
        </nav>
      </header>

      {activeMenu === "admin-dashboard" && renderAdminDashboard()}
      {activeMenu === "donor-management" && renderDonorManagement()}
      {activeMenu === "recipient-management" && renderRecipientManagement()}
      {activeMenu === "system-settings" && renderSystemSettings()}

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
};

export default AdminDashboard;
