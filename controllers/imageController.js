const Image = require("../models/imageModel");
const { exiftool } = require("exiftool-vendored");
const fs = require("fs");

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
      if (req.file && fs.existsSync(image)) {
        fs.unlinkSync(image);
      }
      return res.status(400).json({
        message: "Title and Author are required",
      });
    }

    // Baca metadata menggunakan exiftool
    let metadata = {};
    if (image) {
      const exifData = await exiftool.read(image);
      metadata = {
        iso: exifData.ISO || null,
        shutterSpeed: exifData.ShutterSpeed || null,
        aperture: exifData.FNumber || null,
        cameraModel: exifData.Model || null,
        focalLength: exifData.FocalLength || null,
        dimensi: exifData.ImageWidth + "x" + exifData.ImageHeight || null,
        created: exifData.CreateDate || null,
      };
    }

    // Simpan data ke database
    const newImage = await Image.create({
      title,
      image,
      author,
      metadata,
    });

    res.status(201).json(newImage);
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: error.message });
  }
};

// PUT: Mengupdate gambar berdasarkan ID
const updateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author } = req.body;

    if (!title || !author) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        message: "Title and Author are required for updating",
      });
    }

    const imageToUpdate = await Image.findById(id);
    if (!imageToUpdate) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ message: "Image not found" });
    }

    const updatedFields = { title, author };

    if (req.file) {
      if (fs.existsSync(imageToUpdate.image)) {
        fs.unlinkSync(imageToUpdate.image);
      }

      updatedFields.image = req.file.path;

      // Baca metadata baru
      const exifData = await exiftool.read(req.file.path);
      updatedFields.metadata = {
        iso: exifData.ISO || null,
        shutterSpeed: exifData.ShutterSpeed || null,
        aperture: exifData.FNumber || null,
        cameraModel: exifData.Model || null,
        focalLength: exifData.FocalLength || null,
        dimensi: exifData.ImageWidth + "x" + exifData.ImageHeight || null,
        created: exifData.CreateDate || null,
      };
    }

    const updatedImage = await Image.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    res.status(200).json(updatedImage);
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
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

const deleteAllImages = async (req, res) => {
  try {
    const images = await Image.find();

    if (images.length === 0) {
      return res.status(404).json({ message: "No images found to delete" });
    }

    // Hapus semua file gambar dari server
    images.forEach((image) => {
      if (image.image && fs.existsSync(image.image)) {
        fs.unlinkSync(image.image);
      }
    });

    // Hapus semua data dari database
    await Image.deleteMany();

    res.status(200).json({ message: "All images deleted successfully" });
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
  deleteAllImages,
};
