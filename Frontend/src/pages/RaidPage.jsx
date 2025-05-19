import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";

function RaidPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [raids, setRaids] = useState([]);

  // Fetch all raids
  useEffect(() => {
    const getRaids = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/user/get-all-raids`,
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
      }
    };

    getRaids();
  }, []);

  function canStartRaid(raid) {
    if (raid.status === "completed" || raid.status === "active") {
      return false;
    }

    if (raid.isUnplannedRequest) {
      return raid.unplannedRequestDetails.approvalStatus === "approved";
    }

    return raid.status === "pending";
  }

  const handleStartRaid = (raidId) => {
    navigate("/permission", { state: { raidId } });
  };

  if (loading) return <Loading />;

  return (
    <>
      <Navbar />
      <div className="">
        <div className="bg-zinc-800 px-6 absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 border h-[80vh] w-[70vw]  border-amber-300 rounded-xl mt-10  min-h-[300px] text-white shadow-lg overflow-x-auto no-scrollbar">
          {/* Desktop Header (hidden on mobile) */}
          <div className=" p-4 bg-zinc-800 hidden border-t border-t-amber-300 md:grid grid-cols-12 sticky top-0 font-semibold border-b border-amber-200/50 mb-4 text-amber-200">
            <span className="col-span-3">Raid ID</span>
            <span className="col-span-2">Raid Incharge</span>
            <span className="col-span-2">Address</span>
            <span className="col-span-2">Raid Type</span>
            <span className="col-span-2">Status</span>
            <span className="col-span-1">Action</span>
          </div>

          {/* Content */}
          {!raids || raids.length === 0 ? (
            <div className="flex items-center justify-center text-gray-400 h-full">
              No raids found.
            </div>
          ) : (
            raids.map((raid, idx) => (
              <div
                key={raid._id || idx}
                className="flex flex-col md:grid md:grid-cols-12 gap-2 md:gap-4 border-b border-zinc-700/50 py-4 text-sm hover:bg-zinc-700/40 transition-colors last:border-b-0"
              >
                {/* Mobile view */}
                <div className="md:hidden space-y-2">
                  <div>
                    <span className="text-amber-200">ID: </span>
                    <span className="font-mono text-xs text-amber-100/80 break-all">
                      {raid._id || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-amber-200">Incharge: </span>
                    <span className="text-gray-300">
                      {raid.inCharge || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-amber-200">Address: </span>
                    <span className="text-gray-300">
                      {raid.location?.address || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-amber-200">Type: </span>
                    <span className="text-gray-300">
                      {Array.isArray(raid.raidType)
                        ? raid.raidType.join(", ")
                        : raid.raidType || "N/A"}
                    </span>
                  </div>
                </div>

                {/* Desktop view */}
                <span className="hidden md:block col-span-3 font-mono text-xs text-amber-100/80 break-all">
                  {raid._id || "N/A"}
                </span>
                <span className="hidden md:block col-span-2 text-gray-300 truncate">
                  {raid.inCharge || "N/A"}
                </span>
                <span className="hidden md:block col-span-2 text-gray-300 truncate">
                  {raid.location?.address || "N/A"}
                </span>
                <span className="hidden md:block col-span-2 text-gray-300 truncate">
                  {Array.isArray(raid.raidType)
                    ? raid.raidType.join(", ")
                    : raid.raidType || "N/A"}
                </span>

                {/* Status */}
                <span className="md:col-span-2 flex items-center">
                  <span
                    className={`inline-block px-2 py-[0.125rem] rounded-full text-xs font-medium ${
                      raid.status === "completed"
                        ? "bg-green-600/20 text-green-400"
                        : raid.status === "active"
                        ? "bg-amber-600/20 text-amber-400"
                        : "bg-red-600/20 text-red-400"
                    }`}
                  >
                    {raid.status || "unknown"}
                  </span>
                </span>

                {/* Action button */}
                <span className="md:col-span-1">
                  <button
                    onClick={() => handleStartRaid(raid._id)}
                    className={`w-full px-2 -ml-6 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      canStartRaid(raid)
                        ? "bg-amber-600/20 text-amber-400 hover:bg-amber-600/30"
                        : "bg-zinc-700/50 text-zinc-500 cursor-not-allowed"
                    }`}
                    disabled={!canStartRaid(raid)}
                  >
                    {raid.status === "active"
                      ? "In Progress"
                      : raid.status === "completed"
                      ? "Completed"
                      : "Start Raid"}
                  </button>
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default RaidPage;
