import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

const EvidenceHandover = () => {
  const navigate = useNavigate();
  const { raidId } = useParams();
  const [exhibits, setExhibits] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentOfficer, setCurrentOfficer] = useState(null);
  const [formData, setFormData] = useState({
    senderType: "Internal",
    receiverType: "Internal",
    receiverName: "",
    externalSenderDetails: {
      name: "",
      department: "",
      designation: "",
      contact: "",
      email: "",
    },
    externalReceiverDetails: {
      name: "",
      department: "",
      designation: "",
      contact: "",
      email: "",
    },
    exhibitType: "",
    exhibitId: "",
    itemDescription: "",
    purpose: "",
    fromSignature: "",
    toSignature: "",
    consent: false,
  });

  // Get officers
  useEffect(() => {
    const getOfficers = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/user/get-all-raid-officers`,
          {
            headers: {
              "x-access-key": import.meta.env.VITE_SECRET_ACCESS_KEY,
            },
          }
        );
        const current = res.data.users.find(
          (officer) => officer._id === localStorage.getItem("userId")
        );
        setCurrentOfficer(current);
        setOfficers(res.data.users);
      } catch (error) {
        console.error("Failed to fetch officers:", error);
        toast.error("Failed to load officer data");
      }
    };

    getOfficers();
  }, []);

  // Get evidence exhibit Type
  useEffect(() => {
    const getExhibits = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/user/evidence/${raidId}`,
          {
            headers: {
              "x-access-key": import.meta.env.VITE_SECRET_ACCESS_KEY,
            },
          }
        );

        const exhibitsData = res.data.evidence || [];

        if (exhibitsData.length === 0) {
          toast.info("No exhibits found for this raid");
        }

        setExhibits(exhibitsData);
      } catch (error) {
        console.error("Failed to fetch exhibit data:", error);
        toast.error("Failed to load exhibit data");
        setExhibits([]);
      } finally {
        setLoading(false);
      }
    };

    getExhibits();
  }, [raidId]);

  // Update exhibit ID and description when exhibit type changes
  useEffect(() => {
    if (formData.exhibitType && exhibits.length > 0) {
      const selectedExhibit = exhibits.find(
        (exhibit) => exhibit.exhibitType === formData.exhibitType
      );

      if (selectedExhibit) {
        setFormData((prev) => ({
          ...prev,
          exhibitId: selectedExhibit.exhibitId,
          itemDescription: selectedExhibit.description || "",
        }));
      }
    } else {
      // Clear exhibitId and itemDescription if no exhibitType is selected
      setFormData((prev) => ({
        ...prev,
        exhibitId: "",
        itemDescription: "",
      }));
    }
  }, [formData.exhibitType, exhibits]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("externalSenderDetails.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        externalSenderDetails: {
          ...prev.externalSenderDetails,
          [field]: value,
        },
      }));
    } else if (name.startsWith("externalReceiverDetails.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        externalReceiverDetails: {
          ...prev.externalReceiverDetails,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const updateCurrentHolder = async (evidenceId, currentHolder) => {
    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_BASE_URL
        }/user/update-current-holder/${evidenceId}`,
        { currentHolder },
        {
          headers: {
            "x-access-key": import.meta.env.VITE_SECRET_ACCESS_KEY,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating current holder:", error);
      throw error;
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.consent) {
      toast.error("Please consent to the data protection policy");
      return;
    }

    if (!formData.purpose) {
      toast.error("Please enter purpose of handover");
      return;
    }

    if (!formData.itemDescription) {
      toast.error("Please enter item description");
      return;
    }

    if (!formData.fromSignature) {
      toast.error("Please provide your signature");
      return;
    }
    if (!formData.toSignature && formData.receiverType === "External") {
      // Only require toSignature if external receiver
      toast.error("Please provide recipient's signature");
      return;
    }
    if (!formData.receiverName && formData.receiverType === "Internal") {
      toast.error("Please select a receiver officer");
      return;
    }

    const isSenderExternal = formData.senderType === "External";
    const isReceiverExternal = formData.receiverType === "External";

    const selectedOfficer = officers.find(
      (officer) => officer.username === formData.receiverName
    );

    // Determine the current holder information (just the name)
    let currentHolder;
    if (isReceiverExternal) {
      currentHolder = formData.externalReceiverDetails.name;
    } else {
      currentHolder = formData.receiverName;
    }

    const custodyEntry = {
      handoverFrom: {
        userId: isSenderExternal ? null : currentOfficer?._id,
        username: isSenderExternal ? null : currentOfficer?.username,
        externalDetails: isSenderExternal
          ? formData.externalSenderDetails
          : null,
      },
      handoverTo: {
        userId: isReceiverExternal ? null : selectedOfficer?._id,
        username: isReceiverExternal ? null : selectedOfficer?.username,
        externalDetails: isReceiverExternal
          ? formData.externalReceiverDetails
          : null,
      },
      purpose: formData.purpose,
      digitalSignatures: {
        fromSignature: formData.fromSignature,
        toSignature: formData.toSignature || "Pending", // 'Pending' if internal handover, or required for external
      },
      timestamp: new Date().toISOString(),
      itemDescription: formData.itemDescription,
    };

    const payload = {
      raidId,
      exhibitType: formData.exhibitType,
      exhibitId: formData.exhibitId,
      custodyChain: [custodyEntry],
      itemDescription: formData.itemDescription, // Ensure this is also sent at the top level if needed by API
    };

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/handover/${raidId}`,
        payload,
        {
          headers: {
            "x-access-key": import.meta.env.VITE_SECRET_ACCESS_KEY,
          },
        }
      );

      // Then update the current holder with just the name
      const selectedExhibit = exhibits.find(
        (exhibit) => exhibit.exhibitId === formData.exhibitId
      );

      if (selectedExhibit) {
        await updateCurrentHolder(selectedExhibit._id, currentHolder);
      }

      toast.success("Handover recorded successfully!");
      navigate("/finished-raids");
    } catch (error) {
      console.error("Error submitting handover:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit handover record"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 py-4 px-2 sm:px-6 lg:px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">
            Evidence Chain of Custody
          </h1>
          <p className="text-amber-400 text-lg">
            Raid ID: <span className="font-mono text-amber-200">{raidId}</span>
          </p>
        </div>

        <div className="bg-zinc-800 border border-amber-600 rounded-xl shadow-2xl overflow-hidden p-2 sm:p-8 lg:p-10">
          <form onSubmit={handleFormSubmit} className="space-y-8">
            {/* Handover From Section */}
            <div className="border border-zinc-700 rounded-lg p-5">
              <h2 className="text-2xl font-bold text-white mb-5 pb-3 border-b border-zinc-700">
                Handover From
              </h2>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="senderType"
                    value="Internal"
                    checked={formData.senderType === "Internal"}
                    onChange={handleChange}
                    className="h-5 w-5 text-amber-500 border-zinc-600 focus:ring-amber-500 bg-zinc-700"
                  />
                  <span className="ml-3 text-gray-300 text-base">
                    Internal Officer (You)
                  </span>
                </label>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="senderType"
                    value="External"
                    checked={formData.senderType === "External"}
                    onChange={handleChange}
                    className="h-5 w-5 text-amber-500 border-zinc-600 focus:ring-amber-500 bg-zinc-700"
                  />
                  <span className="ml-3 text-gray-300 text-base">
                    External Party
                  </span>
                </label>
              </div>

              {formData.senderType === "Internal" ? (
                <div className="bg-zinc-700/60 p-5 rounded-lg border border-zinc-600">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Handover From
                  </label>
                  <div className="flex items-center text-lg text-white">
                    <svg
                      className="h-6 w-6 text-amber-400 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="font-semibold">
                      {currentOfficer?.username || "Loading..."}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-zinc-700/60 p-5 rounded-lg border border-zinc-600 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      label: "Name",
                      name: "externalSenderDetails.name",
                      type: "text",
                    },
                    {
                      label: "Department",
                      name: "externalSenderDetails.department",
                      type: "text",
                    },
                    {
                      label: "Designation",
                      name: "externalSenderDetails.designation",
                      type: "text",
                    },
                    {
                      label: "Contact",
                      name: "externalSenderDetails.contact",
                      type: "text",
                    },
                    {
                      label: "Email",
                      name: "externalSenderDetails.email",
                      type: "email",
                    },
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        name={field.name}
                        value={
                          formData.externalSenderDetails[
                            field.name.split(".")[1]
                          ]
                        }
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        required
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Exhibit Information */}
            <div className="border border-zinc-700 rounded-lg p-5">
              <h2 className="text-2xl font-bold text-white mb-5 pb-3 border-b border-zinc-700">
                Exhibit Information
              </h2>

              {exhibits.length > 0 ? (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Exhibit Type
                    </label>
                    <select
                      name="exhibitType"
                      value={formData.exhibitType}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select exhibit type</option>
                      {exhibits.map((exhibit) => (
                        <option key={exhibit._id} value={exhibit.exhibitType}>
                          {exhibit.exhibitType} (ID: {exhibit.exhibitId})
                        </option>
                      ))}
                    </select>
                  </div>

                  {formData.exhibitId && (
                    <div className="bg-zinc-700/60 p-5 rounded-lg border border-zinc-600 mb-6">
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Selected Exhibit Details
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-white">
                        <div>
                          <p className="text-xs text-amber-400 font-semibold">
                            Type
                          </p>
                          <p className="text-base">{formData.exhibitType}</p>
                        </div>
                        <div>
                          <p className="text-xs text-amber-400 font-semibold">
                            ID
                          </p>
                          <p className="text-base font-mono break-all">
                            {formData.exhibitId}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Item Description
                    </label>
                    <textarea
                      name="itemDescription"
                      value={formData.itemDescription}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      required
                      placeholder="Provide a detailed description of the exhibit..."
                    />
                  </div>
                </>
              ) : (
                <div className="bg-zinc-700/50 p-5 rounded-lg text-center text-gray-400 text-lg">
                  No exhibits available for this raid. Please add exhibits
                  first.
                </div>
              )}
            </div>

            {/* Handover To Section */}
            <div className="border border-zinc-700 rounded-lg p-5">
              <h2 className="text-2xl font-bold text-white mb-5 pb-3 border-b border-zinc-700">
                Handover To
              </h2>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="receiverType"
                    value="Internal"
                    checked={formData.receiverType === "Internal"}
                    onChange={handleChange}
                    className="h-5 w-5 text-amber-500 border-zinc-600 focus:ring-amber-500 bg-zinc-700"
                  />
                  <span className="ml-3 text-gray-300 text-base">
                    Internal Officer
                  </span>
                </label>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="receiverType"
                    value="External"
                    checked={formData.receiverType === "External"}
                    onChange={handleChange}
                    className="h-5 w-5 text-amber-500 border-zinc-600 focus:ring-amber-500 bg-zinc-700"
                  />
                  <span className="ml-3 text-gray-300 text-base">
                    External Party
                  </span>
                </label>
              </div>

              {formData.receiverType === "Internal" ? (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Select Receiving Officer
                  </label>
                  <select
                    name="receiverName"
                    value={formData.receiverName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select an officer</option>
                    {officers
                      .filter((o) => o._id !== currentOfficer?._id) // Don't show current officer as receiver
                      .map((officer) => (
                        <option key={officer._id} value={officer.username}>
                          {officer.username} ({officer.designation})
                        </option>
                      ))}
                  </select>
                </div>
              ) : (
                <div className="bg-zinc-700/60 p-5 rounded-lg border border-zinc-600 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      label: "Name",
                      name: "externalReceiverDetails.name",
                      type: "text",
                    },
                    {
                      label: "Department",
                      name: "externalReceiverDetails.department",
                      type: "text",
                    },
                    {
                      label: "Designation",
                      name: "externalReceiverDetails.designation",
                      type: "text",
                    },
                    {
                      label: "Contact",
                      name: "externalReceiverDetails.contact",
                      type: "text",
                    },
                    {
                      label: "Email",
                      name: "externalReceiverDetails.email",
                      type: "email",
                    },
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        name={field.name}
                        value={
                          formData.externalReceiverDetails[
                            field.name.split(".")[1]
                          ]
                        }
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        required
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Purpose */}
            <div className="border border-zinc-700 rounded-lg p-5">
              <h2 className="text-2xl font-bold text-white mb-5 pb-3 border-b border-zinc-700">
                Purpose of Handover
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1 sr-only">
                  Purpose of Handover
                </label>
                <textarea
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                  placeholder="Clearly state the reason for this evidence handover (e.g., for forensic analysis, transfer to custodian, etc.)..."
                />
              </div>
            </div>

            {/* Digital Signatures */}
            <div className="border border-zinc-700 rounded-lg p-5">
              <h2 className="text-2xl font-bold text-white mb-5 pb-3 border-b border-zinc-700">
                Digital Signatures
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Your Secure String (Initials)
                  </label>
                  <input
                    type="password"
                    name="fromSignature"
                    value={formData.fromSignature}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                    placeholder="Enter your unique digital signature"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Recipient Secure String (Initials)
                  </label>
                  <input
                    type="password"
                    name="toSignature"
                    value={formData.toSignature}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Recipient will enter their digital signature"
                    required={formData.receiverType === "External"} // Required only if receiver is external
                  />
                </div>
              </div>
            </div>

            {/* Consent */}
            <div className="pt-4">
              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleChange}
                  className="h-5 w-5 text-amber-500 border-zinc-600 rounded focus:ring-amber-500 bg-zinc-700 mt-1"
                  required
                />
                <span className="ml-3 text-sm text-gray-300">
                  I certify that all information provided in this form is
                  **accurate and complete** to the best of my knowledge. I
                  understand that **falsification of evidence records** may
                  result in severe disciplinary action and legal consequences.
                </span>
              </label>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate("/finished-raids")}
                className="w-full sm:w-auto px-8 py-3 bg-zinc-600 text-white font-semibold rounded-lg shadow-md hover:bg-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-800 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-900 font-bold rounded-lg shadow-lg hover:from-amber-400 hover:to-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-zinc-800 transition-all duration-200"
              >
                Submit Handover
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EvidenceHandover;
