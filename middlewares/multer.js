const multer = require("multer");
const path = require("path");

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "frontend/public/images");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Filter file hanya untuk gambar
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, and JPG are allowed."));
  }
};

// Konfigurasi Multer dengan batasan ukuran file
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Maksimal ukuran file 5 MB
  },
});

// Middleware untuk menangani error Multer
const uploadMiddleware = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json({ message: "File size exceeds 5 MB limit." });
      }
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

module.exports = uploadMiddleware;
