const express = require('express');
const TrackRouter = express.Router();
const {Track} = require('../model/db');

// Endpoint to add a tracked scheme
TrackRouter.post('/', async (req, res) => {
  const { schemeName, district, target } = req.body;

  if (!schemeName || !district || !target) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Create a new track entry
    const newTrack = new Track({
      schemeName,
      district,
      target,
      totalAccounts: 0, // Initialize total accounts to 0
      
    });

    // Save the track entry to the database
    await newTrack.save();

    return res.status(201).json({ message: 'Tracking entry created successfully', track: newTrack });
  } catch (error) {
    console.error('Error adding track entry:', error);
    return res.status(500).json({ message: 'Error adding track entry' });
  }
});




// Get all tracked schemes
TrackRouter.get("/track", async (req, res) => {
  try {
    // Fetch all tracked schemes from the Track collection
    const trackedSchemes = await Track.find();
    
    // Check if there are no tracked schemes
    if (trackedSchemes.length === 0) {
      return res.status(404).json({ message: "No tracked schemes found" });
    }

    // Send the list of tracked schemes as the response
    res.json(trackedSchemes);
  } catch (error) {
    console.error("Error fetching tracked schemes:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Endpoint to add a tracked scheme
TrackRouter.post('/', async (req, res) => {
  const { schemeName, district, target } = req.body;

  if (!schemeName || !district || !target) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Create a new track entry
    const newTrack = new Track({
      schemeName,
      district,
      target,
      totalAccounts: 0, // Initialize total accounts to 0
    });

    // Save the track entry to the database
    await newTrack.save();

    return res.status(201).json({ message: 'Tracking entry created successfully', track: newTrack });
  } catch (error) {
    console.error('Error adding track entry:', error);
    return res.status(500).json({ message: 'Error adding track entry' });
  }
});

// Get all tracked schemes
TrackRouter.get("/track", async (req, res) => {
  try {
    // Fetch all tracked schemes from the Track collection
    const trackedSchemes = await Track.find();
    
    // Check if there are no tracked schemes
    if (trackedSchemes.length === 0) {
      return res.status(404).json({ message: "No tracked schemes found" });
    }

    // Send the list of tracked schemes as the response
    res.json(trackedSchemes);
  } catch (error) {
    console.error("Error fetching tracked schemes:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// API to update the total account for a particular scheme and location
TrackRouter.put('/updateTotalAccount', async (req, res) => {
  const { schemeName, district } = req.body;

  if (!schemeName || !district ) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Find the tracked scheme for the specified scheme name and district
    const trackedScheme = await Track.findOne({ schemeName, district });

    // If the tracked scheme does not exist, return an error
    if (!trackedScheme) {
      return res.status(404).json({ message: 'Tracked scheme not found for this district' });
    }

    // Check if the totalAccounts has reached or exceeded the target
    if (trackedScheme.totalAccounts >= target) {
      return res.status(400).json({ message: 'Target reached, no more accounts can be added' });
    }

    // Increment the total accounts
    trackedScheme.totalAccounts += 1;

    // Save the updated scheme entry
    await trackedScheme.save();

    return res.status(200).json({
      message: 'Total accounts updated successfully',
      totalAccounts: trackedScheme.totalAccounts,
    });
  } catch (error) {
    console.error('Error updating total accounts:', error);
    return res.status(500).json({ message: 'Error updating total accounts' });
  }
});






module.exports = TrackRouter;
