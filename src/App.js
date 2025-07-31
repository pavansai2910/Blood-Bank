import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import BloodInventory from "./components/Request";
import Registry from "./components/OrganRegistry";
import MatchPage from "./components/MatchPage";
import Integration from "./components/Integration";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/user-dashboard" element={<Dashboard />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/blood-inventory" element={<BloodInventory />} />
        <Route path="/organ-registry" element={<Registry />} />
        <Route path="/match-requests" element={<MatchPage />} />
        <Route path="/integration-hub" element={<Integration />} />
      </Routes>
    </Router>
  );
}

export default App;
