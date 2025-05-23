import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  Upload,
  IndianRupee,
  FileText,
  Banknote,
  CheckCircle,
  X,
} from "lucide-react";
import { toast } from "react-toastify";

const FineForm = () => {
  const { raidId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fineReceiptFile, setFineReceiptFile] = useState(null);
  const [bankReceiptFile, setBankReceiptFile] = useState(null);
  const [formData, setFormData] = useState({
    raidId: raidId || "",
    amount: "",
    fineReciept: "",
    bankReciept: "",
  });
  const [errors, setErrors] = useState({
    amount: "",
    fineReciept: "",
  });

  // Handle file uploads
  const handleFileUpload = async (file, type) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data.filePath;
    } catch (error) {
      console.error(`Error uploading ${type} receipt:`, error);
      toast.error(`Failed to upload ${type} receipt`);
      return null;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate form
    const newErrors = {
      amount: !formData.amount ? "Amount is required" : "",
      fineReciept: !fineReceiptFile ? "Fine receipt is required" : "",
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) {
      setLoading(false);
      return;
    }

    try {
      // Upload files
      const fineReceiptPath = await handleFileUpload(fineReceiptFile, "fine");
      const bankReceiptPath = bankReceiptFile
        ? await handleFileUpload(bankReceiptFile, "bank")
        : null;

      if (!fineReceiptPath) {
        throw new Error("Failed to upload fine receipt");
      }

      // Prepare final data
      const submissionData = {
        ...formData,
        fineReciept: fineReceiptPath,
        bankReciept: bankReceiptPath,
      };

      // Submit to backend
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/fines`,
        submissionData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Fine recorded successfully!");
      navigate(`/raids/${raidId || formData.raidId}`);
    } catch (error) {
      console.error("Error submitting fine:", error);
      toast.error(error.response?.data?.message || "Failed to record fine");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!["image/jpeg", "image/png", "application/pdf"].includes(file.type)) {
      toast.error("Only JPG, PNG, or PDF files are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      toast.error("File size must be less than 5MB");
      return;
    }

    if (type === "fine") {
      setFineReceiptFile(file);
    } else {
      setBankReceiptFile(file);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-[#2A3D52] shadow rounded-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#3A5A7A] to-[#1F3143]">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              <Banknote className="inline mr-2 h-6 w-6" />
              Record Fine
            </h2>
            <button
              onClick={() => navigate(-1)}
              className="text-white hover:text-gray-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Fine Amount (₹) *
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IndianRupee className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`block w-full pl-10 pr-4 py-2 border ${
                  errors.amount ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                placeholder="0.00"
                required
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
            )}
          </div>

          {/* Fine Receipt Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-100">
              Fine Receipt *
            </label>
            <div
              className={`border-2 ${
                errors.fineReciept ? "border-red-500" : "border-gray-300"
              } border-dashed rounded-md px-6 pt-5 pb-6 flex flex-col items-center justify-center`}
            >
              {fineReceiptFile ? (
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {fineReceiptFile.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => setFineReceiptFile(null)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="h-12 w-12 text-gray-400" />
                  <div className="mt-1 text-sm text-gray-600 text-center">
                    <label
                      htmlFor="fine-receipt"
                      className="relative cursor-pointer p-1 bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                    >
                      <span>Upload a file</span>
                      <input
                        id="fine-receipt"
                        name="fine-receipt"
                        type="file"
                        className="sr-only"
                        onChange={(e) => handleFileChange(e, "fine")}
                        accept=".jpg,.jpeg,.png,.pdf"
                        required
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      JPG, PNG, or PDF up to 5MB
                    </p>
                  </div>
                </>
              )}
            </div>
            {errors.fineReciept && (
              <p className="mt-1 text-sm text-red-600">{errors.fineReciept}</p>
            )}
          </div>

          {/* Bank Receipt Upload (Optional) */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-100">
              Bank Receipt (Optional)
            </label>
            <div className="border-2 border-gray-300 border-dashed rounded-md px-6 pt-5 pb-6 flex flex-col items-center justify-center">
              {bankReceiptFile ? (
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {bankReceiptFile.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => setBankReceiptFile(null)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="h-12 w-12 text-gray-400" />
                  <div className="mt-1 text-sm text-gray-600 text-center">
                    <label
                      htmlFor="bank-receipt"
                      className="relative cursor-pointer p-1 bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                    >
                      <span>Upload a file</span>
                      <input
                        id="bank-receipt"
                        name="bank-receipt"
                        type="file"
                        className="sr-only"
                        onChange={(e) => handleFileChange(e, "bank")}
                        accept=".jpg,.jpeg,.png,.pdf"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      JPG, PNG, or PDF up to 5MB
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#3A5A7A] hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Record Fine"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FineForm;
