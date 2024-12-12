import React, { useState } from "react";
import { handleError, handleSucess } from "../utils";
import axios from "axios";
import { ToastContainer } from "react-toastify";

const AddScheme = () => {
  const [formData, setFormData] = useState({
    scheme_name: "",
    description: "",
    scheme_type: "",
    target_gender: "",
    target_age_group: {
      young: "",
      youth: "",
      adult: "",
      senior_citizen: "",
    },
    min_investment: "",
    max_investment: "",
    roi: "",
    risk_level: "",
    target_occupation: "",
    target_income_level: "",
    target_education_level: "",
    tax_benefit: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("age_")) {
      // Handle nested target_age_group values
      const key = name.split("_")[1];
      setFormData({
        ...formData,
        target_age_group: {
          ...formData.target_age_group,
          [key]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("New Scheme:", formData);
    try {
      const response = await axios.post(
        "http://localhost:3000/Addscheme/schemes",
        formData
      );
      console.log(response.data);
      if (response.data.success) {
        handleSucess(response.data.message);
      } else {
        handleError(response.data.message);
      }
    } catch (error) {
      handleError(error.message);
      console.log(error);
    }
  };

  return (
    <div>
      <h2>Add New Scheme</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Scheme Name:</label>
          <input
            type="text"
            name="scheme_name"
            value={formData.scheme_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Scheme Type:</label>
          <input
            type="text"
            name="scheme_type"
            value={formData.scheme_type}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Target Gender:</label>
          <select
            name="target_gender"
            value={formData.target_gender}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="All">All</option>
          </select>
        </div>
        <div>
          <label>Target Age Group:</label>
          <div>
            <label>Young:</label>
            <input
              type="number"
              name="age_young"
              value={formData.target_age_group.young}
              onChange={handleChange}
              required
              min="0"
              max="100"
            />
          </div>
          <div>
            <label>Youth:</label>
            <input
              type="number"
              name="age_youth"
              value={formData.target_age_group.youth}
              onChange={handleChange}
              required
              min="0"
              max="100"
            />
          </div>
          <div>
            <label>Adult:</label>
            <input
              type="number"
              name="age_adult"
              value={formData.target_age_group.adult}
              onChange={handleChange}
              required
              min="0"
              max="100"
            />
          </div>
          <div>
            <label>Senior Citizen:</label>
            <input
              type="number"
              name="age_senior_citizen"
              value={formData.target_age_group.senior_citizen}
              onChange={handleChange}
              required
              min="0"
              max="100"
            />
          </div>
        </div>
        <div>
          <label>Minimum Investment:</label>
          <input
            type="number"
            name="min_investment"
            value={formData.min_investment}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Maximum Investment:</label>
          <input
            type="number"
            name="max_investment"
            value={formData.max_investment}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Rate of Interest:</label>
          <input
            type="number"
            step="0.01"
            name="roi"
            value={formData.roi}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Risk Level:</label>
          <select
            name="risk_level"
            value={formData.risk_level}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div>
          <label>Target Occupation:</label>
          <input
            type="text"
            name="target_occupation"
            value={formData.target_occupation}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Target Income Level:</label>
          <input
            type="number"
            name="target_income_level"
            value={formData.target_income_level}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Target Education Level:</label>
          <input
            type="number"
            name="target_education_level"
            value={formData.target_education_level}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Tax Benefit:</label>
          <select
            name="tax_benefit"
            value={formData.tax_benefit}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <button type="submit">Add Scheme</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddScheme;
