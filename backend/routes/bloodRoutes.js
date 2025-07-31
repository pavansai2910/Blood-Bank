const express = require('express');
const router = express.Router();
const Blood = require('../models/Blood');
const {
  getAllBloodData,
  addBloodUnit,
  updateBloodUnit,
  deleteBloodUnit,
  getBloodByHospital,
  getBloodByType
} = require('../controllers/bloodController');

// ------------------------------
// Inline Routes (Simple Handlers)
// ------------------------------

// Create a blood entry
router.post('/create', async (req, res) => {
  try {
    const newBlood = new Blood(req.body);
    await newBlood.save();
    res.status(201).json({ message: 'Blood data added', data: newBlood });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search for blood by group and location
router.get('/search', async (req, res) => {
  const { bloodGroup, location } = req.query;
  try {
    const results = await Blood.find({ bloodGroup, location });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------------------
// Controller-Based Routes
// ------------------------------

// Get all blood data
router.get('/', getAllBloodData);

// Get blood by hospital ID
router.get('/hospital/:hospitalId', getBloodByHospital);

// Get blood by donor or recipient type (optional)
router.get('/type/:donorOrRecipient', getBloodByType);

// Add a blood unit (via controller)
router.post('/', addBloodUnit);

// Update a blood unit by ID
router.put('/:id', updateBloodUnit);

// Delete a blood unit by ID
router.delete('/:id', deleteBloodUnit);

module.exports = router;
