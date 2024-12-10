const express = require("express");
const router = express.Router();
const imageRoutes = require("./imageRoutes");

router.use("/image", imageRoutes);
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
