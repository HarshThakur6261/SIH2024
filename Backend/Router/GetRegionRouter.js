// routes/regionRoutes.js
const express = require('express');
const {RegionModel} = require("../model/db")
const GetRegionRouter = express.Router();

// API to get all regions
GetRegionRouter.get('/', async (req, res) => {
  try {
    const regions = await RegionModel.find(); // Find all regions in the database
    res.status(200).json(regions); // Send the regions as an array in the response
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = GetRegionRouter;
