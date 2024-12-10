const express = require("express");
const router = express.Router();
const {
  getAllImages,
  createImage,
  updateImage,
  deleteImage,
  getImageById,
  deleteAllImages,
} = require("../controllers/imageController");
const upload = require("../middlewares/multer");

// GET: Mendapatkan semua gambar
router.get("/", getAllImages);

// GET: Mendapatkan gambar berdasarkan id
router.get("/:id", getImageById);

// POST: Menambahkan gambar baru
router.post("/", upload.single("image"), createImage);

// PUT: Mengupdate gambar berdasarkan ID
router.put("/:id", upload.single("image"), updateImage);

// DELETE: Menghapus gambar berdasarkan ID
router.delete("/:id", deleteImage);

// DELETE: Menghapus semua gambar
router.delete("/", deleteAllImages);

module.exports = router;
