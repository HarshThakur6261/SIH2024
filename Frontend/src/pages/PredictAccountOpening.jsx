import axios from "axios";
import React, { useState, useEffect } from "react";
import styles from "./PredictionAccountOpening.module.css"; // Importing the CSS module

const PredictAccountOpening = () => {
    const [selectedScheme, setSelectedScheme] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [districts, setDistricts] = useState([]);
    const [predictionResult, setPredictionResult] = useState(null); // To store prediction result
    const [loading, setLoading] = useState(false); // Loading state for the prediction

    useEffect(() => {
        setDistricts([
            "Chennai",
            "Coimbatore",
            "Madurai",
            "Salem",
            "Tiruchirappalli",
            "Tirunelveli",
            "Vellore",
            "Erode",
            "Dindigul",
            "Kancheepuram",
        ]);
    }, []);

    const schemes = [
        "Post Office Saving Account",
        "Post Office Recurring Deposit Account",
        "Post Office Time Deposit Account",
        "Post Office Monthly Income Scheme",
        "Senior Citizen Savings Scheme",
        "Public Provident Fund",
        "Sukanya Samriddhi Yojana",
        "Postal Life Insurance",
        "Rural Postal Life Insurance",
        "National Savings Certificate",
        "Kisan Vikas Patra",
        "Fixed Deposits",
        "Recurring Deposits",
        "Mahila Samman Savings Certificate",
    ];

    const handleTrack = async () => {
        // Add your logic for handling tracking here
    };

    const handlePredict = async () => {
      
        setPredictionResult(null); // Reset previous prediction

        const payload = {
            "region": `${selectedDistrict}`,
            "scheme": `${selectedScheme}`,
        };

        try {
            const response = await axios.post(
                "http://127.0.0.1:5000/predict",
                payload
            );
            setLoading(false); // Reset loading state
            setPredictionResult(response.data.predicted_accounts_next_year); // Store the prediction result
        } catch (error) {
            setLoading(false);
            console.error("Error in prediction request:", error.response || error.message);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.innerCon}>
                <img src="/assets/fullbanner.png" alt="" />
                <h2 className={styles.title}>Scheme's Success Prediction</h2>

                <div className={styles.formGroup}>
                    <label htmlFor="scheme" className={styles.label}>
                        Select Scheme:
                    </label>
                    <select
                        id="scheme"
                        value={selectedScheme}
                        onChange={(e) => setSelectedScheme(e.target.value)}
                        className={styles.select}
                    >
                        <option value="">Select Scheme</option>
                        {schemes.map((scheme, index) => (
                            <option key={index} value={scheme}>
                                {scheme}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="district" className={styles.label}>
                        Select District:
                    </label>
                    <select
                        id="district"
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        className={styles.select}
                    >
                        <option value="">Select District</option>
                        {districts.length > 0 ? (
                            districts.map((district, index) => (
                                <option key={index} value={district}>
                                    {district}
                                </option>
                            ))
                        ) : (
                            <option value="">Loading districts...</option>
                        )}
                    </select>
                </div>

                <div className={styles.btncon}>
                    <button className={styles.button} onClick={handlePredict}>
                        Predict
                    </button>


                    <button className={styles.button} onClick={handleTrack}>
                        Add To Track
                    </button>
                </div>

                {loading && <p className={styles.loading}>Loading prediction...</p>}

                {predictionResult !== null && !loading && (
                    <div className={styles.result}>
                        <p className={styles.resultTitle}>Predicted Accounts for Next Year:</p>
                        <p className={styles.resultValue}>{predictionResult}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PredictAccountOpening;