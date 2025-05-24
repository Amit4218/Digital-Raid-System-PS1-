import React, { useState, useRef } from "react";
import extractGPSData from "../utils/lat-long-image-parser";
import UploadImg from "../utils/Uploadimage";
import addWatermark from "../utils/AddWaterMarkToImage";
import { toast } from "react-toastify";
import axios from "axios";

function UploadImage() {
  const [imagePreviewLink, setimagePreviewLink] = useState(null);
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);
  const [gpsData, setGpsData] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [exhibitType, setexhibitType] = useState("");
  const [description, setDescription] = useState("");
  const raidId = localStorage.getItem("raidId");
  const userId = localStorage.getItem("userId");

  const fileChangeHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setimagePreviewLink(null);

    try {
      // Extract GPS data
      const data = await extractGPSData(file);
      setGpsData(data);

      if (!data) {
        toast.warning("No GPS data found in image");
        return;
      }

      // Add watermark and upload
      const watermarkedImage = await addWatermark(file);
      const imageUrl = await UploadImg(watermarkedImage);

      setimagePreviewLink(imageUrl);
      setUploadedImages((prev) => [
        ...prev,
        {
          url: imageUrl,
          gpsData: data,
          timestamp: new Date().toISOString(),
          name: file.name,
        },
      ]);

      setImage(null);
      fileInputRef.current.value = "";
      toast.success("Image uploaded successfully!");
    } catch (err) {
      console.error("Error:", err);
      toast.error(err.message || "Failed to process image");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!exhibitType || !description || uploadedImages.length === 0) {
      toast.error("Please fill all fields and upload at least one image");
      return;
    }

    try {
      const formData = {
        exhibitType,
        description,
        images: uploadedImages, // This now matches the backend expectation
        raidId,
        userId,
      };

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/save-record`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            // Add authorization header if needed
          },
        }
      );

      if (res.status === 200) {
        toast.success("Record saved successfully!");
        // Reset form
        setexhibitType("");
        setDescription("");
        setUploadedImages([]);
        setimagePreviewLink(null);
        console.log(res.data);

        const evidenceId = localStorage.setItem(
          "evidenceId",
          res.data.evidence._id
        );
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to save record. Please try again."
      );
    }
  };

  return (
    <div className="-mt-30">
      <div className="w-full max-w-3xl mx-auto bg-[#2a3d52] shadow-lg rounded-xl overflow-hidden">
        {/* Header with accent color */}
        <div className="bg-[#3a5a7a] py-3 px-6">
          <h3 className="text-center text-white text-lg font-bold">
            SEIZED ITEMS DETAILS
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* exhibitType Select */}
          <div>
            <label
              htmlFor="exhibitType"
              className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1"
            >
              Category
            </label>
            <div className="relative">
              <select
                className="block w-full bg-[#33475e] border border-[#4a6178] text-gray-200 py-2 px-3 pr-8 rounded-md text-sm focus:ring-1 focus:ring-blue-400 focus:border-blue-400 appearance-none"
                name="exhibitType"
                id="exhibitType"
                value={exhibitType}
                onChange={(e) => setexhibitType(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select an option
                </option>
                <option value="Item">Physical Item</option>
                <option value="Digital">Digital Asset</option>
                <option value="Document">Document</option>
                <option value="Other">Other</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1"
            >
              Description
            </label>
            <textarea
              className="block w-full bg-[#33475e] border border-[#4a6178] text-gray-200 rounded-md text-sm focus:ring-1 focus:ring-blue-400 focus:border-blue-400 p-2"
              id="description"
              rows="3"
              placeholder="Enter item details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Image Upload with Larger Preview */}
          <div>
            <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1">
              Evidence Photo (upload all the Images One by One Before
              Submitting)
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Upload Button */}
              <div className="sm:w-1/3">
                <label
                  htmlFor="image"
                  className="flex flex-col items-center justify-center w-full h-64 border border-dashed border-[#4a6178] rounded-md cursor-pointer bg-[#33475e] hover:bg-[#3a4e66] transition"
                >
                  <div className="flex flex-col items-center p-2">
                    <svg
                      className="w-8 h-8 mb-2 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <span className="text-xs text-center text-gray-300">
                      Click to upload or drag and drop
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      JPG, PNG (MAX. 5MB each)
                    </span>
                  </div>
                  <input
                    id="image"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={fileChangeHandler}
                  />
                </label>
              </div>

              {/* Preview Area - Made Larger */}
              <div className="sm:w-2/3">
                <div className="w-full h-64 bg-[#33475e] border border-[#4a6178] rounded-md flex items-center justify-center overflow-hidden">
                  {imagePreviewLink ? (
                    <img
                      id="image-preview"
                      src={imagePreviewLink}
                      alt="Preview"
                      className="object-contain w-full h-full"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <svg
                        className="w-12 h-12 mx-auto text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-sm text-gray-400 mt-2">
                        No image uploaded yet
                      </p>
                      <p className="text-xs text-gray-500">
                        Preview will appear here
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Uploaded Images Grid   // can implement futher if asked to show all images that are being uploaded */}

          {/* {uploadedImages.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-300 uppercase tracking-wider mb-2">
                Uploaded Images ({uploadedImages.length})
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {uploadedImages.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img.url}
                      alt={`Uploaded ${index + 1}`}
                      className="w-full h-32 object-cover rounded border border-[#4a6178]"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                      <span className="text-white text-xs p-1 bg-black bg-opacity-70 rounded">
                        {img.name}
                      </span>
                    </div>
                    <div className="text-xs text-gray-300 mt-1 truncate">
                      Image {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )} */}

          {/* GPS Data Display */}

          {/* {gpsData && (
            <div className="mt-4 p-3 bg-[#33475e] rounded-md">
              <h4 className="text-sm font-medium text-gray-300 mb-2">
                GPS Coordinates Found
              </h4>
              <div className="text-xs text-gray-400">
                <p>Latitude: {gpsData.latitude.toFixed(6)}</p>
                <p>Longitude: {gpsData.longitude.toFixed(6)}</p>
              </div>
            </div>
          )} */}

          {/* Submit Button */}
          <div className="pt-1">
            <button
              type="submit"
              className="w-full bg-[#3a5a7a] hover:bg-[#4a6a8a] text-white font-medium py-2 px-4 rounded-md text-sm transition focus:outline-none focus:ring-1 focus:ring-blue-400"
            >
              SAVE RECORD
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UploadImage;
