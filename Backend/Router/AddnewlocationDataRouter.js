const express = require("express");
const { RegionModel } = require("../model/db");
const AddnewlocationDataRouter = express.Router();

AddnewlocationDataRouter.post('/regions', async (req, res) => {
  try {
    console.log("Received data:", req.body);

    // Extract and validate the incoming data
    const {
      region_name,
      population_density,
     
      gender_ratio,
      education_level,
      income_level,
      age_distribution,
      type,
      occupation,
      festive_season_month,
      wedding_season_month,
      admission_season_month,
    } = req.body;

    // Validate age_distribution fields
    const { young, youth, adult, senior_citizen } = age_distribution;
    if (
      young + youth + adult + senior_citizen !== 100
    ) {
      return res.status(400).json({
        successfull: false,
        error: "Age distribution percentages must add up to 100.",
      });
    }

    // Validate type
    const validTypes = ["Rural", "Urban", "Semi-Urban"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        successfull: false,
        error: `Invalid type. Must be one of: ${validTypes.join(", ")}.`,
      });
    }

    // Validate seasonal months
    const validMonths = [
      "January", "February", "March", "April", "May", "June", "July",
      "August", "September", "October", "November", "December",
    ];
    const validateMonths = (months) =>
      months.every((month) => validMonths.includes(month));

    if (!validateMonths(festive_season_month)) {
      return res.status(400).json({
        successfull: false,
        error: "Invalid festive season months provided.",
      });
    }

    if (!validateMonths(wedding_season_month)) {
      return res.status(400).json({
        successfull: false,
        error: "Invalid wedding season months provided.",
      });
    }

    if (!validateMonths(admission_season_month)) {
      return res.status(400).json({
        successfull: false,
        error: "Invalid admission season months provided.",
      });
    }

    // Create the new region instance
    const newRegion = new RegionModel({
      region_name,
      population_density,
    
      gender_ratio,
      education_level,
      income_level,
      age_distribution,
      type,
      occupation,
      festive_season_month,
      wedding_season_month,
      admission_season_month,
    });

    // Save the region to the database
    await newRegion.save();

    res.status(201).json({
      successfull: true,
      message: "Region created successfully",
      newRegion,
    });
  } catch (error) {
    console.error("Error creating region:", error);
    res.status(400).json({
      successfull: false,
      error: error.message,
    });
  }
});

module.exports = AddnewlocationDataRouter;