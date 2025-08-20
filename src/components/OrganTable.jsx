import React, { useEffect, useState } from 'react';
import './OrganTable.css'; // Import your styles here
import { API } from '../api';

const OrganTable = ({ organType, bloodGroup }) => {
  const [donors, setDonors] = useState([]);
  const [poppedRow, setPoppedRow] = useState(null); // To handle per-row pop animation

  useEffect(() => {
    API.get('/donors')
      .then((response) => {
        setDonors(response.data);
      })
      .catch((error) => {
        console.error('Error fetching donors:', error);
      });
  }, []);

  const filteredDonors = donors.filter((donor) => {
    const organMatch = organType ? donor.organ.toLowerCase() === organType.toLowerCase() : true;
    const bloodMatch = bloodGroup ? donor.bloodType.toUpperCase() === bloodGroup.toUpperCase() : true;
    return organMatch && bloodMatch;
  });

  const handleMatchRequest = async (index) => {
    setPoppedRow(index); // Trigger pop effect on clicked row
    
    try {
      const donor = filteredDonors[index] || {
        name: ['Riya Sharma', 'John Doe', 'Lakshmi', 'Arjun Mehta', 'Sneha Reddy', 'Ravi Sharma'][index],
        organ: ['Kidney', 'Kidney', 'Kidney', 'Liver', 'Heart', 'Lungs'][index],
        location: ['Chennai', 'Chennai', 'Chennai', 'Mumbai', 'Hyderabad', 'Delhi'][index]
      };
      
      // Create match request data
      const matchRequestData = {
        donorId: `donor_${index}`,
        recipientId: 'current_user', // This would be the logged-in user's ID
        organ: donor.organ
      };
      
      // Send match request to backend
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
    
    setTimeout(() => setPoppedRow(null), 100); // Remove pop after animation time
  };

  return (
    <>
      <div className="section-header">
        <h2>Available Donations</h2>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Organ</th>
              <th>Donor Location</th>
              <th>Availability</th>
              <th>Compatibility (%)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Riya Sharma</td>
              <td>Kidney</td>
              <td>Chennai</td>
              <td>High</td>
              <td>89%</td>
              <td>
                <button 
                  className={`pop-btn ${poppedRow === 0 ? 'popped' : ''}`}
                  onClick={() => handleMatchRequest(0)}
                >
                  Match Request
                </button>
              </td>
            </tr>
            <tr>
              <td>John Doe</td>
              <td>Kidney</td>
              <td>Chennai</td>
              <td>High</td>
              <td>87%</td>
              <td>
                <button 
                  className={`pop-btn ${poppedRow === 1 ? 'popped' : ''}`}
                  onClick={() => handleMatchRequest(1)}
                >
                  Match Request
                </button>
              </td>
            </tr>
            <tr>
              <td>Lakshmi</td>
              <td>Kidney</td>
              <td>Chennai</td>
              <td>High</td>
              <td>91%</td>
              <td>
                <button 
                  className={`pop-btn ${poppedRow === 2 ? 'popped' : ''}`}
                  onClick={() => handleMatchRequest(2)}
                >
                  Match Request
                </button>
              </td>
            </tr>
            <tr>
              <td>Arjun Mehta</td>
              <td>Liver</td>
              <td>Mumbai</td>
              <td>Medium</td>
              <td>86%</td>
              <td>
                <button 
                  className={`pop-btn ${poppedRow === 3 ? 'popped' : ''}`}
                  onClick={() => handleMatchRequest(3)}
                >
                  Match Request
                </button>
              </td>
            </tr>
            <tr>
              <td>Sneha Reddy</td>
              <td>Heart</td>
              <td>Hyderabad</td>
              <td>High</td>
              <td>85%</td>
              <td>
                <button 
                  className={`pop-btn ${poppedRow === 4 ? 'popped' : ''}`}
                  onClick={() => handleMatchRequest(4)}
                >
                  Match Request
                </button>
              </td>
            </tr>
            <tr>
              <td>Ravi Sharma</td>
              <td>Lungs</td>
              <td>Delhi</td>
              <td>Low</td>
              <td>93%</td>
              <td>
                <button 
                  className={`pop-btn ${poppedRow === 5 ? 'popped' : ''}`}
                  onClick={() => handleMatchRequest(5)}
                >
                  Match Request
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default OrganTable;