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
    <div className="flex flex-col items-center min-h-screen bg-[#f8fafc] pt-20 pb-8 px-4">
      <div className="w-full max-w-7xl bg-white rounded-xl shadow-lg overflow-hidden border border-[#e2e8f0]">
        {/* Desktop Header */}
        <div className="hidden md:grid grid-cols-6 gap-4 bg-[#213448] p-4 font-semibold text-white text-sm">
          <div>Raid ID</div>
          <div>Culprit Name</div>
          <div>Address</div>
          <div>Raid Type</div>
          <div>Status</div>
          
        </div>

        {/* Raid List */}
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
                className={`px-4 py-4 ${
                  index % 2 === 0 ? "bg-white" : "bg-[#f8fafc]"
                }`}
              >
                {/* Desktop layout */}
                <div className="hidden md:grid grid-cols-6 gap-4">
                  <div className="font-medium text-[#213448]">{raid._id}</div>
                  <div className="text-[#213448]">
                    {raid.culprits?.length > 0
                      ? raid.culprits.map((c) => c.name).join(", ")
                      : "Unknown"}
                  </div>
                  <div className="text-[#213448]">
                    {raid.location?.address || "N/A"}
                  </div>
                  <div className="capitalize text-[#213448]">
                    {raid.raidType}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-3 h-3 bg-orange-500 rounded-full border-2 border-orange-600"></span>
                    <span className="text-sm font-semibold text-orange-600 capitalize">
                      {raid.status}
                    </span>
                  </div>
                  <div>
                    <button
                      onClick={() => handleReview(raid._id)}
                      className="bg-white border border-[#213448] text-[#213448] px-4 py-1 rounded-xl hover:bg-[#213448] hover:text-white transition-colors"
                    >
                      Review
                    </button>
                  </div>
                </div>

                {/* Mobile layout */}
                <div className="md:hidden text-[#213448] space-y-2 text-sm">
                  <div>
                    <span className="font-semibold">Raid ID:</span> {raid._id}
                  </div>
                  <div>
                    <span className="font-semibold">Culprit:</span>{" "}
                    {raid.culprits?.length > 0
                      ? raid.culprits.map((c) => c.name).join(", ")
                      : "Unknown"}
                  </div>
                  <div>
                    <span className="font-semibold">Address:</span>{" "}
                    {raid.location?.address || "N/A"}
                  </div>
                  <div>
                    <span className="font-semibold">Raid Type:</span>{" "}
                    {raid.raidType}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-3 h-3 bg-orange-500 rounded-full border-2 border-orange-600"></span>
                    <span className="text-sm font-semibold text-orange-600 capitalize">
                      {raid.status}
                    </span>
                  </div>
                  <div>
                    <button
                      onClick={() => handleReview(raid._id)}
                      className="w-full border border-[#213448] text-[#213448] px-4 py-2 rounded-lg hover:bg-[#213448] hover:text-white transition-colors"
                    >
                      Review
                    </button>
                  </div>
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
