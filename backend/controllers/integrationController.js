// const IntegrationSystem = require('../models/IntegrationSystems');

// // Get all systems
// exports.getSystems = async (req, res) => {
//   try {
//     const systems = await IntegrationSystem.find();
//     res.json(systems);
//   } catch (err) {
//     res.status(500).json({ error: 'Error fetching systems' });
//   }
// };

// // Sync system manually
// exports.syncSystem = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const system = await IntegrationSystem.findById(id);
//     if (!system) return res.status(404).json({ error: 'System not found' });

//     system.status = 'Synced';
//     system.color = '#28A745';
//     system.lastSync = new Date().toLocaleString();
//     system.logs.unshift(`Success: Synced with ${system.name} at ${system.lastSync}`);

//     await system.save();
//     res.json({ message: 'System synced successfully', system });
//   } catch (err) {
//     res.status(500).json({ error: 'Error syncing system' });
//   }
// };

// // Retry system
// exports.retrySystem = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const system = await IntegrationSystem.findById(id);
//     if (!system) return res.status(404).json({ error: 'System not found' });

//     system.status = 'Synced';
//     system.color = '#28A745';
//     system.lastSync = new Date().toLocaleString();
//     system.logs.unshift(`Success: Retry resolved for ${system.name} at ${system.lastSync}`);

//     await system.save();
//     res.json({ message: 'System retry successful', system });
//   } catch (err) {
//     res.status(500).json({ error: 'Retry failed' });
//   }
// };

// // Export logs
// exports.getLogs = async (req, res) => {
//   try {
//     const systems = await IntegrationSystem.find();
//     const allLogs = systems.map(sys => `${sys.name}:\n${sys.logs.join('\n')}\n\n`).join('');

//     res.set('Content-Type', 'text/plain');
//     res.send(allLogs);
//   } catch (err) {
//     res.status(500).json({ error: 'Error fetching logs' });
//   }
// };


// integrationController.js
// const IntegrationSystem = require('../models/IntegrationSystems');

// // Get all systems
// exports.getSystems = async (req, res) => {
//   try {
//     const systems = await IntegrationSystem.find();
//     res.json(systems);
//   } catch (err) {
//     res.status(500).json({ error: 'Error fetching systems' });
//   }
// };

// // Create a new system
// exports.createSystem = async (req, res) => {
//   try {
//     const system = new IntegrationSystem(req.body);
//     await system.save();
//     res.status(201).json(system);
//   } catch (err) {
//     res.status(500).json({ error: 'Error creating system' });
//   }
// };

// // Sync system manually
// exports.syncSystem = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const system = await IntegrationSystem.findById(id);
//     if (!system) return res.status(404).json({ error: 'System not found' });

//     system.status = 'Synced';
//     system.color = '#28A745';
//     system.lastSync = new Date().toLocaleString();
//     system.logs.unshift(`Success: Synced with ${system.name} at ${system.lastSync}`);

//     await system.save();
//     res.json({ message: 'System synced successfully', system });
//   } catch (err) {
//     res.status(500).json({ error: 'Error syncing system' });
//   }
// };

// // Retry system
// exports.retrySystem = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const system = await IntegrationSystem.findById(id);
//     if (!system) return res.status(404).json({ error: 'System not found' });

//     system.status = 'Synced';
//     system.color = '#28A745';
//     system.lastSync = new Date().toLocaleString();
//     system.logs.unshift(`Success: Retry resolved for ${system.name} at ${system.lastSync}`);

//     await system.save();
//     res.json({ message: 'System retry successful', system });
//   } catch (err) {
//     res.status(500).json({ error: 'Retry failed' });
//   }
// };

// // Export logs
// exports.getLogs = async (req, res) => {
//   try {
//     const systems = await IntegrationSystem.find();
//     const allLogs = systems.map(sys => `${sys.name}:
// ${sys.logs.join('\n')}
// \n`).join('');

//     res.set('Content-Type', 'text/plain');
//     res.send(allLogs);
//   } catch (err) {
//     res.status(500).json({ error: 'Error fetching logs' });
//   }
// };

// const BloodInventory = require('../models/BloodInventory');

// const getBloodInventoryBySystem = async (req, res) => {
//   try {
//     const { systemId } = req.params;
//     const inventory = await BloodInventory.find({ systemId });

//     res.json(inventory);
//   } catch (error) {
//     console.error('Error fetching blood inventory:', error);
//     res.status(500).json({ error: 'Server error fetching blood inventory' });
//   }
// };

// module.exports = {
//   getBloodInventoryBySystem,
//   // other exports...
// };



const IntegrationSystem = require('../models/IntegrationSystems');
const log = require('../utils/logger');

// Get all systems
exports.getSystems = async (req, res) => {
  try {
    const systems = await IntegrationSystem.find();
    res.json(systems);
  } catch (err) {
    log(`ERROR: Fetching systems failed - ${err.message}`);
    res.status(500).json({ error: 'Error fetching systems' });
  }
};

// Create a new system
exports.createSystem = async (req, res) => {
  try {
    const system = new IntegrationSystem(req.body);
    await system.save();
    log(`System created: ${system.name}`);
    res.status(201).json(system);
  } catch (err) {
    log(`ERROR: Creating system failed - ${err.message}`);
    res.status(500).json({ error: 'Error creating system' });
  }
};

// Sync system manually
exports.syncSystem = async (req, res) => {
  try {
    const { id } = req.params;
    const system = await IntegrationSystem.findById(id);
    if (!system) return res.status(404).json({ error: 'System not found' });

    const time = new Date().toLocaleString();
    system.status = 'Synced';
    system.color = '#28A745';
    system.lastSync = time;
    system.logs.unshift(`Success: Synced with ${system.name} at ${time}`);

    await system.save();
    log(`System synced: ${system.name}`);
    res.json({ message: 'System synced successfully', system });
  } catch (err) {
    log(`ERROR: Syncing failed - ${err.message}`);
    res.status(500).json({ error: 'Error syncing system' });
  }
};

// Retry system
exports.retrySystem = async (req, res) => {
  try {
    const { id } = req.params;
    const system = await IntegrationSystem.findById(id);
    if (!system) return res.status(404).json({ error: 'System not found' });

    const time = new Date().toLocaleString();
    system.status = 'Synced';
    system.color = '#28A745';
    system.lastSync = time;
    system.logs.unshift(`Success: Retry resolved for ${system.name} at ${time}`);

    await system.save();
    log(`System retry success: ${system.name}`);
    res.json({ message: 'System retry successful', system });
  } catch (err) {
    log(`ERROR: Retry failed - ${err.message}`);
    res.status(500).json({ error: 'Retry failed' });
  }
};

// Export logs
exports.getLogs = async (req, res) => {
  try {
    const systems = await IntegrationSystem.find();
    const allLogs = systems.map(sys => `${sys.name}:\n${sys.logs.join('\n')}\n`).join('\n');

    res.type('text').send(allLogs); // safer way to set plain text response
  } catch (err) {
    log(`ERROR: Fetching logs failed - ${err.message}`);
    res.status(500).json({ error: 'Error fetching logs' });
  }
};