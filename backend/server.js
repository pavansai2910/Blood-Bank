// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(express.json());
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // React app
//   res.header('Access-Control-Allow-Credentials', 'true');
//   res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//   next();
// });

// const corsOptions = {
//   origin: 'http://localhost:3000',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// };

// app.use(cors(corsOptions));
// app.options('*', cors(corsOptions)); // Allow preflight across all routes

// // MongoDB
// mongoose.connect(process.env.MONGO_URI).then(() => {
//   console.log('✅ MongoDB connected');
// }).catch(err => {
//   console.error('❌ MongoDB connection error:', err);
// });

// // Routes
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/protected', require('./routes/protected'));
// app.use('/api/match', require('./routes/match'));           // <-- Ensure match.js exists!
// app.use('/api/blood', require('./routes/blood'));           // blood/create, search
// app.use('/api/inventory', require('./routes/inventory'));   // inventory tracking
// app.use('/api/integration', require('./routes/integrationRoutes')); // update/:id, create, etc.

// app.get('/', (req, res) => {
//   res.send('🌐 Healthcare Platform API is working ✅');
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });

//IMPORTANT
// const express = require('express');
// const cors = require('cors');
// const connectDB = require('./config/db');
// require('dotenv').config();
// const app = express();

// connectDB();

// app.use(cors({
//   origin: "http://localhost:3000", // frontend origin
//   credentials: true // allow cookies to be sent
// }));

// // app.use(cors());
// app.use(express.json());

// // Routes
// app.use('/api/blood', require('./routes/bloodRoutes'));
// app.use('/api/organs', require('./routes/organRoutes'));
// app.use('/api/matches', require('./routes/matchRoutes'));
// app.use('/api/notifications', require('./routes/notificationRoutes'));
// app.use('/api/requests', require('./routes/requestRoutes'));
// app.use('/api/integration', require('./routes/integrationRoutes'));
// app.use('/api/bloodinventories', require('./routes/bloodRoutes'));
// app.use("/api/donors", require("./routes/donorRoutes"));
// app.use("/api/recipients", require("./routes/recipientRoutes"));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/organ_donation', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('✅ Connected to MongoDB'))
// .catch((err) => console.error('❌ MongoDB connection error:', err));

// // Middleware
// app.use(cors({ origin: "http://localhost:3000", credentials: true }));
// app.use(express.json());

// // Donor Schema
// const donorSchema = new mongoose.Schema({
//   name: String,
//   age: Number,
//   gender: String,
//   email: String,
//   location: String,
//   phoneno: String,
//   bloodType: String,
//   organ: String,
//   urgencyLevel: String,
//   donorCode: String,
//   medicalHistory: String,
//   organAvailabilityDate: String,
//   hospitalName: String,
//   consentFormSigned: Boolean,
//   preferredRecipientAgeRange: String,
//   lastCheckupDate: String
// });
// const Donor = mongoose.model("Donor", donorSchema);

// // Donor Routes
// app.post('/register-donor', async (req, res) => {
//   const {
//     name, age, gender, email, location, phoneno, bloodType, organ,
//     urgencyLevel, medicalHistory, organAvailabilityDate, hospitalName,
//     consentFormSigned, preferredRecipientAgeRange, lastCheckupDate
//   } = req.body;

//   if (!name || !age || !gender || !email || !location || !phoneno || !bloodType || !organ || !urgencyLevel) {
//     return res.status(400).json({ message: "All required fields must be filled." });
//   }

//   const donorCode = 'DNR-' + Math.random().toString(36).substr(2, 6).toUpperCase();

//   const newDonor = new Donor({
//     donorCode,
//     name,
//     age,
//     gender,
//     email,
//     location,
//     phoneno,
//     bloodType,
//     organ,
//     urgencyLevel,
//     medicalHistory,
//     organAvailabilityDate,
//     hospitalName,
//     consentFormSigned,
//     preferredRecipientAgeRange,
//     lastCheckupDate
//   });

//   try {
//     await newDonor.save();
//     res.status(201).json({ message: "✅ Donor registered successfully", donor: newDonor });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "❌ Error saving donor" });
//   }
// });

// app.get('/donors', async (req, res) => {
//   try {
//     const allDonors = await Donor.find();
//     res.status(200).json(allDonors);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "❌ Error fetching donors" });
//   }
// });

// // API Routes
// app.use('/api/blood', require('./routes/bloodRoutes'));
// app.use('/api/organs', require('./routes/organRoutes'));
// app.use('/api/matches', require('./routes/matchRoutes'));
// app.use('/api/notifications', require('./routes/notificationRoutes'));
// app.use('/api/requests', require('./routes/requestRoutes'));
// app.use('/api/integration', require('./routes/integrationRoutes'));
// app.use('/api/bloodinventories', require('./routes/bloodRoutes')); // Consider deduplication
// app.use('/api/donors', require('./routes/donorRoutes'));
// app.use('/api/recipients', require('./routes/recipientRoutes'));

// // Default route
// app.get('/', (req, res) => {
//   res.send("🩺 Organ Donation Backend is running!");
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
// });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGO_URI || "mongodb://localhost:27017/organ_donation",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// API Routes
app.use("/api/auth", require("./routes/auth")); // Add auth routes
app.use("/api/blood", require("./routes/bloodRoutes"));
app.use("/api/organs", require("./routes/organRoutes"));
app.use("/api/matches", require("./routes/matchRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/requests", require("./routes/requestRoutes"));
app.use("/api/integration", require("./routes/integrationRoutes"));
app.use("/api/bloodinventories", require("./routes/bloodRoutes")); // If duplicate, remove one
app.use("/api/inventory", require("./routes/inventory")); // Add inventory routes
app.use("/api/donors", require("./routes/donorRoutes")); // Add this line
app.use("/api/recipients", require("./routes/recipientRoutes"));

// Default route
app.get("/", (req, res) => {
  res.send("🩺 Organ Donation Backend is running!");
});

// Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const cookieParser = require('cookie-parser');
// require('dotenv').config();

// const authRoutes = require('./routes/auth');
// const app = express();

// // Middlewares
// app.use(express.json());
// app.use(cookieParser());

// // CORS config to allow frontend requests with credentials
// app.use(cors({
//   origin: 'http://localhost:3000', // your frontend origin
//   credentials: true
// }));

// // Routes
// app.use('/api/auth', authRoutes);

// // MongoDB connection
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(() => console.log('✅ MongoDB Connected'))
//   .catch(err => console.error('❌ MongoDB Error:', err));

// // Server listen
// const PORT = process.env.PORT || 5050;
// app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

// const express = require('express');
// const mongoose = require('mongoose');
// const app = express();
// const bloodRoutes = require('./routes/bloodRoutes');

// // Middleware to parse JSON
// app.use(express.json());

// // Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/my-app', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('✅ MongoDB connected'))
// .catch((err) => console.error('❌ MongoDB connection error:', err));

// // Use blood inventory routes
// app.use('/api/bloodinventories', bloodRoutes);

// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });
