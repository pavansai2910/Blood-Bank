const express = require("express");
const router = express.Router();
const {
  registerRecipient,
  getAllRecipients,
} = require("../controllers/recipientController");

router.get("/", getAllRecipients);
router.post("/", registerRecipient);

module.exports = router;
