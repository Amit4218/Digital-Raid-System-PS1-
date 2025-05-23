import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const UnplannedRaids = () => {
  const navigate = useNavigate();
  const [raids, setRaids] = useState([]);
  const [loading, setLoading] = useState(true);

  const inCharge = localStorage.getItem("inCharge");

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

        const filtered = res.data.raids.filter(
          (raid) =>
            raid.unplannedRequestDetails?.approvalStatus === "pending" &&
            raid.raidType === "unplanned"
        );

        setRaids(filtered);
      } catch (error) {
        console.error("Error fetching unplanned raids:", error);
        toast.error("Failed to fetch unplanned raids");
      } finally {
        setLoading(false);
      }
    };

    fetchRaids();
  }, [inCharge]);

  const handleReview = (raidId) => {
    navigate(`/admin/unplanned-request/${raidId}`);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#f8fafc] pt-20 pb-8">
      <div className="w-4/5 mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-[#e2e8f0]">
        {/* Header */}
        <div className="grid grid-cols-6 gap-4 bg-[#213448] p-4 font-semibold text-white">
          <div>Raid ID</div>
          <div>Culprit Name</div>
          <div>Address</div>
          <div>Raid Type</div>
          <div>Status</div>
          <div>Action</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-[#e2e8f0]">
          {loading ? (
            <p className="text-gray-500 text-center py-6">Loading...</p>
          ) : raids.length === 0 ? (
            <p className="text-gray-500 text-center py-6">
              No unplanned raids found.
            </p>
          ) : (
            raids.map((raid, index) => (
              <div
                key={raid._id}
                className={`grid grid-cols-6 gap-4 px-4 py-3 ${
                  index % 2 === 0 ? "bg-white" : "bg-[#f8fafc]"
                }`}
              >
                <div className="flex items-center font-medium text-[#213448]">
                  {raid._id}
                </div>
                <div className="flex items-center text-[#213448]">
                  {raid.culprits?.length > 0
                    ? raid.culprits.map((c) => c.name).join(", ")
                    : "Unknown"}
                </div>
                <div className="flex items-center text-[#213448]">
                  {raid.location?.address || "N/A"}
                </div>
                <div className="flex items-center text-[#213448] capitalize">
                  {raid.raidType}
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 bg-orange-500 rounded-full border-2 border-orange-600"></span>
                  <span className="text-sm font-semibold text-orange-600 capitalize">
                    {raid.status}
                  </span>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => handleReview(raid._id)}
                    className="bg-white border border-[#213448] text-[#213448] px-4 py-1 rounded-xl hover:bg-[#213448] hover:text-white transition-colors"
                  >
                    Review
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UnplannedRaids;
