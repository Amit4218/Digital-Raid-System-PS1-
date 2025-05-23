import { toast } from "react-toastify";

const UploadImg = async (image) => {
  const CLOUDINARY_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET;
  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  if (!CLOUDINARY_PRESET || !CLOUDINARY_CLOUD_NAME) {
    throw new Error("Cloudinary configuration is missing");
  }

  // Construct the upload URL with your cloud name
  const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;

  const data = new FormData();
  data.append("file", image);
  data.append("upload_preset", CLOUDINARY_PRESET);
  // data.append("folder", "evidence_images");

  try {
    const res = await fetch(uploadUrl, {
      method: "POST",
      body: data,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Upload failed with status ${res.status}`
      );
    }

    const result = await res.json();
    return result.secure_url;
  } catch (err) {
    console.error("Upload failed:", err);
    throw new Error(err.message || "Error uploading image");
  }
};

export default UploadImg;
