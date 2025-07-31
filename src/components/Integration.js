import React, { useState, useEffect } from "react";
import axios from "axios";

function Integration() {
  const [systems, setSystems] = useState([]);
  const [bloodInventory, setBloodInventory] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalSystem, setModalSystem] = useState(null);
  const [systemInventory, setSystemInventory] = useState([]);

  // Admin form state
  const [form, setForm] = useState({
    name: "",
    status: "Pending",
    color: "",
    lastSync: "",
    logs: "",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // Fetch systems
  useEffect(() => {
    const fetchSystems = async () => {
      try {
        const res = await axios.get("http://localhost:5050/api/integration");
        setSystems(res.data);
      } catch (error) {
        console.error("❌ Error fetching systems:", error);
      }
    };
    fetchSystems();
  }, []);

  // Fetch all blood inventory (for the table below)
  useEffect(() => {
    const fetchBloodInventory = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5050/api/bloodinventories"
        );
        setBloodInventory(res.data);
      } catch (error) {
        console.error("❌ Error fetching blood inventory:", error);
      }
    };
    fetchBloodInventory();
  }, []);

  const handleAction = async (action, id) => {
    try {
      const endpoint =
        action === "Sync Now"
          ? `http://localhost:5050/api/integration/sync/${id}`
          : `http://localhost:5050/api/integration/retry/${id}`;
      await axios.post(endpoint);
      const res = await axios.get("http://localhost:5050/api/integration");
      setSystems(res.data);
    } catch (err) {
      console.error(`❌ Error performing ${action}:`, err);
    }
  };

  const handleDownloadSystemLogs = (system) => {
    const text = system.logs?.join("\n") || "No logs available";
    const blob = new Blob([text], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${system.name.replace(/\s+/g, "_").toLowerCase()}-logs.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    if (!systems.length) return;
    const headers = ["System Name", "Status", "Last Sync"];
    const rows = systems.map((sys) => [sys.name, sys.status, sys.lastSync]);

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += headers.join(",") + "\n";
    rows.forEach((row) => {
      csvContent += row.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = "integration-systems.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInventoryModal = async (system) => {
    try {
      const res = await axios.get(
        `http://localhost:5050/api/bloodinventory/org/${system.orgId}`
      );
      setSystemInventory(res.data);
      setModalSystem(system.name);
      setModalVisible(true);
    } catch (err) {
      console.error("❌ Error fetching inventory for system:", err);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setModalSystem(null);
    setSystemInventory([]);
  };

  // Add this handler for the admin form
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");
    setFormSuccess("");
    try {
      const payload = {
        ...form,
        logs: form.logs ? form.logs.split(",").map((l) => l.trim()) : [],
      };
      await axios.post("http://localhost:5050/api/integration/create", payload);
      setFormSuccess("System added successfully!");
      setForm({
        name: "",
        status: "Pending",
        color: "",
        lastSync: "",
        logs: "",
      });
      // Refresh systems list
      const res = await axios.get("http://localhost:5050/api/integration");
      setSystems(res.data);
    } catch (err) {
      setFormError("Error adding system.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div>
      {/* Admin Add System Form */}
      <div
        style={{
          background: "#f9f9f9",
          padding: 16,
          marginBottom: 24,
          borderRadius: 8,
          border: "1px solid #eee",
        }}
      >
        <h3 style={{ color: "#C62828" }}>Add Integration System (Admin)</h3>
        <form
          onSubmit={handleFormSubmit}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            alignItems: "center",
          }}
        >
          <input
            name="name"
            value={form.name}
            onChange={handleFormChange}
            placeholder="System Name"
            required
            style={{ flex: 1, padding: 8 }}
          />
          <select
            name="status"
            value={form.status}
            onChange={handleFormChange}
            style={{ flex: 1, padding: 8 }}
          >
            <option value="Synced">Synced</option>
            <option value="Pending">Pending</option>
            <option value="Error">Error</option>
          </select>
          <input
            name="color"
            value={form.color}
            onChange={handleFormChange}
            placeholder="Color (e.g. #28A745)"
            style={{ flex: 1, padding: 8 }}
          />
          <input
            name="lastSync"
            value={form.lastSync}
            onChange={handleFormChange}
            placeholder="Last Sync (e.g. 5 min ago)"
            style={{ flex: 1, padding: 8 }}
          />
          <input
            name="logs"
            value={form.logs}
            onChange={handleFormChange}
            placeholder="Logs (comma separated)"
            style={{ flex: 2, padding: 8 }}
          />
          <button
            type="submit"
            disabled={formLoading}
            style={{
              padding: 8,
              background: "#2E7D32",
              color: "white",
              border: "none",
              borderRadius: 4,
            }}
          >
            {formLoading ? "Adding..." : "Add System"}
          </button>
        </form>
        {formError && (
          <div style={{ color: "red", marginTop: 8 }}>{formError}</div>
        )}
        {formSuccess && (
          <div style={{ color: "green", marginTop: 8 }}>{formSuccess}</div>
        )}
      </div>

      <main style={styles.main}>
        <h2 style={styles.heading}>Connected Systems</h2>
        <button style={styles.exportCSVButton} onClick={handleExportCSV}>
          📊 Export System Data (CSV)
        </button>

        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeaderRow}>
                <th style={styles.cell}>System Name</th>
                <th style={styles.cell}>Status</th>
                <th style={styles.cell}>Last Sync</th>
                <th style={styles.cell}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {systems.map((sys) => (
                <tr key={sys._id}>
                  <td style={styles.cell}>{sys.name}</td>
                  <td
                    style={{
                      ...styles.cell,
                      backgroundColor: sys.color || "#eee",
                    }}
                  >
                    {sys.status}
                  </td>
                  <td style={styles.cell}>{sys.lastSync}</td>
                  <td style={styles.cell}>
                    <button
                      style={{
                        ...styles.actionButton,
                        backgroundColor: "#2E7D32",
                      }}
                      onClick={() => handleAction("Sync Now", sys._id)}
                    >
                      Sync Now
                    </button>
                    <button
                      style={{
                        ...styles.actionButton,
                        backgroundColor: "#D32F2F",
                      }}
                      onClick={() => handleAction("Retry", sys._id)}
                    >
                      Retry
                    </button>
                    <button
                      style={{
                        ...styles.actionButton,
                        backgroundColor: "#0288D1",
                      }}
                      onClick={() => handleDownloadSystemLogs(sys)}
                    >
                      📄 Export Logs
                    </button>
                    <button
                      style={{
                        ...styles.actionButton,
                        backgroundColor: "#6A1B9A",
                      }}
                      onClick={() => handleOpenInventoryModal(sys)}
                    >
                      🩸 View Inventory
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* General Blood Inventory Table */}
        {/* <h2 style={styles.heading}>Blood Inventory</h2>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.cell}>Organization ID</th>
                <th style={styles.cell}>Blood Group</th>
                <th style={styles.cell}>Quantity (ml)</th>
                <th style={styles.cell}>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {bloodInventory.map((inv, idx) => (
                <tr key={idx}>
                  <td style={styles.cell}>{inv.orgId}</td>
                  <td style={styles.cell}>{inv.bloodGroup}</td>
                  <td style={styles.cell}>{inv.quantity}</td>
                  <td style={styles.cell}>{new Date(inv.lastUpdated).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> */}

        {/* Modal for View Inventory */}
        {modalVisible && (
          <div style={styles.modal}>
            <h3 style={{ color: "#C62828" }}>Inventory for {modalSystem}</h3>
            {systemInventory.length ? (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.cell}>Blood Group</th>
                    <th style={styles.cell}>Quantity (ml)</th>
                    <th style={styles.cell}>Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {systemInventory.map((item, index) => (
                    <tr key={index}>
                      <td style={styles.cell}>{item.bloodGroup}</td>
                      <td style={styles.cell}>{item.quantity}</td>
                      <td style={styles.cell}>
                        {new Date(item.lastUpdated).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No inventory found for this organization.</p>
            )}
            <button style={styles.closeButton} onClick={handleCloseModal}>
              Close
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  header: {
    backgroundColor: "#C62828",
    height: "80px",
    padding: "16px",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    backgroundColor: "white",
    color: "#C62828",
    border: "none",
    padding: "8px 12px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  main: {
    backgroundColor: "#ffffff",
    padding: "16px",
  },
  heading: {
    color: "#C62828",
    marginTop: "32px",
  },
  exportCSVButton: {
    backgroundColor: "#2E7D32",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer",
    marginBottom: "10px",
  },
  tableContainer: {
    overflowY: "auto",
    maxHeight: "400px",
    border: "1px solid #999",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeaderRow: {
    backgroundColor: "#f5f5f5",
    borderBottom: "1px solid #999",
  },
  cell: {
    padding: "8px",
    textAlign: "left",
  },
  actionButton: {
    marginRight: "8px",
    marginTop: "4px",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "6px 10px",
    cursor: "pointer",
  },
  modal: {
    position: "fixed",
    top: "10%",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "white",
    border: "2px solid #C62828",
    padding: "24px",
    zIndex: 1000,
    width: "500px",
    maxHeight: "70vh",
    overflowY: "auto",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
  },
  closeButton: {
    marginTop: "16px",
    backgroundColor: "#C62828",
    color: "white",
    padding: "6px 12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  footer: {
    backgroundColor: "#C62828",
    color: "white",
    height: "60px",
    padding: "16px",
    textAlign: "center",
    fontSize: "14px",
  },
};

export default Integration;
