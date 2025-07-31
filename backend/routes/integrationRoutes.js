// const express = require('express');

// const router = express.Router();
// const controller = require('../controllers/integrationController');
// const { getBloodInventoryBySystem } = require('../controllers/integrationController')

// router.get('/', controller.getSystems);
// router.post('/sync/:id', controller.syncSystem);
// router.post('/retry/:id', controller.retrySystem);
// router.get('/logs', controller.getLogs);
// router.post('/create', controller.createSystem);
// router.get('/:systemId/blood-inventory', getBloodInventoryBySystem);


// module.exports = router;


const express = require('express');
const router = express.Router();
const controller = require('../controllers/integrationController');

router.get('/', controller.getSystems);
router.post('/create', controller.createSystem);
router.post('/sync/:id', controller.syncSystem);
router.post('/retry/:id', controller.retrySystem);
router.get('/logs', controller.getLogs);



module.exports = router;


// const express = require('express');
// const router = express.Router();
// const BloodInventory = require('../models/BloodInventory');

// // Get all blood inventories for a specific hospital
// router.get('/hospital/:orgId', async (req, res) => {
//   try {
//     const data = await BloodInventory.find({ orgId: req.params.orgId });
//     res.json(data);
//   } catch (err) {
//     res.status(500).json({ message: 'Error fetching inventory', error: err.message });
//   }
// });

// module.exports = router;
