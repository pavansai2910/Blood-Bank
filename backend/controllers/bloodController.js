const mongoose = require('mongoose');
const Blood = require('../models/Blood');

// Get all blood records
exports.getAllBloodData = async (req, res) => {
  try {
    const data = await Blood.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a new blood record
exports.addBloodUnit = async (req, res) => {
  try {
    const newEntry = new Blood(req.body);
    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a blood record
exports.updateBloodUnit = async (req, res) => {
  try {
    const updatedEntry = await Blood.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEntry) return res.status(404).json({ error: "Record not found" });
    res.status(200).json(updatedEntry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ❗ FINAL Delete a blood record (merged version with validation)
exports.deleteBloodUnit = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  try {
    const deleted = await Blood.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Record not found" });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get blood records by hospitalId
exports.getBloodByHospital = async (req, res) => {
  try {
    const data = await Blood.find({ hospitalId: req.params.hospitalId });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get blood records by donor or recipient type
exports.getBloodByType = async (req, res) => {
  const { donorOrRecipient } = req.params;
  try {
    const data = await Blood.find({ type: donorOrRecipient });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

