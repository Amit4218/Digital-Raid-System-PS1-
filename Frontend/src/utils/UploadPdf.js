import { toast } from "react-toastify";

const UploadPdf = async (pdfFile) => {
  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  if (!CLOUDINARY_CLOUD_NAME) {
    const errorMsg =
      "Missing Cloudinary configuration. Please check your environment variables.";
    console.error(errorMsg);
    toast.error(errorMsg);
    throw new Error(errorMsg);
  }

  const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload`;
  const data = new FormData();
  data.append("file", pdfFile);
  data.append("upload_preset", "pdf_uploads");

  try {
    const res = await fetch(uploadUrl, {
      method: "POST",
      body: data,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMsg =
        errorData.error?.message || `Upload failed with status ${res.status}`;
      throw new Error(errorMsg);
    }

    const result = await res.json();
    if (!result.secure_url) {
      throw new Error("No secure_url returned from Cloudinary");
    }

    console.log("Cloudinary upload result:", result); // For debugging
    return result.secure_url;
  } catch (err) {
    console.error("Upload failed:", err);
    toast.error(`Upload failed: ${err.message}`);
    throw err;
  }
};

export default UploadPdf;
