const express = require('express');
const router = express.Router();
const Hospital = require('../models/hospital');

router.post('/register', async (req, res) => {
  const { name, location, contact } = req.body;

  try {
    const hospital = new Hospital({ name, location, contact });
    await hospital.save();
    res.status(201).json({ message: 'Hospital registered', hospital });
  } catch (err) {
    res.status(400).json({ error: 'Error registering hospital', details: err });
  }
});

module.exports = router;