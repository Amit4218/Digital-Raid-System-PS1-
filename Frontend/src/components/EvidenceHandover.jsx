import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

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

        console.log("API Response:", res.data);

        // Access the evidence array from the response
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

  // Update exhibit ID when exhibit type changes
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

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validation
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

    const isSenderExternal = formData.senderType === "External";
    const isReceiverExternal = formData.receiverType === "External";

    const selectedOfficer = officers.find(
      (officer) => officer.username === formData.receiverName
    );

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
        toSignature: formData.toSignature || "Pending",
      },
      timestamp: new Date().toISOString(),
      itemDescription: formData.itemDescription,
    };

    // Prepare payload
    const payload = {
      raidId,
      exhibitType: formData.exhibitType,
      exhibitId: formData.exhibitId,
      custodyChain: [custodyEntry], // Send as array with the entry
      itemDescription: formData.itemDescription,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/handover/${raidId}`,
        payload,
        {
          headers: {
            "x-access-key": import.meta.env.VITE_SECRET_ACCESS_KEY,
          },
        }
      );

      toast.success("Handover recorded successfully!");
      navigate("/finished-raids");
    } catch (error) {
      console.error("Error submitting handover:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit handover record"
      );
    }
  };

  return (
    <div className="w-[80vw] bg-slate-600 h-auto mx-auto mt-20 rounded-lg p-5">
      <div>
        <h1 className="text-2xl text-center font-semibold text-gray-300 mb-4">
          Evidence Handover Form
        </h1>
      </div>
      <form onSubmit={handleFormSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Handover From Section */}
          <div className="md:col-span-2">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Handover From
            </label>
            <div className="flex gap-10 items-center mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="senderType"
                  value="Internal"
                  checked={formData.senderType === "Internal"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Internal Officer
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="senderType"
                  value="External"
                  checked={formData.senderType === "External"}
                  onChange={handleChange}
                  className="mr-2"
                />
                External Party
              </label>
            </div>
          </div>

          {formData.senderType === "Internal" ? (
            <div className="md:col-span-2">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Handover From (You)
              </label>
              <input
                type="text"
                value={currentOfficer?.username || "Loading..."}
                className="py-3 px-4 bg-[#3a4e66] border border-[#4a607a] rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none w-full text-white"
                readOnly
              />
            </div>
          ) : (
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="externalSenderDetails.name"
                    value={formData.externalSenderDetails.name}
                    onChange={handleChange}
                    className="py-3 px-4 bg-[#3a4e66] border border-[#4a607a] rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none w-full text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    name="externalSenderDetails.department"
                    value={formData.externalSenderDetails.department}
                    onChange={handleChange}
                    className="py-3 px-4 bg-[#3a4e66] border border-[#4a607a] rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none w-full text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Designation
                  </label>
                  <input
                    type="text"
                    name="externalSenderDetails.designation"
                    value={formData.externalSenderDetails.designation}
                    onChange={handleChange}
                    className="py-3 px-4 bg-[#3a4e66] border border-[#4a607a] rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none w-full text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Contact
                  </label>
                  <input
                    type="text"
                    name="externalSenderDetails.contact"
                    value={formData.externalSenderDetails.contact}
                    onChange={handleChange}
                    className="py-3 px-4 bg-[#3a4e66] border border-[#4a607a] rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none w-full text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="externalSenderDetails.email"
                    value={formData.externalSenderDetails.email}
                    onChange={handleChange}
                    className="py-3 px-4 bg-[#3a4e66] border border-[#4a607a] rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none w-full text-white"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="py-3 px-4 bg-[#3a4e66] rounded-md text-white">
              Loading exhibit data...
            </div>
          ) : exhibits.length > 0 ? (
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Exhibit Type
              </label>
              <select
                name="exhibitType"
                value={formData.exhibitType}
                onChange={handleChange}
                className="py-3 px-4 bg-[#3a4e66] border border-[#4a607a] rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none w-full text-white"
                required
              >
                <option value="">Select exhibit type</option>
                {exhibits.map((exhibit) => (
                  <option key={exhibit._id} value={exhibit.exhibitType}>
                    {exhibit.exhibitType} (ID: {exhibit.exhibitId})
                  </option>
                ))}
              </select>

              {formData.exhibitId && (
                <div className="mt-4 ">
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Exhibit Details
                  </label>
                  <div className="bg-[#3a4e66] p-4 rounded-md">
                    <p className="text-white">Type: {formData.exhibitType}</p>
                    <p className="text-white">ID: {formData.exhibitId}</p>
                    <p className="text-white"></p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-3 px-4 bg-[#3a4e66] rounded-md text-white">
              No exhibits available for this raid
            </div>
          )}

          <div className="md:col-span-2">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Item Description
            </label>
            <textarea
              name="itemDescription"
              value={formData.itemDescription}
              onChange={handleChange}
              rows={3}
              className="py-3 px-4 bg-[#3a4e66] border border-[#4a607a] rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none w-full text-white"
              required
            ></textarea>
          </div>

          {/* Handover To Section */}
          <div className="md:col-span-2">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Handover To
            </label>
            <div className="flex gap-10 items-center mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="receiverType"
                  value="Internal"
                  checked={formData.receiverType === "Internal"}
                  onChange={handleChange}
                  className="mr-2"
                />
                Internal Officer
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="receiverType"
                  value="External"
                  checked={formData.receiverType === "External"}
                  onChange={handleChange}
                  className="mr-2"
                />
                External Party
              </label>
            </div>
          </div>

          {formData.receiverType === "Internal" ? (
            <div className="md:col-span-2">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Select Officer
              </label>
              <select
                name="receiverName"
                value={formData.receiverName}
                onChange={handleChange}
                className="py-3 px-4 bg-[#3a4e66] border border-[#4a607a] rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none w-full text-white"
                required
              >
                <option value="">Select officer</option>
                {officers
                  .filter((o) => o._id !== currentOfficer?._id)
                  .map((officer) => (
                    <option key={officer._id} value={officer.username}>
                      {officer.username}
                    </option>
                  ))}
              </select>
            </div>
          ) : (
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="externalReceiverDetails.name"
                    value={formData.externalReceiverDetails.name}
                    onChange={handleChange}
                    className="py-3 px-4 bg-[#3a4e66] border border-[#4a607a] rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none w-full text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    name="externalReceiverDetails.department"
                    value={formData.externalReceiverDetails.department}
                    onChange={handleChange}
                    className="py-3 px-4 bg-[#3a4e66] border border-[#4a607a] rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none w-full text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Designation
                  </label>
                  <input
                    type="text"
                    name="externalReceiverDetails.designation"
                    value={formData.externalReceiverDetails.designation}
                    onChange={handleChange}
                    className="py-3 px-4 bg-[#3a4e66] border border-[#4a607a] rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none w-full text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Contact
                  </label>
                  <input
                    type="text"
                    name="externalReceiverDetails.contact"
                    value={formData.externalReceiverDetails.contact}
                    onChange={handleChange}
                    className="py-3 px-4 bg-[#3a4e66] border border-[#4a607a] rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none w-full text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="externalReceiverDetails.email"
                    value={formData.externalReceiverDetails.email}
                    onChange={handleChange}
                    className="py-3 px-4 bg-[#3a4e66] border border-[#4a607a] rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none w-full text-white"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Purpose */}
          <div className="md:col-span-2">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Purpose of Handover
            </label>
            <textarea
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              rows={3}
              className="py-3 px-4 bg-[#3a4e66] border border-[#4a607a] rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none w-full text-white"
              required
            ></textarea>
          </div>

          {/* Digital Signatures */}
          <div className="md:col-span-2">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Giver Secure String (Initials)
            </label>
            <input
              type="password"
              name="fromSignature"
              value={formData.fromSignature}
              onChange={handleChange}
              className="py-3 px-4 bg-[#3a4e66] border border-[#4a607a] rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none w-full text-white"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Reciver Secure String (Initials)
            </label>
            <input
              type="password"
              name="toSignature"
              value={formData.toSignature}
              onChange={handleChange}
              className="py-3 px-4 bg-[#3a4e66] border border-[#4a607a] rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none w-full text-white"
              required
            />
          </div>

          {/* Consent */}
          <div className="md:col-span-2 text-center">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="consent"
                checked={formData.consent}
                onChange={handleChange}
                className="mr-2"
                required
              />
              <span className="text-gray-300 text-sm font-medium">
                I certify that the information provided is accurate
              </span>
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col items-center justify-center gap-8 mt-8 md:flex-row">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit Handover
          </button>
          <button
            type="button"
            onClick={() => navigate("/finished-raids")}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EvidenceHandover;
