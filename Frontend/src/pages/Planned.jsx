import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import extractGPSData from "../utils/lat-long-image-parser";
import UploadImg from "../utils/Uploadimage";
import { toast } from "react-toastify";

function Planned() {
  const { id } = useParams();
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  const [gpsData, setGpsData] = useState(null);
  const fileInputRef = useRef(null);

  // gets all the info about the raid

  useEffect(() => {
    const getRaidInfo = async () => {
      try {
        setLoading(true);
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/user/raid/${id}`
        );
        setInfo(res.data.info);
      } catch (err) {
        setError(err.message || "Failed to fetch raid info");
      } finally {
        setLoading(false);
      }
    };
    getRaidInfo();
  }, [id]);

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

  if (loading) return <div>Loading raid information...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!info) return <div>No raid information found</div>;

  return (
    <div className="min-h-screen bg-zinc-800 text-white p-5">
      <div className="raid-info-container max-w-4xl mx-auto">
        <h2 className="mb-6 text-3xl font-bold text-white">Raid Details</h2>

        <div className="grid gap-4 mb-8">{/* Raid details rendering... */}</div>

        <div className="flex gap-4 mb-8">
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition">
            Download Warrant
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition">
            Preview Warrant
          </button>
        </div>

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
      </div>
    </div>
  );
}

export default Planned;
