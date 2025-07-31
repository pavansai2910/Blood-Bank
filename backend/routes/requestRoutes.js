
const express = require('express');
const router = express.Router();
const BloodRequest = require('../models/BloodRequest');

// GET all requests
router.get('/', async (req, res) => {
  try {
    const requests = await BloodRequest.find();
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new request
router.post('/', async (req, res) => {
  const { bloodType, quantity, urgency, location, status } = req.body;
  try {
    const newRequest = new BloodRequest({
      bloodType,
      quantity,
      urgency,
      location,
      status,
    });
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update request status
router.put('/:id', async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    if (req.body.status) request.status = req.body.status;
    await request.save();

    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE request
router.delete('/:id', async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    await request.deleteOne();
    res.json({ message: 'Request deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;