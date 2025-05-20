import React from "react";
import Pending from "./status/Pending";
import Active from "./status/Active";
import Completed from "./status/Completed";
import Approved from "./status/Approved";
import { useNavigate } from "react-router-dom";

function Raids() {
  const navigate = useNavigate();
  const handleCreateRaid = () => {
    navigate("/admin/planned-raid");
  };

  return (
    <>
      <div className="flex flex-col items-center min-h-screen bg-[#f8fafc] pt-20 pb-8">
        <div className="w-4/5 mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-[#e2e8f0]">
          <div className="grid grid-cols-6 gap-4 bg-[#213448] p-4 font-semibold text-white">
            <div>Raid ID</div>
            <div>Culprit Name</div>
            <div>Address</div>
            <div>Raid Type</div>
            <div>Status</div>
          </div>

          <div className="divide-y divide-[#e2e8f0]">
            <Pending
              raidId="RAID-001"
              culprit="John Doe"
              address="123 Main St, City"
              type="Planned"
              className="hover:bg-[#f8fafc] even:bg-[#f8fafc] odd:bg-white"
            />
            <Active className="hover:bg-[#f8fafc] even:bg-[#f8fafc] odd:bg-white" />
            <Completed className="hover:bg-[#f8fafc] even:bg-[#f8fafc] odd:bg-white" />
            <Approved className="hover:bg-[#f8fafc] even:bg-[#f8fafc] odd:bg-white" />
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
    </>
  );
}

export default Raids;
