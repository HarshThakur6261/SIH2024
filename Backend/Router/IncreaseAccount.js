const express = require("express");
const UpdateAccountRouter = express.Router();
const { Track } = require("../model/db");

UpdateAccountRouter.put("/", async (req, res) => {
  const { scheme, district } = req.body;
  console.log("Received scheme:", scheme);  // Log the scheme
  console.log("Received district:", district);  // Log the district
  console.log("Request body:", req.body);  // Log the entire request body

  try {
    // Find the scheme by name
    const schemeDoc = await Track.findOne({ schemeName: scheme  , district:district});
    
  

  
if(schemeDoc){
  schemeDoc.totalAccounts = schemeDoc.totalAccounts+1;
  await schemeDoc.save()
  res.status(200).json({
    message: "Account count updated successfully",

  });
}
  
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = UpdateAccountRouter;
