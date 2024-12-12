import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OpenAccount = () => {
  const [formData, setFormData] = useState({
    
    scheme: "",
    district: "",
   
  });

  const schemes = [
    "sukanyaSamriddhiYojana",
    "kisanVikasPatra",
    "seniorCitizenSavingsScheme",
    "postOfficeSavingsAccount",
    "postOfficeMonthlyIncomeScheme",
    "publicProvidentFund",
    "mahilaSammanSavingsCertificate",
    "postOfficeTimeDepositAccount",
    "pmCARESforChildrenScheme",
    "postOfficeRecurringDepositAccount",
    "nationalSavingsCertificate",
    "postalLifeInsurance",
    "ruralPostalLifeInsurance",
    "fixedDeposits",
    "recurringDeposits",
  ];

  const district = [
    "Coimbatore",
    "Cuddalore",
    "Dharmapuri",
    "Dindigul",
    "Erode",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);  // Log form data for verification
    try {
      const response = await axios.put(
        "http://localhost:3000/updateAccountByOne",
        formData
      );
      toast.success(response.data.message);
      setFormData({
        
        scheme: "",
        district: "",
        
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#333" }}>
        Register New Account
      </h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </div>
        
    
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Scheme:
          </label>
          <select
            name="scheme"
            value={formData.scheme}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          >
            <option value="">Select Scheme</option>
            {schemes.map((scheme, index) => (
              <option key={index} value={scheme}>
                {scheme}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            District:
          </label>
          <select
            name="district"
            value={formData.district}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          >
            <option value="">Select district</option>
            {district.map((distric, index) => (
              <option key={index} value={distric}>
                {distric}
              </option>
            ))}
          </select>
        </div>
    
        <button
        onClick={handleSubmit}
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Register Account
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default OpenAccount;
