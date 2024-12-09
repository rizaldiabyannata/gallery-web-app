const express = require("express");
const cors = require("cors");
const multer = require("multer");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const router = require("./routes/index");

// Konfigurasi dotenv
dotenv.config();

// Koneksi ke database
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    headers: ["Content-Type", "Authorization"],
    maxAge: 3600, // 1 hour
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Konfigurasi multer untuk upload file
const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("file"), (req, res) => {
  res
    .status(200)
    .json({ message: "File uploaded successfully", file: req.file });
});

// Rute contoh
app.use("/api", router);

// Jalankan server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
