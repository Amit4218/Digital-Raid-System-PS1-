import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function Raid() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [raids, setRaids] = useState([]);

  // Fetch all raids
  useEffect(() => {
    const getRaids = async () => {
      setLoading(true); // Set loading to true when fetching starts
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin/getRaids`,
          {
            headers: {
              "x-access-key": import.meta.env.VITE_SECRET_ACCESS_KEY,
            },
          }
        );
        setRaids(res.data.raids);
      } catch (error) {
        console.error("Error fetching raids:", error);
        toast.error("Failed to fetch raids");
      } finally {
        setLoading(false); // Set loading to false when fetching ends (success or error)
      }
    };

    getRaids();
  }, []);

  function canStartRaid(raid) {
    // Check if it's an unplanned request and approved
    if (raid.isUnplannedRequest) {
      return raid.unplannedRequestDetails?.approvalStatus === "approved";
    }
    // For planned raids, or if not an unplanned request, check status
    return raid.status === "pending";
  }

  const handleStartRaid = (raidId) => {
    navigate("/pending-review", { state: { raidId } });
  };

  // Helper function to get status dot color
  const getStatusDotColor = (raid) => {
    // Prioritize unplanned request status if it's an unplanned request
    if (raid.status)
      // Fallback to raid status if not an unplanned request or status is missing
      switch (raid.status) {
        case "pending":
          return "bg-orange-500";
        case "active":
          return "bg-blue-500";
        case "completed":
          return "bg-green-500";
        default:
          return "bg-green-900";
      }
  };

  const handleCreateRaid = () => {
    navigate("/admin/planned-raid");
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="w-[85vw] mx-auto p-4 space-y-4">
          {/* Header Row */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-[#292D32] text-gray-400 font-semibold text-sm border-b border-gray-700">
            <span className="flex-1">Raid ID</span>
            <span className="flex-1">Raid Incharge</span>
            <span className="flex-1">Address</span>
            <span className="flex-1">Raid Type</span>
            <span className="w-1/12 text-center">Status</span>{" "}
            {/* Centered for the dot */}
            <span className="w-1/6 text-right">Action</span>{" "}
            {/* Right aligned for the button */}
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center text-gray-400 h-full py-10">
              Loading raids...
            </div>
          ) : !raids || raids.length === 0 ? (
            <div className="flex items-center justify-center text-gray-400 h-full py-10">
              No raids found.
            </div>
          ) : (
            raids.map(
              (
                raid // Removed idx as key as _id is stable
              ) => (
                <div
                  key={raid._id}
                  className="flex items-center justify-between p-4 rounded-lg bg-[#292D32] shadow-xl text-white border border-transparent hover:border-gray-700 transition-all duration-200"
                >
                  {/* Raid ID */}
                  <span className="flex-1 font-mono text-sm text-gray-300">
                    {raid._id?.slice(-8) || "N/A"}
                  </span>
                  {/* Incharge */}
                  <span className="flex-1 text-sm text-gray-300">
                    {raid.inCharge || "N/A"}
                  </span>
                  {/* Address */}
                  <span className="flex-1 text-sm text-gray-300">
                    {raid.location?.address || "N/A"}
                  </span>
                  {/* Raid Type */}
                  <span className="flex-1 text-sm text-gray-300">
                    {Array.isArray(raid.raidType)
                      ? raid.raidType.join(", ")
                      : raid.raidType || "N/A"}
                  </span>

                  {/* Status dot */}
                  <div className="flex items-center justify-center w-1/12">
                    <span
                      className={`h-3 w-3 rounded-full ${getStatusDotColor(
                        raid
                      )}`}
                    ></span>
                  </div>

                  {/* Action button */}
                  <div className="w-1/6 flex justify-end">
                    <button
                      onClick={() => handleStartRaid(raid._id)}
                      className="px-6 py-2 rounded-md bg-[#292D32] text-white border border-gray-600 hover:bg-gray-700 transition-colors duration-200 text-sm font-semibold"
                      disabled={!canStartRaid(raid)}
                    >
                      Review
                    </button>
                  </div>
                </div>
              )
            )
          )}
        </div>
        <button
          onClick={handleCreateRaid}
          className="fixed bottom-6 right-6 bg-[#213448] text-white px-6 py-3 rounded-full shadow-lg hover:bg-[#1a2a3a] transition-colors flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Create New Raid
        </button>
      </div>
    </>
  );
}

export default Raid;
