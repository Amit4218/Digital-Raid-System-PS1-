import React, { useEffect, useState } from "react";
import Pending from "./status/Pending";
import Active from "./status/Active";
import Completed from "./status/Completed";
import Approved from "./status/Approved";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function Raids() {
  const navigate = useNavigate();
  const [raids, setRaids] = useState([]);
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

        const allRaids = res.data.raids || [];

        // Exclude unplanned raids with pending approval
        const filtered = allRaids.filter(
          (raid) =>
            !(
              raid.raidType === "unplanned" &&
              raid.unplannedRequestDetails?.approvalStatus === "pending"
            )
        );

        setRaids(filtered);
      } catch (error) {
        console.error("Error fetching raids:", error);
        toast.error("Failed to fetch raids");
      } finally {
        setLoading(false);
      }
    };

    fetchRaids();
  }, []);

  const handleCreateRaid = () => {
    navigate("/admin/planned-raid"); // for creating new raid, no ID needed
  };

  const renderRows = () =>
    raids.map((raid, idx) => {
      const rowProps = {
        raidId: raid._id,
        status: raid.status,
        // culprit: raid.culprits?.[0]?.name || "N/A",
        address: raid.location?.address || "N/A",
        // type: raid.raidType || "N/A",
        className: `hover:bg-[#f8fafc] cursor-pointer ${
          idx % 2 === 0 ? "even:bg-[#f8fafc]" : "odd:bg-white"
        }`,
      };

      let StatusComponent;

      switch (raid.status) {
        case "pending":
          StatusComponent = Pending;
          break;
        case "active":
          StatusComponent = Active;
          break;
        case "completed":
          StatusComponent = Completed;
          break;
        case "approved":
          StatusComponent = Approved;
          break;
        default:
          return null;
      }

      return (
        <Link to={`/admin/${raid.status}/${raid._id}`} key={raid._id}>
          <StatusComponent {...rowProps} />
        </Link>
      );
    });

  return (
    <div className="flex flex-col items-center max-h-[90vh] bg-[#f8fafc] pt-20 pb-8">
      <div className="w-4/5 mx-auto bg-white rounded-xl shadow-lg overflow-y-scroll no-scrollbar border border-[#e2e8f0]">
        <div className="grid grid-cols-6 gap-4 bg-[#213448] p-4 font-semibold text-white">
          <div>Raid ID</div>
          <div>Culprit Name</div>
          <div>Address</div>
          <div>Raid Type</div>
          <div>Status</div>
        </div>

        <div className="divide-y divide-[#e2e8f0]">
          {loading ? (
            <div className="p-4 text-center text-gray-600">Loading...</div>
          ) : raids.length === 0 ? (
            <div className="p-4 text-center text-gray-600">No raids found.</div>
          ) : (
            renderRows()
          )}
        </div>
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
  );
}

export default Raids;
