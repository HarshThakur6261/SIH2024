import React, { useState, useEffect } from "react";
import axios from "axios";

const Track = () => {
  // const [schemes, setSchemes] = useState([]); // To store the fetched schemes
  const schemes = [
    "Post Office Saving Account",
  
];
  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const response = await axios.get("http://localhost:3000/accounts/total"); // Replace with your backend endpoint
        setSchemes(response.data); // Assuming response.data is an array of schemes
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching schemes:", error);
      }
    };

    fetchSchemes();
  }, []); // This will run once when the component mounts

  // Function to handle analysis (you can modify this)
  const handleAnalyze = (schemeId) => {
    alert("Analyzing scheme with ID: due to election month the banks are closed for more time");
    // Add your analysis logic here, like navigating to a detailed page or making an API call
  };

  return (
    <div style={{ height: "100vh", marginLeft: "270px" }}>
      <h2>Track Schemes</h2>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {schemes.map((scheme) => (
          <div
            key={scheme} // Assuming each scheme has a unique _id
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
            <h3>{scheme}</h3> {/* Scheme name */}
            <p>{scheme}</p> {/* Scheme district */}
            <p>target 50</p>
            <p>total account oppend :701</p>
            <button onClick={() => handleAnalyze(scheme._id)}>
              Analyze
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Track;
