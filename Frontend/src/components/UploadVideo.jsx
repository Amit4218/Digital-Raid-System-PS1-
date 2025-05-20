import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import handleVideoUpload from "../utils/UploadVideo";
import axios from "axios";

function UploadVideo() {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [uploadedVideos, setUploadedVideos] = useState([]);

  const fileChangeHandler = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      // Process all selected files
      for (const file of files) {
        try {
          const videoUrl = await handleVideoUpload(file);

          setUploadedVideos((prev) => [
            ...prev,
            {
              url: videoUrl,
              timestamp: new Date().toISOString(),
              name: file.name,
              size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
              type: file.type,
            },
          ]);

          toast.success(`${file.name} uploaded successfully!`);
        } catch (uploadError) {
          console.error(`Upload failed for ${file.name}:`, uploadError);
          toast.error(`Failed to upload ${file.name}`);
        }
      }
    } catch (err) {
      console.error("Error processing videos:", err);
      toast.error("Failed to process videos");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset file input
      }
    }
  };

  // const deleteVideo = (index) => {
  //   setUploadedVideos((prev) => prev.filter((_, i) => i !== index));
  //   toast.info("Video removed");
  // };

  const saveVideo = async () => {
    if (uploadedVideos.length === 0) {
      toast.error("Please upload at least one video");
      return;
    }

    try {
      // Take only the first video (to match your backend expectation)
      const firstVideo = uploadedVideos[0];

      const formData = {
        video: {
          url: firstVideo.url,
          name: firstVideo.name,
        },
        evidenceId: localStorage.getItem("evidenceId"),
      };

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/video-update-record`,
        formData
      );

      if (res.status === 200) {
        toast.success("Video saved successfully!");
        setUploadedVideos([]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save video");
    }
  };

  return (
    <div className="p-5">
      <div className="border border-[#2c4258] h-auto w-full mt-4 shadow-2xl rounded-md p-5">
        <div className="text-2xl text-center m-3">
          <h1>Upload Raid Video</h1>
        </div>
        <div>
          <label
            className={`flex flex-col items-center px-4 py-6 bg-[#2c4258] rounded-lg border-2 border-dashed border-zinc-500 cursor-pointer hover:bg-[#404f5f] transition ${
              isUploading ? "opacity-50" : ""
            }`}
          >
            <input
              type="file"
              accept="video/*"
              className="hidden"
              ref={fileInputRef}
              onChange={fileChangeHandler}
              multiple
              disabled={isUploading}
            />
            <span className="mb-2">
              {isUploading ? "Uploading..." : "Click to select videos"}
            </span>
            <span className="text-sm text-zinc-300">
              {isUploading ? "Please wait..." : "Upload raid videos"}
            </span>
          </label>
        </div>
        <div className="flex flex-wrap gap-4 mt-4">
          {uploadedVideos.map((video, idx) => (
            <div key={idx} className="border p-3 w-60 rounded-md bg-[#2c4258]">
              <h3 className="font-medium text-center mb-2">{video.name}</h3>
              <p className="text-sm text-gray-300 text-center mb-1 ">
                Video size : {video.size}
              </p>
              <div className="flex gap-2 mt-2">
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 bg-blue-600 rounded text-sm hover:bg-blue-700 transition text-center w-full"
                >
                  View
                </a>
                {/* <button
                  onClick={() => deleteVideo(idx)}
                  className="px-2 py-1 bg-red-600 rounded text-sm hover:bg-red-700 transition"
                >
                  Delete
                </button> */}
              </div>
            </div>
          ))}
        </div>
        <div className="text-center text-xl mt-3">
          <button
            onClick={saveVideo}
            className="bg-yellow-500 hover:bg-yellow-600 rounded-md py-1.5 w-full"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadVideo;
