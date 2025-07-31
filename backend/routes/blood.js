// // routes/blood.js
// const express = require('express');
// const router = express.Router();
// const BloodController = require('../controllers/bloodController');

// router.get('/', BloodController.getAllBloodData);
// router.get('/hospital/:hospitalId', BloodController.getBloodByHospital);
// router.post('/add', BloodController.addBloodUnit);
// router.put('/update/:id', BloodController.updateBloodUnit);
// router.delete('/delete/:id', BloodController.deleteBloodUnit);

// module.exports = router;

const express = require('express');
const router = express.Router();
const Blood = require('../models/Blood');

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

// Search blood
router.get('/search', async (req, res) => {
  const { bloodGroup, location } = req.query;
  try {
    const results = await Blood.find({ bloodGroup, location });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;