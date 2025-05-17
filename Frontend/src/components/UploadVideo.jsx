import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import handleVideoUpload from "../utils/UploadVideo";

function UploadVideo() {
  const [video, setVideo] = useState(null);
  const fileInputRef = useRef(null);

  // handels the file input and helps extract La & long from the image
  // with image upload to the cloud

  const fileChangeHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setVideo(file);
    try {
      // Extract GPS data

      // Upload the image and wait for completion
      try {
        const videoUrl = await handleVideoUpload(file);
        console.log("Image uploaded to:", videoUrl);
        toast.success("Video uploaded sucessfully");
        setVideo(null); // Clear the image state after successful upload
      } catch (uploadError) {
        console.error("Upload failed:", uploadError);
        // Error toast is already shown by UploadImg
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
        <h3 className="text-xl font-semibold mb-4">Upload Raid video</h3>

        <label className="flex flex-col items-center px-4 py-6 bg-zinc-600 rounded-lg border-2 border-dashed border-zinc-500 cursor-pointer hover:bg-zinc-500 transition">
          <input
            type="file"
            accept="video/*"
            className="hidden"
            ref={fileInputRef}
            onChange={fileChangeHandler}
            disabled={video ? true : false}
          />
          <span className="mb-2">
            {video ? video.name : "Click to select an video"}
          </span>
          <span className="text-sm text-zinc-300">
            {video ? "Change file" : "Upload raid video with GPS data"}
          </span>
        </label>
      </div>
    </>
  );
}

export default UploadVideo;
