import React, { useState } from 'react';

const FormPanel = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    bloodGroup: '',
    organ: '',
    state: '',
    city: '',
    zip: '',
    urgency: 'Medium'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <>
      <div className="section-header">
        <h2>Request Form</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="bloodGroup">Blood Group</label>
          <select id="bloodGroup" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} required>
            <option value="">-- Select Blood Group --</option>
            <option>O+</option>
            <option>O-</option>
            <option>A+</option>
            <option>A-</option>
            <option>B+</option>
            <option>B-</option>
            <option>AB+</option>
            <option>AB-</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="organ">Organ</label>
          <select id="organ" name="organ" value={formData.organ} onChange={handleChange} required>
            <option value="">-- Select Organ --</option>
            <option>Heart</option>
            <option>Kidney</option>
            <option>Liver</option>
            <option>Lungs</option>
            <option>Pancreas</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="state">State</label>
          <input type="text" id="state" name="state" value={formData.state} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="city">City</label>
          <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="zip">Zip</label>
          <input type="text" id="zip" name="zip" value={formData.zip} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="urgency">Urgency</label>
          <select id="urgency" name="urgency" value={formData.urgency} onChange={handleChange} required>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button type="reset" className="filter-reset">Clear</button>
          <button type="submit" className="filter-submit">Submit</button>
        </div>
      </form>
    </>
  );
};

export default FormPanel;