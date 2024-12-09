const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Otomatis menambahkan `createdAt` dan `updatedAt`
  }
);

const Image = mongoose.model("Image", ImageSchema);

module.exports = Image;
