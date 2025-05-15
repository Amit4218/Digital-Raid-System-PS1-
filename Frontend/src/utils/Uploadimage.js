import { toast } from "react-toastify";

const UploadImg = async (image) => {
  const CLOUDINARY_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET;
  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  // Construct the upload URL with your cloud name
  const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;

  const data = new FormData();
  data.append("file", image);
  data.append("upload_preset", CLOUDINARY_PRESET);

  try {
    const res = await fetch(uploadUrl, {
      method: "POST",
      body: data,
    });

    if (!res.ok) {
      throw new Error(`Upload failed with status ${res.status}`);
    }

    const result = await res.json();
    toast.success("Image Uploaded successfully");
    return result.secure_url; // Return the URL for further use
  } catch (err) {
    console.error("Upload failed:", err);
    toast.error("Error uploading image");
    throw err; // Re-throw the error so calling code can handle it
  }
};

export default UploadImg;
