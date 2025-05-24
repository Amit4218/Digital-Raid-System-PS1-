import axios from "axios";

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET;

const videoUpload = async (videoFile) => {
  if (!videoFile) return null;

  const formData = new FormData();
  formData.append("file", videoFile);
  formData.append("upload_preset", CLOUDINARY_PRESET);

  try {
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`,
      formData
    );
    console.log("Upload successful:", res.data);
    return res.data.secure_url; // Return the uploaded video URL
  } catch (err) {
    console.error("Upload error:", err);
    throw err; // Re-throw the error to handle it in the component
  }
};

export default videoUpload;
