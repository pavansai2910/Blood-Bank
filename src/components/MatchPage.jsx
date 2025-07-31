import React, { useState } from 'react';


import FormPanel from "./FormPanel";
import OrganTable from "./OrganTable";
import './Match2.css';
import DonarMap from './DonarMap.jsx'

const MatchPage = () => {
  const [organType, setOrganType] = useState("");
  const [bloodGroup, setBloodGroup] = useState(""); 
  const [city, setCity] = useState("");
  const handleFormSubmit = (formData) => {
    setOrganType(formData.organ);
    setBloodGroup(formData.bloodGroup);
    setCity(formData.city); 
  };

  return (
    <div className="app">
      
      <div className="dashboard-container">
        <div className="send-request-section">
          <FormPanel onSubmit={handleFormSubmit} />
        </div>
        <div className="manage-requests-section">
          <OrganTable organType={organType} bloodGroup={bloodGroup}/>
          <DonarMap selectedCity={city} />
        </div>
      </div>

    </div>
  );
};

export default MatchPage;