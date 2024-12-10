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
    likes: {
      type: Number,
      default: 0,
    },
    metadata: {
      iso: {
        type: Number,
        require: true,
      },
      shutterSpeed: {
        type: String,
        require: true,
      },
      aperture: {
        type: String,
        require: true,
      },
      cameraModel: {
        type: String,
        default: null,
      },
      focalLength: {
        type: String,
        default: null,
      },
      dimensi: {
        type: String,
        require: true,
      },
      created: {
        type: Date,
        default: null,
      },
    },
  },
  {
    timestamps: true, // Otomatis menambahkan `createdAt` dan `updatedAt`
  }
);

const Image = mongoose.model("Image", ImageSchema);

module.exports = Image;
