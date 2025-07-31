// seed.js
const mongoose = require("mongoose");
require("dotenv").config();

// Connect to MongoDB
mongoose.connect(
  process.env.MONGO_URI || "mongodb://localhost:27017/organ_donation",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Import models
const Donor = require("./models/Donor");
const Recipient = require("./models/Recipient");
const Notification = require("./models/Notification");
const Request = require("./models/Request");
const BloodInventory = require("./models/BloodInventory");

async function seedDatabase() {
  try {
    // Clear existing data
    await Donor.deleteMany({});
    await Recipient.deleteMany({});
    await Notification.deleteMany({});
    await Request.deleteMany({});
    await BloodInventory.deleteMany({});

    console.log("✅ Database cleared successfully!");
    console.log("📊 Database is ready for dynamic data entry");
    console.log(
      "💡 Use the admin dashboard to add donors, recipients, and other data"
    );

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error clearing database:", error);
    mongoose.connection.close();
  }
}

seedDatabase();
