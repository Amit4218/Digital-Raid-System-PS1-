import React, { useState, useCallback } from "react";
import {
  FaMapMarkerAlt,
  FaAlignLeft,
  FaCloudUploadAlt,
  FaVideo,
  FaImage,
  FaTimes,
} from "react-icons/fa";
import Navbar from "./Navbar";

const PublicGrievanceSignUp = () => {
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages([...images, ...newImages]);
  };

  const handleVideoUpload = (e) => {
    const files = Array.from(e.target.files);
    setVideos([...videos, ...files]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const removeVideo = (index) => {
    const newVideos = [...videos];
    newVideos.splice(index, 1);
    setVideos(newVideos);
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const files = Array.from(e.dataTransfer.files);
        const imageFiles = files.filter((file) =>
          file.type.startsWith("image/")
        );
        const newImages = imageFiles.map((file) => ({
          file,
          preview: URL.createObjectURL(file),
        }));
        setImages([...images, ...newImages]);
      }
    },
    [images]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log({ address, description, images, videos });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-green-700">
              Public Grievance Submission
            </h2>
            <p className="mt-2 text-lg text-lime-500">
              Help us improve by reporting issues in your area
            </p>
          </div>

          <div className="bg-white shadow-green-600 shadow-md rounded-lg overflow-hidden">
            <form onSubmit={handleSubmit} className="p-6 sm:p-8">
              {/* Address Field */}
              <div className="mb-6">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <FaMapMarkerAlt className="inline mr-2 text-lime-700" />
                  Address 
                </label>
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition"
                  placeholder="Enter the exact location of the issue"
                  required
                />
              </div>

              {/* Description Field */}
              <div className="mb-6">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  <FaAlignLeft className="inline mr-2 text-lime-700" />
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition"
                  placeholder="Describe the issue in detail..."
                  required
                />
              </div>

              {/* Image Upload Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaImage className="inline mr-2 text-lime-700" />
                  Upload Images (Optional)
                </label>

                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragActive
                      ? "border-lime-500 bg-lime-50"
                      : "border-gray-300 hover:border-lime-400"
                  }`}
                >
                  <FaCloudUploadAlt className="mx-auto h-12 w-12 text-lime-600" />
                  <p className="mt-2 text-sm text-gray-600">
                    Drag & drop images here, or click to select
                  </p>
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="image-upload"
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-lime-700 hover:bg-lime-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 cursor-pointer transition"
                  >
                    Select Images
                  </label>
                </div>

                {/* Preview Uploaded Images */}
                {images.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Selected Images:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image.preview}
                            alt={`Preview ${index}`}
                            className="h-24 w-24 object-cover rounded border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                          >
                            <FaTimes className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Video Upload Section */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaVideo className="inline mr-2 text-lime-700" />
                  Upload Videos (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-lime-400 transition-colors">
                  <FaCloudUploadAlt className="mx-auto h-12 w-12 text-lime-600" />
                  <p className="mt-2 text-sm text-gray-600">
                    Select video files to upload
                  </p>
                  <input
                    type="file"
                    id="video-upload"
                    accept="video/*"
                    multiple
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="video-upload"
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-lime-700 hover:bg-lime-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 cursor-pointer transition"
                  >
                    Select Videos
                  </label>
                </div>

                {/* Preview Uploaded Videos */}
                {videos.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Selected Videos:
                    </h4>
                    <div className="space-y-2">
                      {videos.map((video, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 p-2 rounded"
                        >
                          <span className="text-sm text-gray-600 truncate">
                            {video.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeVideo(index)}
                            className="text-red-500 hover:text-red-700 transition"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-lime-700 hover:bg-lime-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 transition-colors"
                >
                  SUBMIT GRIEVANCE
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default PublicGrievanceSignUp;
