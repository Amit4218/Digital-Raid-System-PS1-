import React from "react";

const Completed = ({
  raidId = "Raid ID",
  culprit = "Culprit name",
  address = "Address",
  type = "Planned",
}) => {
  return (
    <>
      <div className="bg-[#213448]  text-white shadow-md rounded-lg p-4 m-4 ">
        <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="font-semibold">{raidId}</span>
          </div>

          <div className="flex flex-col">
            <span className="font-semibold">{culprit}</span>
          </div>

          <div className="flex flex-col">
            <span className="font-semibold">{address}</span>
          </div>

          <div className="flex flex-col">
            <span className="font-semibold">{type}</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative w-5 h-5">
              <div className="absolute inset-0 rounded-full border-2 border-[#10B981]"></div>
              <div className="absolute inset-1 rounded-full bg-[#10B981]"></div>
            </div>
          </div>

          <button className="bg-white text-[#213448] shadow-2xl font-semibold px-4 py-1 rounded-full hover:bg-blue-600 text-sm">
            Review
          </button>
        </div>
      </div>

      <div>
        <button className="bg-[#213448] text-white p-2 rounded-xl  fixed bottom-4 right-4">
          Create new raid
        </button>
      </div>
    </>
  );
};

export default Completed;
