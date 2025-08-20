import React, { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../api";
import "./request.css";

function Request() {
  // State for Send Request form
  const [bloodType, setBloodType] = useState("A+");
  const [quantity, setQuantity] = useState(1);
  const [urgency, setUrgency] = useState("Medium");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");

  // State for Manage Requests - now dynamic
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);

  // Blood type options
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  // Hospital options for autocomplete
  const hospitals = [
    "City Hospital",
    "General Hospital",
    "Central Medical",
    "Unity Health",
    "Regional Medical Center",
  ];

  // Fetch requests from backend
  const fetchRequests = async () => {
    setRequestsLoading(true);
    try {
      const response = await API.get("/requests");
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setRequestsLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchRequests();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const newRequest = {
        bloodType,
        quantity,
        urgency,
        location,
      };

      await API.post("/requests", newRequest);
      setStatus("Sent!");

      // Refresh requests list
      fetchRequests();

      // Reset status after 3 seconds
      setTimeout(() => setStatus(""), 3000);

      // Reset form fields
      setBloodType("A+");
      setQuantity(1);
      setUrgency("Medium");
      setLocation("");
    } catch (error) {
      console.error("Error sending request:", error);
      setStatus("Error sending request");
      setTimeout(() => setStatus(""), 3000);
    }
  };

  // Handle request actions
  const handleRequestAction = async (id, action) => {
    try {
      if (action === "Rejected") {
        await API.delete(`/requests/${id}`);
        // Remove the request from local state
        setRequests(requests.filter((request) => request._id !== id));
      } else {
        await API.put(`/requests/${id}`, {
          status: action,
        });
        // Update the request status in local state
        setRequests(
          requests.map((req) =>
            req._id === id ? { ...req, status: action } : req
          )
        );
      }
    } catch (error) {
      console.error("Error updating request:", error);
    }
  };

  // Admin form state for BloodInventory
  const [inventoryForm, setInventoryForm] = useState({
    orgId: "",
    bloodGroup: "",
    quantity: "",
  });
  const [inventoryFormLoading, setInventoryFormLoading] = useState(false);
  const [inventoryFormError, setInventoryFormError] = useState("");
  const [inventoryFormSuccess, setInventoryFormSuccess] = useState("");

  const handleInventoryFormChange = (e) => {
    const { name, value } = e.target;
    setInventoryForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleInventoryFormSubmit = async (e) => {
    e.preventDefault();
    setInventoryFormLoading(true);
    setInventoryFormError("");
    setInventoryFormSuccess("");
    try {
      const payload = {
        ...inventoryForm,
        quantity: Number(inventoryForm.quantity),
      };
      await API.post("/inventory/update", payload);
      setInventoryFormSuccess("Inventory added successfully!");
      setInventoryForm({ orgId: "", bloodGroup: "", quantity: "" });
      // Optionally refresh inventory list here if you display it
    } catch (err) {
      setInventoryFormError("Error adding inventory.");
    } finally {
      setInventoryFormLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>BloodMatch Dashboard</h1>
      </header>

      <div className="dashboard-container">
        {/* Left Section - Send Request */}
        <div className="send-request-section">
          <div className="section-header">
            <h2>Send Blood Request</h2>
          </div>

          <form onSubmit={handleSubmit} className="request-form">
            <div className="form-group">
              <label>1. Blood Type:</label>
              <select
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value)}
                className="blood-type-select"
              >
                {bloodTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>2. Quantity (units):</label>
              <input
                type="number"
                min="1"
                max="100"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="quantity-input"
              />
            </div>

            <div className="form-group">
              <label>3. Urgency:</label>
              <div className="urgency-slider">
                <input
                  type="range"
                  min="0"
                  max="2"
                  value={urgency === "Low" ? 0 : urgency === "Medium" ? 1 : 2}
                  onChange={(e) =>
                    setUrgency(
                      ["Low", "Medium", "High"][parseInt(e.target.value)]
                    )
                  }
                  className="slider"
                  data-urgency={urgency.toLowerCase()}
                />
                <div className="slider-labels">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>
                <div className={`urgency-indicator ${urgency.toLowerCase()}`}>
                  {urgency}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>4. Location:</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                list="hospitals"
                className="location-input"
                placeholder="Start typing hospital name..."
              />
              <datalist id="hospitals">
                {hospitals.map((hospital) => (
                  <option key={hospital} value={hospital} />
                ))}
              </datalist>
            </div>

            <button type="submit" className="send-button">
              Send Request
            </button>

            {status && (
              <div
                className={`status-badge ${
                  status === "Sent!" ? "success" : "sending"
                }`}
              >
                {status}
              </div>
            )}
          </form>
        </div>

        {/* Right Section - Manage Requests */}
        <div className="manage-requests-section">
          <div className="section-header">
            <h2>Incoming & Managed Requests</h2>
          </div>

          {/* Admin Add Blood Inventory Form */}
          <div
            style={{
              background: "#f9f9f9",
              padding: 16,
              marginBottom: 24,
              borderRadius: 8,
              border: "1px solid #eee",
            }}
          >
            <h3 style={{ color: "#C62828" }}>Add Blood Inventory (Admin)</h3>
            <form
              onSubmit={handleInventoryFormSubmit}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                alignItems: "center",
              }}
            >
              <input
                name="orgId"
                value={inventoryForm.orgId}
                onChange={handleInventoryFormChange}
                placeholder="Organization ID"
                required
                style={{ flex: 1, padding: 8 }}
              />
              <input
                name="bloodGroup"
                value={inventoryForm.bloodGroup}
                onChange={handleInventoryFormChange}
                placeholder="Blood Group (e.g. A+)"
                required
                style={{ flex: 1, padding: 8 }}
              />
              <input
                name="quantity"
                type="number"
                min="0"
                value={inventoryForm.quantity}
                onChange={handleInventoryFormChange}
                placeholder="Quantity (ml)"
                required
                style={{ flex: 1, padding: 8 }}
              />
              <button
                type="submit"
                disabled={inventoryFormLoading}
                style={{
                  padding: 8,
                  background: "#2E7D32",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                }}
              >
                {inventoryFormLoading ? "Adding..." : "Add Inventory"}
              </button>
            </form>
            {inventoryFormError && (
              <div style={{ color: "red", marginTop: 8 }}>
                {inventoryFormError}
              </div>
            )}
            {inventoryFormSuccess && (
              <div style={{ color: "green", marginTop: 8 }}>
                {inventoryFormSuccess}
              </div>
            )}
          </div>
          <div className="requests-list">
            {requestsLoading ? (
              <div className="no-requests">Loading requests...</div>
            ) : requests.length > 0 ? (
              requests.map((request) => (
                <div
                  key={request._id}
                  className={`request-card ${request.urgency.toLowerCase()} ${
                    request.status?.toLowerCase() || ""
                  }`}
                >
                  <div className="card-header">
                    <span className="request-id">Request #{request._id}</span>
                    <span className="blood-type">{request.bloodType}</span>
                    <span className="quantity">{request.quantity} units</span>
                    <span className="urgency">{request.urgency} Urgency</span>
                    {request.status && (
                      <span
                        className={`request-status ${request.status.toLowerCase()}`}
                      >
                        {request.status}
                      </span>
                    )}
                  </div>
                  <div className="card-body">
                    <div className="location">{request.location}</div>
                    {!request.status && (
                      <div className="action-buttons">
                        <button
                          className="accept-button"
                          onClick={() =>
                            handleRequestAction(request._id, "Accepted")
                          }
                        >
                          Accept
                        </button>
                        <button
                          className="reject-button"
                          onClick={() =>
                            handleRequestAction(request._id, "Rejected")
                          }
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-requests">No pending requests available</div>
            )}
          </div>
        </div>
      </div>

      <footer className="app-footer">
        <p>Powered by xAI - Real-Time Matching</p>
      </footer>
    </div>
  );
}

export default Request;
