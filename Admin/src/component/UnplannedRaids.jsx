import React from "react";
import { useNavigate } from "react-router-dom";

const UnplannedRaids = ({
  raids = [
    { raidId: "RaidId", culprit: "Suspect name", address: "Address" },
    { raidId: "RaidId", culprit: "Suspect name", address: "Address" },
  ],
}) => {
  const navigate = useNavigate()
  const handleReview =()=>{
    navigate('/admin/unplanned-request')
  }
  return (
    <div className="p-4">
      {raids.length === 0 ? (
        <p className="text-gray-500 text-center">No unplanned raids found.</p>
      ) : (
        raids.map((raid, index) => (
          <div
            key={index}
            className="bg-[#213448] text-white shadow-md rounded-lg p-4 m-4"
          >
            <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="font-semibold">{raid.raidId}</span>
              </div>

              <div className="flex flex-col">
                <span className="font-semibold">{raid.culprit}</span>
              </div>

              <div className="flex flex-col">
                <span className="font-semibold">{raid.address}</span>
              </div>

              <div className="flex flex-col"> 
                <span className="font-semibold">Unplanned</span>
              </div>

              <button
              onClick={handleReview}
              className="bg-white text-[#213448] shadow-2xl font-semibold px-4 py-1 rounded-full hover:bg-blue-600 text-sm">
                Review
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default UnplannedRaids;
