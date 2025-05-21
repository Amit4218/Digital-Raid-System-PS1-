import React from "react";

const Heatmap = () => {
  return (
    <div className="w-[82%] mx-auto">
      {/* Main Heatmap Box */}
      <div className="w-full h-[500px] border border-green-900 rounded-2xl shadow-xl bg-white flex items-center justify-center">
        {/* Empty Content Area for Heatmap */}
        <div className="text-green-700 font-semibold">
          Heatmap will be displayed here
        </div>
      </div>

      {/* Label Below */}
      <div className="mt-4 bg-green-100 text-center text-lg font-medium py-2 rounded shadow-md">
        Geographic Hotspots in Sikkim
      </div>
    </div>
  );
};

export default Heatmap;
