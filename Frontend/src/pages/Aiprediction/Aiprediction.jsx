// import React from 'react'

// const Aiprediction = () => {
//   return (
//     <div>
//       heelo
//     </div>
//   )
// }

// export default Aiprediction

import React, { useState } from "react";
import axios from "axios";

const Aiprediction = () => {
  const [location, setLocation] = useState(""); // To store location input
  const [recommendations, setRecommendations] = useState([]); // To store API results
  const [error, setError] = useState(""); // To handle errors

  const handleRecommend = async () => {
    setError(""); // Clear previous errors
    setRecommendations([]); // Clear previous recommendations

    const requestData = {
      userId: "123", // Hardcoded userId (replace with dynamic value if needed)
      location: location,
    };

    try {
      const response = await axios.post("http://127.0.0.1:5000/recommend", requestData);

      if (response.data.status === "success") {
        setRecommendations(response.data.data.recommendations);
      } else {
        setError(response.data.message || "Unexpected error occurred.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to connect to the server.");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Scheme Recommendation System</h1>
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="location" style={{ marginRight: "10px" }}>Enter Location:</label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location (e.g., Theni)"
          style={{ padding: "5px", width: "200px" }}
        />
        <button
          onClick={handleRecommend}
          style={{ marginLeft: "10px", padding: "5px 10px", cursor: "pointer" }}
        >
          Get Recommendations
        </button>
      </div>

      {error && (
        <div style={{ color: "red", marginBottom: "20px" }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {recommendations.length > 0 && (
        <div>
          <h2>Top Recommendations:</h2>
          <ul>
            {recommendations.map((rec, index) => (
              <li key={index} style={{ marginBottom: "10px" }}>
                <strong>{rec.scheme}</strong> (Score: {rec.score.toFixed(2)})
                <ul>
                  <li><strong>ROI:</strong> {rec.details.ROI}%</li>
                  <li><strong>Target Gender:</strong> {rec.details.target_gender}</li>
                  <li><strong>Risk Level:</strong> {rec.details.risk_level}</li>
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Aiprediction;
