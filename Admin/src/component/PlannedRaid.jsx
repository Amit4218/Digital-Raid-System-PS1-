import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

const PlannedRaid = () => {
  const [status, setStatus] = useState("pending");
  const [officers, setOfficers] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setloading] = useState(false);
  const adminId = localStorage.getItem("adminId");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Form data state
  const [formData, setFormData] = useState({
    inCharge: "",
    culpritName: "",
    identification: "",
    address: "",
    scheduledDate: "",
    description: "",
    warrantFilePath: "",
    adminId, // This will store the server path after upload
  });

  // console.log(formData);

  // Error states
  const [errors, setErrors] = useState({
    inCharge: "",
    culpritName: "",
    identification: "",
    address: "",
    scheduledDate: "",
    description: "",
    warrantFile: "",
  });

  // Fetch raid officers
  useEffect(() => {
    const fetchOfficers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin/get-raid-officers`,
          {
            headers: {
              "Content-Type": "application/json",
              "x-access-key": import.meta.env.VITE_SECRET_ACCESS_KEY,
            },
          }
        );

        const officersList = response.data.users.filter(
          (user) => user.role === "raid_officer"
        );
        setOfficers(officersList);
      } catch (error) {
        console.error("Error fetching officers:", error);
      }
    };

    fetchOfficers();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file upload click
  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  // Upload warrant file to server
  const uploadWarrantFile = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("warrant", file);

    try {
      setIsUploading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/upload-warrant`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-access-key": import.meta.env.VITE_SECRET_ACCESS_KEY,
          },
        }
      );

      return response.data.filePath;
    } catch (error) {
      console.error("Error uploading warrant:", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  // Handle file selection
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        warrantFile: "File size must be less than 5MB",
      }));
      return;
    }
    if (!["application/pdf", "image/jpeg", "image/png"].includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        warrantFile: "Only PDF, JPEG, and PNG files are allowed",
      }));
      return;
    }

    try {
      const filePath = await uploadWarrantFile(file);
      setFormData((prev) => ({
        ...prev,
        warrantFilePath: filePath,
      }));
      setErrors((prev) => ({ ...prev, warrantFile: "" }));
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        warrantFile: "Failed to upload warrant file",
      }));
    }
  };

  // Form validation
  const validateForm = () => {
    let valid = true;
    const newErrors = {
      inCharge: "",
      culpritName: "",
      identification: "",
      address: "",
      scheduledDate: "",
      description: "",
      warrantFile: "",
    };

    // Validate each field
    if (!formData.inCharge) {
      newErrors.inCharge = "Please select a raid officer";
      valid = false;
    }
    if (!formData.culpritName.trim()) {
      newErrors.culpritName = "Culprit name is required";
      valid = false;
    } else if (formData.culpritName.length < 2) {
      newErrors.culpritName = "Culprit name must be at least 2 characters";
      valid = false;
    }
    if (!formData.identification.trim()) {
      newErrors.identification = "Identification is required";
      valid = false;
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
      valid = false;
    }
    if (!formData.scheduledDate) {
      newErrors.scheduledDate = "Please select a raid date";
      valid = false;
    } else {
      const selectedDate = new Date(formData.scheduledDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.scheduledDate = "Raid date cannot be in the past";
        valid = false;
      }
    }
    if (!formData.description.trim()) {
      newErrors.description = "Raid description is required";
      valid = false;
    } else if (formData.description.length < 20) {
      newErrors.description = "Description must be at least 20 characters";
      valid = false;
    }
    if (!formData.warrantFilePath) {
      newErrors.warrantFile = "Please upload a warrant file";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Handle form submission
  const handlePublish = async (e) => {
    e.preventDefault();

    setloading(true);

    if (!validateForm()) return;

    try {
      const raidData = {
        raidType: "planned",
        inCharge: formData.inCharge,
        culprits: [
          {
            name: formData.culpritName,
            identification: formData.identification,
          },
        ],
        location: {
          address: formData.address,
          coordinates: { longitude: null, latitude: null },
        },
        description: formData.description,
        isUnplannedRequest: false,
        warrant: formData.warrantFilePath,
        scheduledDate: formData.scheduledDate,
        adminId,
      };

      console.log(raidData);

      // Submit the raid data to your API
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/create-raid`,
        raidData,
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-key": import.meta.env.VITE_SECRET_ACCESS_KEY,
          },
        }
      );

      // console.log("Raid created successfully:", response.data);
      // Reset form after successful submission
      setFormData({
        inCharge: "",
        culpritName: "",
        identification: "",
        address: "",
        scheduledDate: "",
        description: "",
        warrantFilePath: "",
      });
      if (fileInputRef.current) fileInputRef.current.value = "";

      // Show success message or redirect
      toast.success("Raid plan published successfully!");
      navigate("/admin/raids");
      setloading(false);
    } catch (error) {
      setloading(false);
      console.error("Error creating raid:", error);
      toast.error(
        `Error creating raid: ${error.response?.data?.message || error.message}`
      );
    } finally {
      setloading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="p-6 min-h-screen mt-5">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold capitalize">{status}</span>
          <span className="w-3 h-3 rounded-full bg-orange-500 border-2 border-orange-300"></span>
        </div>
        <div className="text-green-600 font-semibold">EDITABLE</div>
      </div>

      <form
        onSubmit={handlePublish}
        className="bg-white border w-full border-[#213448] shadow-2xl rounded-xl p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          {/* Culprit Name */}
          <div>
            <label className="block text-sm font-medium text-[#213448]">
              Culprit Name *
            </label>
            <input
              type="text"
              name="culpritName"
              className={`mt-1 block w-full border ${
                errors.culpritName ? "border-red-500" : "border-[#213448]"
              } rounded-md shadow-sm p-3`}
              value={formData.culpritName}
              onChange={handleInputChange}
            />
            {errors.culpritName && (
              <p className="mt-1 text-sm text-red-600">{errors.culpritName}</p>
            )}
          </div>

          {/* Identification */}
          <div>
            <label className="block text-sm font-medium text-[#213448]">
              Identification *
            </label>
            <input
              type="text"
              name="identification"
              className={`mt-1 block w-full border ${
                errors.identification ? "border-red-500" : "border-[#213448]"
              } rounded-md shadow-sm p-3`}
              value={formData.identification}
              onChange={handleInputChange}
            />
            {errors.identification && (
              <p className="mt-1 text-sm text-red-600">
                {errors.identification}
              </p>
            )}
          </div>

          {/* Raid Officer & Raid Date */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#213448]">
                Raid Officer (In-Charge) *
              </label>
              <select
                name="inCharge"
                className={`mt-1 block w-full border ${
                  errors.inCharge ? "border-red-500" : "border-[#213448]"
                } rounded-md shadow-sm p-3`}
                value={formData.inCharge}
                onChange={handleInputChange}
              >
                <option value="">Select Officer</option>
                {officers.map((officer) => (
                  <option key={officer._id} value={officer._id}>
                    {officer.username}
                  </option>
                ))}
              </select>
              {errors.inCharge && (
                <p className="mt-1 text-sm text-red-600">{errors.inCharge}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#213448]">
                Raid Date *
              </label>
              <input
                type="date"
                name="scheduledDate"
                className={`mt-1 block w-full border ${
                  errors.scheduledDate ? "border-red-500" : "border-[#213448]"
                } rounded-md shadow-sm p-3`}
                value={formData.scheduledDate}
                onChange={handleInputChange}
              />
              {errors.scheduledDate && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.scheduledDate}
                </p>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#213448]">
              Address *
            </label>
            <input
              type="text"
              name="address"
              className={`mt-1 block w-full border ${
                errors.address ? "border-red-500" : "border-[#213448]"
              } rounded-md shadow-sm p-3`}
              value={formData.address}
              onChange={handleInputChange}
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address}</p>
            )}
          </div>

          {/* Raid Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#213448]">
              Raid Description *
            </label>
            <textarea
              rows={3}
              name="description"
              className={`mt-1 block w-full border ${
                errors.description ? "border-red-500" : "border-[#213448]"
              } rounded-md shadow-sm p-3`}
              value={formData.description}
              onChange={handleInputChange}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>
        </div>

        {/* Upload + Publish */}
        <div className="flex flex-col items-center justify-center gap-10 mt-6 md:flex-row">
          <div className="text-center">
            <button
              type="button"
              onClick={handleFileClick}
              disabled={isUploading}
              className="px-4 py-2 bg-[#213448] text-white font-bold rounded hover:bg-[#547792] disabled:opacity-50"
            >
              {isUploading ? "Uploading..." : "Upload Warrant *"}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
            />
            {formData.warrantFilePath ? (
              <p className="text-sm mt-1 text-green-600">
                Warrant uploaded successfully
              </p>
            ) : errors.warrantFile ? (
              <p className="mt-1 text-sm text-red-600">{errors.warrantFile}</p>
            ) : null}
          </div>

          <button
            type="submit"
            className="bg-[#213448] text-white font-bold px-6 py-2 rounded-md hover:bg-[#547792]"
          >
            Publish
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlannedRaid;
