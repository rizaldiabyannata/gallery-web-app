"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Component } from "./components/fileInput";

const Navbar = ({ onUploadClick }) => (
  <nav className="bg-gray-800 p-4 px-12 flex justify-between items-center rounded-b-2xl">
    <div className="text-white text-3xl font-bold font-['Poppins']">
      Gallery
    </div>
    <button onClick={onUploadClick} className="text-white px-4 py-2 rounded">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={44}
        height={44}
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M4 3h10v2H4v14h16v-8h2v10H2V3zm10 6h-2v2h-2v2H8v2H6v2h2v-2h2v-2h2v-2h2v2h2v2h2v-2h-2v-2h-2zM8 7H6v2h2zm10-4h2v2h2v2h-2v2h-2V7h-2V5h2z"
        ></path>
      </svg>
    </button>
  </nav>
);

const ImageCard = ({ image, onImageClick }) => (
  <div
    className="rounded-xl overflow-hidden shadow-lg cursor-pointer"
    onClick={() => onImageClick(image)}
  >
    <img src={"/images/" + image.image} alt={image.image} className="w-full" />
  </div>
);

const DetailImage = ({ image, onClose }) => (
  <div className="fixed inset-0 z-10 bg-black bg-opacity-75 flex justify-center items-center">
    <div className="bg-white rounded-xl shadow-lg p-6 w-11/12 md:w-3/4 lg:w-1/2">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <img
            src={"/images/" + image.image}
            alt={image.image}
            className="w-full rounded-xl"
          />
        </div>
        <div className="flex-1 text-black font-['Poppins']">
          <h2 className="text-xl font-bold mb-4">{image.title}</h2>
          <p className="text-black font-semibold">Author: {image.author}</p>
          <p className="text-black font-semibold">Dimensions: {image.metadata?.dimensi || "N/A"}</p>
          <h3 className="text-lg mt-4 font-bold">Metadata</h3>
          <p className="text-black font-semibold">Shutter Speed: {image.metadata?.shutterSpeed || "N/A"}</p>
          <p className="text-black font-semibold">ISO: {image.metadata?.ISO || "N/A"}</p>
          <p className="text-black font-semibold">Aperture: {image.metadata?.aperture || "N/A"}</p>
          <p className="text-black font-semibold">Camera Model: {image.metadata?.cameraModel || "N/A"}</p>
          <p className="text-black font-semibold">Focal Length: {image.metadata?.focalLength || "N/A"}</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
);

const Gallery = ({ images, onImageClick }) => (
  <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 p-4">
    {images.map((image, index) => (
      <ImageCard
        key={index}
        image={image}
        onImageClick={onImageClick}
      />
    ))}
  </div>
);

const App = () => {
  const [images, setImages] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [detailImage, setDetailImage] = useState(null);
  const [newImage, setNewImage] = useState({
    src: "",
    title: "",
    author: "",
  });

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/image");
        const formattedImages = response.data.map((image) => ({
          ...image,
          image: image.image.split("\\").pop(), // Ambil hanya nama file
        }));
        setImages(formattedImages);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  const handleUploadClick = () => {
    setShowUploadForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewImage({ ...newImage, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e;

    if (file) {
      setNewImage((prev) => ({ ...prev, src: file }));
    }
  };

  const handleImageClick = (image) => {
    setDetailImage(image);
  };

  const handleDetailClose = () => {
    setDetailImage(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", newImage.src);
    formData.append("title", newImage.title);
    formData.append("author", newImage.author);

    try {
      const response = await axios.post("http://localhost:5000/api/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setImages([...images, response.data]);
      setNewImage({ src: "", title: "", author: "" });
      setShowUploadForm(false);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    }
  };

  return (
    <div>
      <Navbar onUploadClick={handleUploadClick} />
      <Gallery
        images={images}
        onImageClick={handleImageClick}
      />
      {detailImage && (
        <DetailImage image={detailImage} onClose={handleDetailClose} />
      )}
      {showUploadForm && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white w-11/12 md:w-2/3 lg:w-1/2 p-8 rounded shadow-lg">
            <h2 className="text-2xl font-semibold text-slate-500 font-['Poppins'] mb-6">
              Upload Image
            </h2>
            <form
              onSubmit={handleFormSubmit}
              className="flex flex-col md:flex-row gap-4"
            >
              <div className="flex flex-col items-center w-full md:w-1/2">
                <label className="block text-gray-700 text-lg font-bold mb-2">
                  Image Upload
                </label>
                <Component onFileChange={handleImageUpload} />
              </div>
              <div className="flex flex-col w-full md:w-1/2">
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-lg font-bold mb-2"
                    htmlFor="title"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newImage.title}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-lg font-bold mb-2"
                    htmlFor="author"
                  >
                    Author
                  </label>
                  <input
                    type="text"
                    id="author"
                    name="author"
                    value={newImage.author}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUploadForm(false)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;