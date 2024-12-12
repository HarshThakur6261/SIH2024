import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Accounts = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    scheme: "",
    accountNumber: "",
    depositAmount: "",
    branch: "",
    contact: "",
    district: "",
    state: "",
  });

  const schemes = [
    "Post Office Savings Account",
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/accounts/add", formData);
      toast.success(response.data.message);
      setFormData({
        name: "",
        age: "",
        gender: "",
        scheme: "",
        accountNumber: "",
        depositAmount: "",
        branch: "",
        contact: "",
        district: "",
        state: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px", backgroundColor: "#f9f9f9" }}>
      <h2 style={{ textAlign: "center", color: "#333" }}>Register New Account</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Age:</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Scheme:</label>
          <select
            name="scheme"
            value={formData.scheme}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
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
          <label style={{ display: "block", marginBottom: "5px" }}>Account Number:</label>
          <input
            type="text"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Deposit Amount:</label>
          <input
            type="number"
            name="depositAmount"
            value={formData.depositAmount}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Branch:</label>
          <input
            type="text"
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Contact Number:</label>
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>District:</label>
          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>State:</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
        </div>
        <button type="submit" style={{ width: "100%", padding: "10px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "5px", fontSize: "16px", cursor: "pointer" }}>
          Register Account
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Accounts;