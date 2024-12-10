const Image = require("../models/imageModel");

// GET: Mendapatkan semua data gambar
const getAllImages = async (req, res) => {
  try {
    const images = await Image.find();
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getImageById = async (req, res) => {
  try {
    const { id } = req.params;

    // Cari data berdasarkan ID
    const image = await Image.findById(id);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.status(200).json(image);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST: Menambahkan gambar baru
const createImage = async (req, res) => {
  try {
    const { title, author } = req.body;
    const image = req.file ? req.file.path : null;

    // Validasi input
    if (!title || !author) {
      // Hapus file jika sudah diunggah
      if (req.file) {
        const fs = require("fs");
        if (fs.existsSync(image)) {
          fs.unlinkSync(image);
        }
      }

      return res.status(400).json({
        message: "Title and Author are required",
      });
    }

    // Validasi berhasil, simpan data
    const newImage = await Image.create({
      title,
      image,
      author,
    });

    res.status(201).json(newImage);
  } catch (error) {
    // Hapus file jika error saat menyimpan ke database
    if (req.file) {
      const fs = require("fs");
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }

    res.status(500).json({ message: error.message });
  }
};

// PUT: Mengupdate gambar berdasarkan ID
const updateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author } = req.body;

    // Validasi input
    if (!title || !author) {
      // Hapus file jika sudah diunggah
      if (req.file) {
        const fs = require("fs");
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      }

      return res.status(400).json({
        message: "Title and Author are required for updating",
      });
    }

    // Temukan data berdasarkan ID
    const imageToUpdate = await Image.findById(id);
    if (!imageToUpdate) {
      // Hapus file jika ID tidak ditemukan
      if (req.file) {
        const fs = require("fs");
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      }

      return res.status(404).json({ message: "Image not found" });
    }

    // Update data
    const updatedFields = { title, author };
    if (req.file) {
      // Hapus file lama jika ada file baru
      const fs = require("fs");
      if (fs.existsSync(imageToUpdate.image)) {
        fs.unlinkSync(imageToUpdate.image);
      }

      updatedFields.image = req.file.path;
    }

    const updatedImage = await Image.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    res.status(200).json(updatedImage);
  } catch (error) {
    // Hapus file jika terjadi error
    if (req.file) {
      const fs = require("fs");
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }

    res.status(500).json({ message: error.message });
  }
};

const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;

    // Cari gambar berdasarkan ID
    const imageToDelete = await Image.findById(id);
    if (!imageToDelete) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Hapus file gambar dari server jika ada
    const fs = require("fs");
    if (imageToDelete.image && fs.existsSync(imageToDelete.image)) {
      fs.unlinkSync(imageToDelete.image);
    }

    // Hapus data dari database
    await Image.findByIdAndDelete(id);

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllImages,
  getImageById,
  createImage,
  updateImage,
  deleteImage,
};
