import axios from "axios";
import React, { useState } from "react";
import styles from "./PredictionAccountOpening.module.css"; // Importing the CSS module

const PredictAccountOpening = () => {
  const [schemes, setSchemes] = useState([]);
  const [district, setDistrict] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const districts = [
    "Coimbatore",
    "Cuddalore",
    "Dharmapuri",
    "Dindigul",
    "Erode",
  ];

  // Fetch schemes when the "Predict" button is clicked
  const fetchSchemes = async () => {
    if (!district) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `http://localhost:3000/PredictAccount/${district}`
      );
      console.log(response.data);
      const schemesData = response.data;

      const filteredSchemes = Object.entries(schemesData)
        .filter(([key]) => key !== "_id" && key !== "cityName")
        .map(([schemeName, predictedAccounts]) => ({
          schemeName,
          predictedAccounts,
        }))
        .sort((a, b) => b.predictedAccounts - a.predictedAccounts);

      setSchemes(filteredSchemes);
    } catch (error) {
      console.error("Error fetching schemes:", error);
      setError("Failed to fetch schemes. Please try again.");
      setSchemes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = async (schemeName, predictedAccounts) => {
    try {
      const response = await axios.post("http://localhost:3000/addTrack", {
        schemeName,
        district,
        target: predictedAccounts,
      });
      alert('Tracking entry added successfully!');
      console.log(response.data);
    } catch (error) {
      alert('Failed to add tracking entry.');
      console.error('Error adding track:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.innerCon}>
        <img src="/assets/fullbanner.png" alt="Banner" />
        <h2 className={styles.title}>Scheme's Success Prediction</h2>

        <div className={styles.formGroup}>
          <label htmlFor="district" className={styles.label}>
            Select District:
          </label>
          <select
            id="district"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className={styles.select}
          >
            <option value="">Select District</option>
            {districts.map((district, index) => (
              <option key={index} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>

        <button onClick={fetchSchemes} className={styles.predictButton}>
          Predict
        </button>

        {loading && <p className={styles.loading}>Loading...</p>}

        {error && <p className={styles.error}>{error}</p>}

        {schemes.length > 0 && (
          <div className={styles.schemesList}>
            <h3 className={styles.schemesTitle}>
              Predicted Accounts for District: {district}
            </h3>
            <div className={styles.schemesContainer}>
              {schemes.map((scheme, index) => (
                <div key={index} className={styles.schemeItem}>
                  <span className={styles.schemeName}>{scheme.schemeName}</span>
                  <span className={styles.predictedAccounts}>
                    {scheme.predictedAccounts}
                  </span>
                  <button
                    className={styles.trackButton}
                    onClick={() => handleTrack(scheme.schemeName, scheme.predictedAccounts)}
                  >
                    Track
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {district && schemes.length === 0 && !loading && (
          <p className={styles.noData}>No schemes available for this district.</p>
        )}
      </div>
    </div>
  );
};

export default PredictAccountOpening;
