import React from "react";
import SikkimMap from "./Maps/SikkimMap";
import Graph from "./Graph/Graph";

const MapAndGraph = () => {
  return (
    <div className="flex flex-row items-center justify-center gap-8 p-4">
      {/* Graph Section */}
      <div className="flex flex-col items-center">
        <Graph />
        <p className="mt-2 text-center text-gray-700 text-sm md:text-base font-medium bg-blue-100 px-4 py-2 rounded-md shadow w-full">
          Statistical data representation over time.
        </p>
      </div>

      {/* Map Section */}
      <div className="flex flex-col items-center">
        <SikkimMap />
        <p className="mt-2 text-center text-gray-700 text-sm md:text-base font-medium bg-green-100 px-4 py-2 rounded-md shadow w-full">
          Geographic distribution across Sikkim.
        </p>
      </div>
    </div>
  );
};

export default MapAndGraph;
