const express = require("express");
const router = express.Router();

// Rute GET
router.get("/", (req, res) => {
  res.json({ message: "Welcome to the Example API" });
});

// Rute POST
router.post("/", (req, res) => {
  const { name } = req.body;
  res.json({ message: `Hello, ${name}!` });
});

module.exports = router;