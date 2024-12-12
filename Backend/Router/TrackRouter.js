// routes/regionRoutes.js
const express = require('express');
const {Account} = require("../model/db")
const GetRegionRouter = express.Router();

// API to get all regions
TrackRouter.get('/', async (req, res) => {
  try {
    const regions = await Account.find(); // Find all regions in the database
    res.status(200).json(regions); // Send the regions as an array in the response
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = TrackRouter;
