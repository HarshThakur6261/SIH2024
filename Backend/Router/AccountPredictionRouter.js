const express = require("express");
const { AccountPredictionModel } = require("../model/db");
const AccountPredictionRouter = express.Router();

// GET route to fetch account prediction data for a specific city
AccountPredictionRouter.get("/:city", async (req, res) => {
  const cityName = req.params.city;
  console.log(cityName);

  try {
    // Find the document matching the city name
    const accountPredictionData = await AccountPredictionModel.findOne({
      cityName: cityName, // Use CityName (as per your schema)
    });

    if (!accountPredictionData) {
      return res.status(404).json({ message: "City not found" });
    }

    res.json(accountPredictionData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = AccountPredictionRouter;
