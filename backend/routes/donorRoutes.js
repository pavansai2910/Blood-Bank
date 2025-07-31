const express = require("express");
const router = express.Router();
const { registerDonor } = require("../controllers/donorController");

router.post("/", registerDonor);
router.get("/", async (req, res) => {
  try {
    const Donor = require("../models/donorModel");
    const donors = await Donor.find();
    res.status(200).json(donors);
  } catch (error) {
    console.error("Error fetching donors:", error);
    res.status(500).json({ message: "Error fetching donors", error });
  }
});

module.exports = router;
