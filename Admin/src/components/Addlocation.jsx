import React from "react";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { handleError, handleSucess } from "../utils";
import axios from "axios";

const AddLocation = () => {
  const [formData, setFormData] = useState({
    region_name: "",
    population_density: "",
    gender_ratio: "",
    education_level: "",
    income_level: "",
    age_distribution: {
      young: "",
      youth: "",
      adult: "",
      senior_citizen: "",
    },
    type: "",
    occupation: "",
    festive_season_month: "",
    wedding_season_month: "",
    admission_season_month: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("age_distribution")) {
      const ageGroup = name.split(".")[1];
      setFormData({
        ...formData,
        age_distribution: {
          ...formData.age_distribution,
          [ageGroup]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const ageDistribution = {
        young: parseFloat(formData.age_distribution.young),
        youth: parseFloat(formData.age_distribution.youth),
        adult: parseFloat(formData.age_distribution.adult),
        senior_citizen: parseFloat(formData.age_distribution.senior_citizen),
      };

      const requestData = {
        region_name: formData.region_name,
        population_density: parseInt(formData.population_density, 10),
       
        gender_ratio: parseFloat(formData.gender_ratio),
        education_level: parseFloat(formData.education_level),
        income_level: parseInt(formData.income_level, 10),
        age_distribution: ageDistribution,
        type: formData.type,
        occupation: formData.occupation,
        festive_season_month: formData.festive_season_month.split(",").map((month) => month.trim()),
        wedding_season_month: formData.wedding_season_month.split(",").map((month) => month.trim()),
        admission_season_month: formData.admission_season_month.split(",").map((month) => month.trim()),
      };

      console.log(requestData);

      const response = await axios.post(
        "http://localhost:3000/AddnewlocationData/regions",
        requestData
      );

      if (response.data.successfull) {
        handleSucess(response.data.message);
      } else {
        handleError(response.data.error);
      }
    } catch (error) {
      console.error(error);
      handleError("An error occurred while submitting the data.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Region Name:
        <input
          type="text"
          name="region_name"
          value={formData.region_name}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Population Density:
        <input
          type="number"
          name="population_density"
          value={formData.population_density}
          onChange={handleChange}
          required
        />
      </label>

      

      

      <label>
        Gender Ratio:
        <input
          type="number"
          step="0.000001"
          name="gender_ratio"
          value={formData.gender_ratio}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Education Level (%):
        <input
          type="number"
          step="0.01"
          name="education_level"
          value={formData.education_level}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Income Level:
        <input
          type="number"
          name="income_level"
          value={formData.income_level}
          onChange={handleChange}
          required
        />
      </label>

      <fieldset>
        <legend>Age Distribution (%):</legend>
        <label>
          Young:
          <input
            type="number"
            step="0.01"
            name="age_distribution.young"
            value={formData.age_distribution.young}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Youth:
          <input
            type="number"
            step="0.01"
            name="age_distribution.youth"
            value={formData.age_distribution.youth}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Adult:
          <input
            type="number"
            step="0.01"
            name="age_distribution.adult"
            value={formData.age_distribution.adult}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Senior Citizen:
          <input
            type="number"
            step="0.01"
            name="age_distribution.senior_citizen"
            value={formData.age_distribution.senior_citizen}
            onChange={handleChange}
            required
          />
        </label>
      </fieldset>

      <label>
        Type (Rural/Urban/Semi-Urban):
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        >
          <option value="">Select Type</option>
          <option value="Rural">Rural</option>
          <option value="Urban">Urban</option>
          <option value="Semi-Urban">Semi-Urban</option>
        </select>
      </label>

      <label>
        Occupation:
        <input
          type="text"
          name="occupation"
          value={formData.occupation}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Festive Season Months (comma-separated):
        <input
          type="text"
          name="festive_season_month"
          value={formData.festive_season_month}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Wedding Season Months (comma-separated):
        <input
          type="text"
          name="wedding_season_month"
          value={formData.wedding_season_month}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Admission Season Months (comma-separated):
        <input
          type="text"
          name="admission_season_month"
          value={formData.admission_season_month}
          onChange={handleChange}
          required
        />
      </label>

      <button type="submit">Submit</button>
      <ToastContainer />
    </form>
  );
};

export default AddLocation;
