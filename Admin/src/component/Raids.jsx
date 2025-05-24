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

        const allRaids = res.data.raids || [];
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
    navigate("/admin/planned-raid");
  };

  const renderRows = () =>
    raids.map((raid, idx) => {
      const rowProps = {
        raidId: raid._id,
        status: raid.status,
        culprit: raid.culprits?.[0]?.name || "N/A",
        address: raid.location?.address || "N/A",
        raidType: raid.raidType || "N/A",
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
        case "completed_approved":
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
    <div className="flex flex-col items-center min-h-[90vh] pt-20 pb-8 relative overflow-hidden bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgogIDxkZWZzPgogICAgPHBhdHRlcm4gaWQ9IndhdmUiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj4KICAgICAgPHBhdGggZD0iTTAgNTAgQzI1IDI1LCAyNSA3NSwgNTAgNTAgQzc1IDI1LCA3NSA3NSwgMTAwIDUwIiBzdHJva2U9IiNlMGYyZmUiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIgLz4KICAgICAgPHBhdGggZD0iTTAgMCBMMTAwIDAgTDEwMCAxMDAgTDAgMTAwIFoiIGZpbGw9IiNmOGZhZmMiIC8+CiAgICA8L3BhdHRlcm4+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjd2F2ZSkiIC8+Cjwvc3ZnPg==')]">
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-white/70 z-0"></div>

      {/* Content container */}
      <div className="relative z-10 w-4/5 mx-auto">
        <div className="bg-white rounded-xl shadow-lg border border-[#e2e8f0]">
          <div className="grid grid-cols-6 gap-4 bg-[#213448] p-4 font-semibold text-white sticky top-0 z-20">
            <div>Raid ID</div>
            <div>Culprit Name</div>
            <div>Address</div>
            <div>Raid Type</div>
            <div>Status</div>
          </div>

          <div className="max-h-[calc(100vh-250px)] overflow-y-auto no-scrollbar">
            {loading ? (
              <div className="p-4 text-center text-gray-600">Loading...</div>
            ) : raids.length === 0 ? (
              <div className="p-4 text-center text-gray-600">
                No raids found.
              </div>
            ) : (
              renderRows()
            )}
          </div>
        </div>
      </div>

      <button
        onClick={handleCreateRaid}
        className="fixed bottom-6 right-6 bg-[#213448] text-white px-6 py-3 rounded-full shadow-lg hover:bg-[#1a2a3a] transition-colors flex items-center gap-2 z-20"
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