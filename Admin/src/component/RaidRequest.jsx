import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const RaidRequest = () => {
  const { raidId } = useParams();
  const navigate = useNavigate();
  const [raid, setRaid] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRaids = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/user/get-all-raids`,
          {
            headers: {
              "x-access-key": import.meta.env.VITE_SECRET_ACCESS_KEY,
            },
          }
        );

        const filtered = res.data.raids.find((raid) => raid._id === raidId);
        setRaid(filtered);
      } catch (error) {
        console.error("Error fetching unplanned raids:", error);
        toast.error("Failed to fetch unplanned raids");
      } finally {
        setLoading(false);
      }
    };

    fetchRaids();
  }, [raidId]);

  const handleApprove = async () => {
    try {
      const userId = localStorage.getItem("userId"); // Get userId from local storage
      if (!userId) {
        toast.error("User ID not found in local storage");
        return;
      }

      const response = await axios.put(
        `${
          import.meta.env.VITE_BASE_URL
        }/admin/update-unplanned-request/${raidId}`,
        {
          approvedBy: userId,
          approvalStatus: "approved",
          approvalDate: new Date(),
        },
        {
          headers: {
            "x-access-key": import.meta.env.VITE_SECRET_ACCESS_KEY,
          },
        }
      );

      toast.success("Raid approved successfully!");
      navigate("/admin/unplannedRaids");
    } catch (error) {
      console.error("Error approving raid:", error);
      toast.error("Failed to approve raid");
    }
  };
  

  const handlePreview = () => {
    alert("Opening warrant: " + (raid?.warrant?.fileUrl || "No file"));
    // Or open in new tab
    // window.open(raid?.warrant?.fileUrl, '_blank');
  };

  const handleClose = () => {
    navigate("/admin/unplannedRaids");
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!raid) return <div className="p-6 text-red-600">Raid not found.</div>;

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6 relative">
        <div className="text-red-500 font-semibold">UNEDITABLE</div>
        <button
          onClick={handleClose}
          className="w-8 h-8 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white text-lg font-bold rounded-full absolute right-0 top-0"
          aria-label="Close"
        >
          &times;
        </button>
      </div>

      <div className="bg-white border border-[#213448] shadow-2xl rounded-xl p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Info
            label="Culprit Name"
            value={raid.culprits?.[0]?.name || "N/A"}
          />
          <Info
            label="Identification"
            value={raid.culprits?.[0]?.identification || "N/A"}
          />
          <Info
            label="Crime Description"
            value={raid.culprits?.[0]?.description || "N/A"}
            wide
          />
          <Info label="Raid Officer (In-Charge)" value={raid.inCharge} />
          <Info
            label="Raid Date"
            value={new Date(raid.scheduledDate).toLocaleDateString()}
          />
          <Info label="Address" value={raid.location?.address || "N/A"} wide />
          <Info label="Raid Description" value={raid.description} wide />
        </div>

        <div className="flex flex-col md:flex-row md:justify-between items-center gap-6 mt-4">
          <div className="flex gap-4">
            <button
              onClick={handlePreview}
              className="px-4 py-2 bg-[#213448] text-white font-bold rounded hover:bg-[#547792]"
            >
              Preview Warrant
            </button>
            <button
              onClick={handleApprove}
              className="bg-green-600 text-white font-bold px-6 py-2 rounded-md hover:bg-green-700"
            >
              Approve
            </button>
          </div>

          <button
            onClick={handleClose}
            className="bg-gray-300 text-[#213448] font-bold px-6 py-2 rounded-md hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value, wide }) => (
  <div className={wide ? "md:col-span-2" : ""}>
    <label className="block text-sm font-medium text-[#213448]">{label}</label>
    <div className="mt-1 block w-full border border-[#213448] rounded-md shadow-sm p-3 bg-gray-100 text-[#213448]">
      {value}
    </div>
  </div>
);

export default RaidRequest;
