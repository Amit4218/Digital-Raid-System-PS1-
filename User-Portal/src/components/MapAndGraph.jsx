import React from "react";
import SikkimMap from "./Maps/SikkimMap";
import Graph from "./Graph/Graph";

const MapAndGraph = () => {
  return (
    <div className="flex flex-wrap justify-center gap-6 p-4">
      <Graph />
      <SikkimMap />
    </div>
  );
};

export default MapAndGraph;
