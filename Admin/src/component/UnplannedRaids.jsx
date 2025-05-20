import React from "react";
import { useNavigate } from "react-router-dom";

const UnplannedRaids = ({
  raids = [
    { raidId: "RaidId", culprit: "Suspect name", address: "Address" },
    { raidId: "RaidId", culprit: "Suspect name", address: "Address" },
  ],
}) => {
  const navigate = useNavigate();

  const handleReview = () => {
    navigate("/admin/unplanned-request");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#f8fafc] pt-20 pb-8 ">
      <div className="w-4/5 mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-[#e2e8f0]">
        {/* Header Row */}
        <div className="grid grid-cols-6 gap-4 bg-[#213448] p-4 font-semibold text-white">
          <div>Raid ID</div>
          <div>Culprit Name</div>
          <div>Address</div>
          <div>Raid Type</div>
          <div>Status</div>
          
        </div>

        {/* Raid Data */}
        <div className="divide-y divide-[#e2e8f0]">
          {raids.length === 0 ? (
            <p className="text-gray-500 text-center py-6">
              No unplanned raids found.
            </p>
          ) : (
            raids.map((raid, index) => (
              <div
                key={index}
                className={`grid grid-cols-6 gap-4 px-4 py-3 ${
                  index % 2 === 0 ? "bg-white" : "bg-[#f8fafc]"
                }`}
              >
                <div className="flex items-center font-medium text-[#213448]">
                  {raid.raidId}
                </div>
                <div className="flex items-center text-[#213448]">
                  {raid.culprit}
                </div>
                <div className="flex items-center text-[#213448]">
                  {raid.address}
                </div>
                <div className="flex items-center text-[#213448]">
                  Unplanned
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 bg-orange-500 rounded-full border-2 border-orange-600"></span>
                  <span className="text-sm font-semibold text-orange-600">
                    Pending
                  </span>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={handleReview}
                    className=" bg-white border border-[#213448] text-[#213448]  px-4 py-1 rounded-xl hover:bg-[#213448] hover:text-white transition-colors"
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
