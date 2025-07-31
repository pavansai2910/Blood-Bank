// const mongoose = require('mongoose');

// const bloodInventorySchema = new mongoose.Schema({
//   orgId: {
//     type: String,
//     required: true,
//   },
//   bloodGroup: {
//     type: String,
//     enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
//     required: true
//   },
//   quantity: {
//     type: Number,
//     default: 0
//   },
//   lastUpdated: {
//     type: Date,
//     default: Date.now
//   }
// });

const mongoose = require('mongoose');


const bloodInventorySchema = new mongoose.Schema({
  orgId: {
    type: String,
    required: true,
  },
  bloodGroup: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('BloodInventory', bloodInventorySchema);