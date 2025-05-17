import React, { useState, useRef } from "react";
import extractGPSData from "../utils/lat-long-image-parser";
import UploadImg from "../utils/Uploadimage";
import { toast } from "react-toastify";

function UploadImage() {
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);
  const [gpsData, setGpsData] = useState(null);

  // handels the file input and helps extract La & long from the image
  // with image upload to the cloud

  const fileChangeHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    try {
      // Extract GPS data
      const data = await extractGPSData(file);
      setGpsData(data);

      if (data) {
        console.log("GPS Data:", data);

        // Upload the image and wait for completion
        try {
          const imageUrl = await UploadImg(file);
          console.log("Image uploaded to:", imageUrl);
          setImage(null); // Clear the image state after successful upload
        } catch (uploadError) {
          console.error("Upload failed:", uploadError);
          // Error toast is already shown by UploadImg
        }
      } else {
        console.log("No GPS data found");
        toast.warning("No GPS data found in image");
      }
    } catch (err) {
      console.error("Error processing image:", err);
      setError("Failed to extract GPS data from image");
      toast.error("Failed to process image");
    }
  };

  return (
    <>
      <div className="mt-8 p-6 bg-zinc-700 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Upload Raid Photo</h3>

        <label className="flex flex-col items-center px-4 py-6 bg-zinc-600 rounded-lg border-2 border-dashed border-zinc-500 cursor-pointer hover:bg-zinc-500 transition">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={fileChangeHandler}
          />
          <span className="mb-2">
            {image ? image.name : "Click to select an image"}
          </span>
          <span className="text-sm text-zinc-300">
            {image ? "Change file" : "Upload raid photo with GPS data"}
          </span>
        </label>

        {gpsData && (
          <div className="mt-4 p-4 bg-zinc-600 rounded">
            <p>Extracted GPS Coordinates:</p>
            <p>Latitude: {gpsData.latitude}</p>
            <p>Longitude: {gpsData.longitude}</p>
            {/* You could add a map here using these coordinates */}
          </div>
        )}
      </div>
    </>
  );
}

export default UploadImage;
