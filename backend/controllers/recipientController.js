const Recipient = require("../models/recipientModel");

const registerRecipient = async (req, res) => {
  try {
    const recipient = new Recipient(req.body);
    await recipient.save();

    // Change status code to 201 (Created) for successful resource creation
    res.status(201).json({ message: "Recipient registered successfully" });
  } catch (error) {
    console.error("Recipient registration error:", error);
    res.status(500).json({ message: "Recipient registration failed", error });
  }
};

const getAllRecipients = async (req, res) => {
  try {
    const recipients = await Recipient.find({});
    res.status(200).json(recipients);
  } catch (error) {
    console.error("Error fetching recipients:", error);
    res.status(500).json({ message: "Error fetching recipients", error });
  }
};

module.exports = { registerRecipient, getAllRecipients };
