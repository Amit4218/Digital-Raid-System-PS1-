import React, { useState, useRef,useEffect } from "react";
import axios from "axios";
import { use } from "react";


const PlannedRaid = () => {
  const [status, setStatus] = useState("pending");
  const [culpritName, setCulpritName] = useState("");
  const [identification, setIdentification] = useState("");
  const [crimeDescription, setCrimeDescription] = useState("");
  const [address, setAddress] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [description, setDescription] = useState("");
  const [warrantFile, setWarrantFile] = useState(null);
  const [inCharge, setInCharge] = useState("");

  // Fetching officers from the server
  
  const [officers, setOfficers] = useState([]);
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

        // Extract data from response
        const data = response.data;

        // Filter officers with role "raid-officer"
        const officersList = data.users.filter(
          (user) => user.role === "raid_officer"
        );

        // Set the filtered list to state
        setOfficers(officersList);

        // console.log("Officers list:", officersList);
      } catch (error) {
        console.error("Error fetching officers:", error);
      }
    };

    fetchOfficers();
  }, []);





  // Error states
  const [errors, setErrors] = useState({
    inCharge: "",
    culpritName: "",
    identification: "",
    crimeDescription: "",
    address: "",
    scheduledDate: "",
    description: "",
    warrantFile: "",
  });

  const fileInputRef = useRef(null);

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      inCharge: "",
      culpritName: "",
      identification: "",
      crimeDescription: "",
      address: "",
      scheduledDate: "",
      description: "",
      warrantFile: "",
    };

    // Validate inCharge
    if (!inCharge) {
      newErrors.inCharge = "Please select a raid officer";
      valid = false;
    }

    // Validate culpritName
    if (!culpritName.trim()) {
      newErrors.culpritName = "Culprit name is required";
      valid = false;
    } else if (culpritName.length < 2) {
      newErrors.culpritName = "Culprit name must be at least 2 characters";
      valid = false;
    }

    // Validate identification
    if (!identification.trim()) {
      newErrors.identification = "Identification is required";
      valid = false;
    }

    // Validate crimeDescription
    if (!crimeDescription.trim()) {
      newErrors.crimeDescription = "Crime description is required";
      valid = false;
    } else if (crimeDescription.length < 10) {
      newErrors.crimeDescription = "Description must be at least 10 characters";
      valid = false;
    }

    // Validate address
    if (!address.trim()) {
      newErrors.address = "Address is required";
      valid = false;
    }

    // Validate scheduledDate
    if (!scheduledDate) {
      newErrors.scheduledDate = "Please select a raid date";
      valid = false;
    } else {
      const selectedDate = new Date(scheduledDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.scheduledDate = "Raid date cannot be in the past";
        valid = false;
      }
    }

    // Validate description
    if (!description.trim()) {
      newErrors.description = "Raid description is required";
      valid = false;
    } else if (description.length < 20) {
      newErrors.description = "Description must be at least 20 characters";
      valid = false;
    }

    // Validate warrantFile
    if (!warrantFile) {
      newErrors.warrantFile = "Please upload a warrant file";
      valid = false;
    } else if (warrantFile.size > 5 * 1024 * 1024) {
      // 5MB limit
      newErrors.warrantFile = "File size must be less than 5MB";
      valid = false;
    } else if (
      !["application/pdf", "image/jpeg", "image/png"].includes(warrantFile.type)
    ) {
      newErrors.warrantFile = "Only PDF, JPEG, and PNG files are allowed";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handlePublish = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        // Prepare the form data
        const formData = new FormData();
        formData.append("raidType", "planned"); // Assuming this is a planned raid
        formData.append("createdBy", "user-id-here"); // You'll need to get this from auth context
        formData.append("inCharge", inCharge);

        // Prepare culprits array
        const culprits = [
          {
            name: culpritName,
            identification,
            crimeDescription,
          },
        ];
        formData.append("culprits", JSON.stringify(culprits));

        // Prepare location object
        const location = {
          address: address,
          coordinates: { longitude: null, latitude: null }, // Add actual coordinates if available
        };
        formData.append("location", JSON.stringify(location));

        formData.append("description", description);
        formData.append("isUnplannedRequest", false);
        formData.append("warrant", warrantFile);

        // If you have scheduledDate in your backend model
        formData.append("scheduledDate", scheduledDate);

        // Make the API call
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/admin/createRaid`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "x-access-key": import.meta.env.VITE_SECRET_ACCESS_KEY,
            },
          }
        );

        // Handle success
        console.log("Raid created successfully:", response.data);
        alert("Raid plan published successfully!");

        // Reset form
        setInCharge("");
        setCulpritName("");
        setIdentification("");
        setCrimeDescription("");
        setAddress("");
        setScheduledDate("");
        setDescription("");
        setWarrantFile(null);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch (error) {
        console.error(
          "Error creating raid:",
          error.response?.data || error.message
        );
        alert(
          `Error creating raid: ${
            error.response?.data?.message || error.message
          }`
        );
      }
    }
  };

  return (
    <div className="p-6 min-h-screen mt-5">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold capitalize">{status}</span>
          <span className="w-3 h-3 rounded-full bg-orange-500 border-2 border-orange-300"></span>
        </div>
        <div className="text-red-500 font-semibold">EDITABLE</div>
      </div>

      <form
        onSubmit={handlePublish}
        className="bg-white border  w-[90vw] border-[#213448] shadow-2xl rounded-xl p-6 absolute top-1/2 left-1/2  -translate-x-1/2 -translate-y-1/2"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          {/* Culprit Name */}
          <div>
            <label className="block text-sm font-medium text-[#213448]">
              Culprit Name *
            </label>
            <input
              type="text"
              className={`mt-1 block w-full border ${
                errors.culpritName ? "border-red-500" : "border-[#213448]"
              } rounded-md shadow-sm p-3`}
              value={culpritName}
              onChange={(e) => setCulpritName(e.target.value)}
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
              className={`mt-1 block w-full border ${
                errors.identification ? "border-red-500" : "border-[#213448]"
              } rounded-md shadow-sm p-3`}
              value={identification}
              onChange={(e) => setIdentification(e.target.value)}
            />
            {errors.identification && (
              <p className="mt-1 text-sm text-red-600">
                {errors.identification}
              </p>
            )}
          </div>

          {/* Crime Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#213448]">
              Crime Description *
            </label>
            <textarea
              placeholder="Describe the crime in detail"
              style={{ resize: "none" }}
              rows={2}
              className={`mt-1 block w-full border ${
                errors.crimeDescription ? "border-red-500" : "border-[#213448]"
              } rounded-md shadow-sm p-3`}
              value={crimeDescription}
              onChange={(e) => setCrimeDescription(e.target.value)}
            />
            {errors.crimeDescription && (
              <p className="mt-1 text-sm text-red-600">
                {errors.crimeDescription}
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
                className={`mt-1 block w-full border ${
                  errors.inCharge ? "border-red-500" : "border-[#213448]"
                } rounded-md shadow-sm p-3`}
                value={inCharge}
                onChange={(e) => setInCharge(e.target.value)}
              >
                <option value="">Select Officer</option>
                {officers.map((officer) => (
                  <option key={officer._id} value={officer._id}>
                    {officer.personalDetails.name}
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
                className={`mt-1 block w-full border ${
                  errors.scheduledDate ? "border-red-500" : "border-[#213448]"
                } rounded-md shadow-sm p-3`}
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
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
              className={`mt-1 block w-full border ${
                errors.address ? "border-red-500" : "border-[#213448]"
              } rounded-md shadow-sm p-3`}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
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
              className={`mt-1 block w-full border ${
                errors.description ? "border-red-500" : "border-[#213448]"
              } rounded-md shadow-sm p-3`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              className="px-4 py-2 bg-[#213448] text-white font-bold rounded hover:bg-[#547792]"
            >
              Upload Warrant *
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => setWarrantFile(e.target.files[0])}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
            />
            {warrantFile ? (
              <p className="text-sm mt-1 text-green-600">
                Selected: {warrantFile.name}
              </p>
            ) : (
              errors.warrantFile && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.warrantFile}
                </p>
              )
            )}
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
