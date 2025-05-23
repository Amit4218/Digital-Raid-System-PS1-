import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import TokenValidator from "../utils/tokenValidator";
import HandoverTable from "../components/HandoverTable";

const FinishedRaids = () => {
  TokenValidator();
  const navigate = useNavigate();
  const [raids, setRaids] = useState([]);
  const [loading, setLoading] = useState(true);

  const inCharge = localStorage.getItem("inCharge");

  useEffect(() => {
    setLoading(true);
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
            raid.status === "completed_approved" &&
            raid.inchargeId?.toString() === localStorage.getItem("userId")
        );

        setRaids(filtered);
        setTimeout(() => {
          setLoading(false);
        }, 400);
      } catch (error) {
        console.error("Error fetching completed raids:", error);
        toast.error("Failed to fetch completed raids");
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 400);
      }
    };

    fetchRaids();
  }, [inCharge]);

  const handleHandover = (raidId) => {
    toast.info(`Handover for raid ID: ${raidId} not implemented yet.`);
    navigate(`/handover/${raidId}`);
  };

  if (loading) return <Loading />;

  return (
    <div>
      <Navbar />
      <div className="bg-zinc-800 px-6  mx-auto border max-h-[80vh] w-[80vw] border-amber-300 rounded-xl mt-40 min-h-[300px] text-white shadow-lg overflow-auto no-scrollbar">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 sticky top-0 border-b border-amber-300 font-semibold text-amber-200 text-sm select-none py-3 px-2">
          <div className="col-span-3 truncate">Raid ID</div>
          <div className="col-span-2 truncate">Incharge</div>
          <div className="col-span-2 truncate">Address</div>
          <div className="col-span-2 truncate">Raid Type</div>
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-2 text-center">Handover</div>
        </div>

        {/* Table Content */}
        {raids.length === 0 ? (
          <div className="flex items-center justify-center text-gray-400 h-[40vh]">
            No completed raids found for you.
          </div>
        ) : (
          raids.map((raid, idx) => (
            <div
              key={raid._id || idx}
              className="flex flex-col md:grid md:grid-cols-12 gap-2 md:gap-4 border-b border-zinc-700/50 py-3 px-2 text-sm hover:bg-zinc-700/40 transition-colors last:border-b-0"
            >
              {/* Desktop view */}
              <div className="hidden md:block col-span-3 font-mono text-xs text-amber-100/80 truncate">
                {raid._id}
              </div>
              <div className="hidden md:block col-span-2 text-gray-300 truncate">
                {raid.inCharge || "N/A"}
              </div>
              <div className="hidden md:block col-span-2 text-gray-300 truncate">
                {raid.location?.address || "N/A"}
              </div>
              <div className="hidden md:block col-span-2 text-gray-300 truncate">
                {Array.isArray(raid.raidType)
                  ? raid.raidType.join(", ")
                  : raid.raidType || "N/A"}
              </div>
              <div className="md:col-span-1 flex items-center justify-center">
                <span className="inline-block px-2 py-[0.125rem] rounded-full text-xs font-medium bg-green-600/20 text-green-400 whitespace-nowrap">
                  {raid.status}
                </span>
              </div>

              {/* Handover button */}
              <div className="md:col-span-2  flex justify-center ">
                <button
                  onClick={() => handleHandover(raid._id)}
                  className="w-full md:w-auto px-3 py-1.5 rounded-md text-xs font-medium bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 transition-colors"
                >
                  Handover
                </button>
              </div>

              {/* Mobile view summary */}
              <div className="md:hidden flex flex-col gap-1 text-xs text-gray-300 mt-2">
                <div>
                  <strong>Raid ID:</strong> {raid._id}
                </div>
                <div>
                  <strong>Incharge:</strong> {raid.inCharge || "N/A"}
                </div>
                <div>
                  <strong>Address:</strong> {raid.location?.address || "N/A"}
                </div>
                <div>
                  <strong>Raid Type:</strong>{" "}
                  {Array.isArray(raid.raidType)
                    ? raid.raidType.join(", ")
                    : raid.raidType || "N/A"}
                </div>
                <div>
                  <strong>Status:</strong>{" "}
                  <span className="inline-block px-2 py-[0.125rem] rounded-full text-xs font-medium bg-green-600/20 text-green-400">
                    {raid.status}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <HandoverTable/>
    </div>
  );
};

export default FinishedRaids;
