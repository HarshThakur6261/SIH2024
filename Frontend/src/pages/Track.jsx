import React, { useState, useEffect } from "react";
import axios from "axios";

const Track = () => {
  const [schemes, setSchemes] = useState([]); // To store the fetched tracked schemes

  // Fetch tracked schemes when the component mounts
  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        // Fetching tracked schemes from the backend
        const response = await axios.get("http://localhost:3000/addTrack/track"); 
        setSchemes(response.data); // Set fetched schemes to state
        console.log(response.data); // Log the response for debugging
      } catch (error) {
        console.error("Error fetching schemes:", error);
      }
    };

    fetchSchemes();
  }, []); // Run only once on mount

  // Function to handle the analysis of a scheme
  const handleAnalyze = async(schemeName, target , district, totalAccounts) => {
const payload = {
  schemeName,
  district:district,
  target:target,
  totalAccount:totalAccounts,
}
console.log(payload);
    const response  = await axios.post("http://localhost:3000/analyseGemini" ,payload )
  
   console.log(response.data)
  };

  return (
    <div style={{ height: "100vh", marginLeft: "270px" }}>
      <h2>Track Schemes</h2>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {/* Map through each tracked scheme and display it */}
        {schemes.map((scheme) => (
          <div
            key={scheme._id} // Use _id for unique key
            style={{
              width: "200px",
              padding: "20px",
              margin: "10px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
              textAlign: "center",
            }}
          >
            <h3>{scheme.schemeName}</h3> {/* Scheme name */}
            <p>{scheme.district}</p> {/* Scheme district */}
            <p>Target: {scheme.target}</p> {/* Target */}
            <p>Total Accounts Opened: {scheme.totalAccounts}</p> {/* Total accounts opened */}
            <button
              onClick={() => handleAnalyze(scheme.schemeName, scheme.target , scheme.district, scheme.totalAccounts)}
            >
              Analyze
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Track;
