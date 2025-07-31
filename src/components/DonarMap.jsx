import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

const DonorMap = ({ selectedCity }) => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  const cityCoords = {
    Chennai: [13.0827, 80.2707],
    Bangalore: [12.9716, 77.5946],
    Hyderabad: [17.385, 78.4867],
    Madurai: [9.9252, 78.1198],
  };

  // Fetch donors from backend
  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const response = await axios.get("http://localhost:5050/api/donors");
        setDonors(response.data);
      } catch (error) {
        console.error("Error fetching donors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonors();
  }, []);

  // Use default if selectedCity is invalid
  const hospitalCity =
    selectedCity && cityCoords[selectedCity] ? selectedCity : "Chennai";
  const hospitalCoords = cityCoords[hospitalCity];

  // Utility to calculate distance between two lat/lng in km
  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Convert donor location string to coordinates
  const parseLocation = (location) => {
    // This is a simple parser - in a real app, you'd use a geocoding service
    const locationMap = {
      "New York, NY": [40.7128, -74.006],
      "Los Angeles, CA": [34.0522, -118.2437],
      "Chicago, IL": [41.8781, -87.6298],
      "Boston, MA": [42.3601, -71.0589],
      "Miami, FL": [25.7617, -80.1918],
      "Seattle, WA": [47.6062, -122.3321],
      Chennai: [13.0827, 80.2707],
      Bangalore: [12.9716, 77.5946],
      Hyderabad: [17.385, 78.4867],
      Madurai: [9.9252, 78.1198],
    };

    return locationMap[location] || [0, 0]; // Default to [0,0] if location not found
  };

  // Filter donors within 300km and convert to map format
  const donorLocations = donors
    .map((donor) => {
      const [lat, lng] = parseLocation(donor.location);
      return {
        lat,
        lng,
        name: donor.name,
        bloodType: donor.bloodType,
        donationType: donor.donationType,
        distance: getDistanceFromLatLonInKm(
          hospitalCoords[0],
          hospitalCoords[1],
          lat,
          lng
        ),
      };
    })
    .filter(
      (donor) => donor.distance <= 300 && donor.lat !== 0 && donor.lng !== 0
    );

  // Default Leaflet marker fix
  const DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  });
  L.Marker.prototype.options.icon = DefaultIcon;

  if (loading) {
    return <div>Loading donor map...</div>;
  }

  return (
    <div>
      <h3>Donor Map (within 300km of {hospitalCity})</h3>
      <p>Found {donorLocations.length} donors in range</p>
      <MapContainer
        center={hospitalCoords}
        zoom={7}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Circle
          center={hospitalCoords}
          radius={300000}
          pathOptions={{ color: "blue", fillColor: "blue", fillOpacity: 0.2 }}
        />
        <Marker position={hospitalCoords}>
          <Popup>Hospital: {hospitalCity}</Popup>
        </Marker>
        {donorLocations.map((donor, index) => (
          <Marker key={index} position={[donor.lat, donor.lng]}>
            <Popup>
              <strong>{donor.name}</strong>
              <br />
              Blood Type: {donor.bloodType}
              <br />
              Donation Type: {donor.donationType}
              <br />
              Distance: {Math.round(donor.distance)}km
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default DonorMap;
