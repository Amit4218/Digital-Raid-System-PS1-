import React, { useState, useCallback } from "react";
import {
  FaMapMarkerAlt,
  FaAlignLeft,
  FaCloudUploadAlt,
  FaVideo,
  FaImage,
  FaTimes,
  FaCar,
  FaCheck,
  FaSpinner,
} from "react-icons/fa";
import Navbar from "./Navbar";
import UploadImg from "../utils/Uploadimage";
import videoUpload from "../utils/UploadVideo";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const PublicGrievanceSignUp = () => {
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [complaintType, setComplaintType] = useState("drug");
  const [transportMode, setTransportMode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [uploadingFiles, setUploadingFiles] = useState({
    images: 0,
    videos: 0,
  });
  const navigate = useNavigate();

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      setUploadingFiles((prev) => ({
        ...prev,
        images: prev.images + files.length,
      }));
      const uploadPromises = files.map((file) => UploadImg(file));
      const uploadedUrls = await Promise.all(uploadPromises);

      const newImages = uploadedUrls.map((url) => ({ url }));
      setImages([...images, ...newImages]);
      toast.success(`${files.length} image(s) uploaded successfully`);
    } catch (err) {
      toast.error(`Failed to upload images: ${err.message}`);
    } finally {
      setUploadingFiles((prev) => ({
        ...prev,
        images: prev.images - files.length,
      }));
    }
  };

  const handleVideoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      setUploadingFiles((prev) => ({
        ...prev,
        videos: prev.videos + files.length,
      }));
      const uploadPromises = files.map((file) => videoUpload(file));
      const uploadedUrls = await Promise.all(uploadPromises);

      const newVideos = uploadedUrls.map((url) => ({ url }));
      setVideos([...videos, ...newVideos]);
      toast.success(`${files.length} video(s) uploaded successfully`);
    } catch (err) {
      toast.error(`Failed to upload videos: ${err.message}`);
    } finally {
      setUploadingFiles((prev) => ({
        ...prev,
        videos: prev.videos - files.length,
      }));
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
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
    async (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const files = Array.from(e.dataTransfer.files);
        const imageFiles = files.filter((file) =>
          file.type.startsWith("image/")
        );

        if (imageFiles.length === 0) return;

        try {
          setUploadingFiles((prev) => ({
            ...prev,
            images: prev.images + imageFiles.length,
          }));
          const uploadPromises = imageFiles.map((file) => UploadImg(file));
          const uploadedUrls = await Promise.all(uploadPromises);

          const newImages = uploadedUrls.map((url) => ({ url }));
          setImages([...images, ...newImages]);
          toast.success(`${imageFiles.length} image(s) uploaded successfully`);
        } catch (err) {
          toast.error(`Failed to upload images: ${err.message}`);
        } finally {
          setUploadingFiles((prev) => ({
            ...prev,
            images: prev.images - imageFiles.length,
          }));
        }
      }
    },
    [images]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any uploads are still in progress
    if (uploadingFiles.images > 0 || uploadingFiles.videos > 0) {
      toast.warning("Please wait for all files to finish uploading");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/public/complain`,
        {
          complaintType,
          transportMode: complaintType === "drug" ? transportMode : null,
          address,
          description,
          images: images.map((img) => img.url),
          videos: videos.map((vid) => vid.url),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        setSubmitSuccess(true);
        // Reset form
        setAddress("");
        setDescription("");
        setImages([]);
        setVideos([]);
        setTransportMode("");
        toast.success("Complaint submitted successfully!");
        navigate("/");
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        "An error occurred while submitting the form";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
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

          {submitSuccess && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              <div className="flex items-center">
                <FaCheck className="mr-2" />
                <span>Your complaint has been submitted successfully!</span>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="bg-white shadow-green-600 shadow-md rounded-lg overflow-hidden">
            <form onSubmit={handleSubmit} className="p-6 sm:p-8">
              {/* Complaint Type Toggle */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Complaint Type
                </label>
                <div className="flex rounded-md shadow-sm">
                  <button
                    type="button"
                    className={`flex-1 py-2 px-4 border border-r-0 rounded-l-md focus:outline-none focus:ring-1 focus:ring-lime-500 ${
                      complaintType === "drug"
                        ? "bg-lime-600 text-white border-lime-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => setComplaintType("drug")}
                  >
                    Illegal Drug Transport
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-2 px-4 border rounded-r-md focus:outline-none focus:ring-1 focus:ring-lime-500 ${
                      complaintType === "liquor"
                        ? "bg-lime-600 text-white border-lime-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => setComplaintType("liquor")}
                  >
                    Illegal Liquor Selling
                  </button>
                </div>
              </div>

              {/* Mode of Transport (only shown for drug transport) */}
              {complaintType === "drug" && (
                <div className="mb-6">
                  <label
                    htmlFor="transportMode"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    <FaCar className="inline mr-2 text-lime-700" />
                    Mode of Transport
                  </label>
                  <select
                    id="transportMode"
                    value={transportMode}
                    onChange={(e) => setTransportMode(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition"
                    required
                  >
                    <option value="">Select transport mode</option>
                    <option value="car">Car</option>
                    <option value="truck">Truck</option>
                    <option value="motorcycle">Motorcycle</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              )}

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
                  placeholder="Describe the issue in detail... (Example: Car model or number plate, description of people... or what type of drug is being transported. )"
                  required
                />
              </div>

              {/* Image Upload Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaImage className="inline mr-2 text-lime-700" />
                  Upload Images (Optional)
                  {uploadingFiles.images > 0 && (
                    <span className="ml-2 text-sm text-gray-500">
                      <FaSpinner className="inline animate-spin mr-1" />
                      Uploading {uploadingFiles.images} image(s)...
                    </span>
                  )}
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
                            src={image.url}
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
                  {uploadingFiles.videos > 0 && (
                    <span className="ml-2 text-sm text-gray-500">
                      <FaSpinner className="inline animate-spin mr-1" />
                      Uploading {uploadingFiles.videos} video(s)...
                    </span>
                  )}
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
                            {video.url.split("/").pop()}
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
                  disabled={
                    isSubmitting ||
                    uploadingFiles.images > 0 ||
                    uploadingFiles.videos > 0
                  }
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-lime-700 hover:bg-lime-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      SUBMITTING...
                    </>
                  ) : (
                    "SUBMIT GRIEVANCE"
                  )}
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
