import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import html2pdf from "html2pdf.js";
import policeLogeo from "../Images/sikkimpolice-removebg-preview.png";

const PlannedRaid = () => {
  const [status, setStatus] = useState("pending");
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(false);
  const adminId = localStorage.getItem("adminId");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    inCharge: "",
    culpritName: "",
    identification: "",
    address: "",
    scheduledDate: "",
    description: "",
    warrantFilePath: "",
    adminId,
  });

  const [errors, setErrors] = useState({
    inCharge: "",
    culpritName: "",
    identification: "",
    address: "",
    scheduledDate: "",
    description: "",
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
        toast.error("Failed to load raid officers");
      }
    };

    fetchOfficers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateWarrantPDF = async () => {
    // Find the selected officer details
    const selectedOfficer = officers.find(
      (officer) => officer._id === formData.inCharge
    );

    // Create HTML content for the warrant
    const warrantHTML = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; position: relative;">
        <!-- Watermark -->
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0.1; z-index: -1;">
          <img src="${policeLogeo}" style="width: 400px; height: auto;" />
        </div>
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1a365d; font-size: 24px; margin-bottom: 5px;">Sikkim Police Department</h1>
          <h2 style="color: #3182ce; font-size: 20px; margin-bottom: 20px;">SEARCH WARRANT</h2>
          <div style="border-top: 2px solid #3182ce; width: 100px; margin: 0 auto;"></div>
        </div>
        
        <!-- Warrant Content -->
        <div style="margin-bottom: 20px;">
          <p style="text-align: right; margin-bottom: 30px;">Date: ${new Date().toLocaleDateString()}</p>
          
          <p style="margin-bottom: 15px; line-height: 1.6;">
            To: ${
              selectedOfficer ? selectedOfficer.username : "Raid Officer"
            } (ID: ${selectedOfficer ? selectedOfficer._id : ""})<br/>
            Rank: Raid Officer
          </p>
          
          <p style="margin-bottom: 15px; line-height: 1.6;">
            You are hereby authorized and directed to conduct a search at the following premises:
          </p>
          
          <div style="background-color: #f0f4f8; padding: 15px; border-left: 4px solid #3182ce; margin-bottom: 20px;">
            <p><strong>Address:</strong> ${formData.address}</p>
          </div>
          
          <p style="margin-bottom: 15px; line-height: 1.6;">
            <strong>Suspect Name:</strong> ${formData.culpritName}<br/>
            <strong>Identification:</strong> ${formData.identification}
          </p>
          
          <p style="margin-bottom: 15px; line-height: 1.6;">
            <strong>Scheduled Raid Date:</strong> ${new Date(
              formData.scheduledDate
            ).toLocaleDateString()}
          </p>
          
          <p style="margin-bottom: 15px; line-height: 1.6;">
            <strong>Reason for Search:</strong> ${formData.description}
          </p>
          
          <p style="margin-bottom: 15px; line-height: 1.6;">
            This warrant is valid for execution on the specified date only. You are authorized to seize any items 
            that may be evidence of criminal activity.
          </p>
        </div>
        
        <!-- Footer -->
        <div style="margin-top: 50px;">
          <div style="float: right; text-align: center;">
            <div style="border-top: 1px solid #000; width: 200px; margin-bottom: 5px;"></div>
            <p>Authorized Signature</p>
            <p>Sikkim Police Department</p>
          </div>
          <div style="clear: both;"></div>
        </div>
      </div>
    `;

    // Generate PDF
    const options = {
      margin: 10,
      filename: `warrant_${formData.culpritName.replace(/\s+/g, "_")}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    try {
      // Generate the PDF
      const pdf = await html2pdf()
        .from(warrantHTML)
        .set(options)
        .outputPdf("blob");

      // Create a FormData object to send the PDF to the server
      const formDataToSend = new FormData();
      formDataToSend.append("warrant", pdf, `warrant_${Date.now()}.pdf`);

      // Upload the generated PDF
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/upload-warrant`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-access-key": import.meta.env.VITE_SECRET_ACCESS_KEY,
          },
          timeout: 30000,
        }
      );

      return response.data.filePath;
    } catch (error) {
      console.error("Error generating or uploading warrant:", error);
      throw error;
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      inCharge: "",
      culpritName: "",
      identification: "",
      address: "",
      scheduledDate: "",
      description: "",
    };

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

    setErrors(newErrors);
    return valid;
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      // Generate and upload the warrant PDF
      const warrantFilePath = await generateWarrantPDF();
      console.log(warrantFilePath);

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
        warrant: warrantFilePath,
        scheduledDate: formData.scheduledDate,
        adminId,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/create-raid`,
        raidData,
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-key": import.meta.env.VITE_SECRET_ACCESS_KEY,
          },
          timeout: 30000,
        }
      );

      const raidId = response.data.raid?._id;
      const userId = localStorage.getItem("adminId");

      // Create audit log
      try {
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/admin/audit-log`,
          {
            action: "raid_created",
            performedBy: userId,
            targetId: raidId,
            targetType: "raid",
            changes: [
              {
                field: "status",
                oldValue: null,
                newValue: "pending",
              },
              {
                field: "created_by",
                oldValue: null,
                newValue: userId,
              },
            ],
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-access-key": import.meta.env.VITE_SECRET_ACCESS_KEY,
            },
          }
        );
      } catch (auditError) {
        console.error("Audit log failed:", auditError);
      }

      // Reset form
      setFormData({
        inCharge: "",
        culpritName: "",
        identification: "",
        address: "",
        scheduledDate: "",
        description: "",
        warrantFilePath: "",
      });

      toast.success("Raid plan published and warrant generated successfully!");
      navigate("/admin/raids");
    } catch (error) {
      console.error("Error creating raid:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to create raid. Please try again."
      );
    } finally {
      setLoading(false);
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

        {/* Publish Button */}
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="bg-[#213448] text-white font-bold px-6 py-2 rounded-md hover:bg-[#547792] disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Publishing..." : "Publish & Generate Warrant"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlannedRaid;
