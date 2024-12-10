"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

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

const ImageCard = ({ image }) => (
  <div className="bg-white rounded-xl overflow-hidden shadow-lg">
    <img src={"./images/" + image.src} alt={image.alt} className="w-full" />
  </div>
);

const Gallery = ({ images }) => (
  <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 p-4">
    {images.map((image, index) => (
      <ImageCard key={index} image={image} />
    ))}
  </div>
);

const App = () => {
  const [images, setImages] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newImage, setNewImage] = useState({
    src: "",
    title: "",
    author: "",
  });

  // Fetch images from API
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/image");
        const formattedImages = response.data.map((image) => ({
          ...image,
          src: image.image.split("\\").pop(), // Ambil hanya nama file
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
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewImage((prev) => ({ ...prev, src: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setImages([...images, newImage]);
    setShowUploadForm(false);
    setNewImage({ src: "", title: "", author: "" });
  };

  return (
    <div>
      <Navbar onUploadClick={handleUploadClick} />
      <Gallery images={images} />
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
              {/* Left Section: Image Upload */}
              <div className="flex flex-col items-center w-full md:w-1/2">
                <label className="block text-gray-700 text-lg font-bold mb-2">
                  Image Upload
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
                {newImage.src && (
                  <img
                    src={newImage.src}
                    alt="Preview"
                    className="mt-4 w-full rounded shadow-lg"
                  />
                )}
              </div>

              {/* Right Section: Title and Author */}
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
