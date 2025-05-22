import React from "react";
import Heatmap from "./Heatmap";
import RaidStatusGraph from "./graphs/RaidStatusGraph";
import TokenValidator from "../utils/tokenValidator";

const Dashboard = () => {
  TokenValidator();
  return (
    <div className="w-[100vw] h-[93vh] p-10 flex justify-between items-center">
      <div className="w-[40vw] h-full flex flex-col gap-5 p-10">
        <div className="w-full h-[40vh]">
          <RaidStatusGraph />
        </div>
        <div className="w-full h-[40vh] bg-blue-400"></div>
      </div>
      <div className="w-[55vw] h-auto p-10  bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl mb-5 font-bold ">
          Approved Raids Heatmap / Hotspots
        </h1>
        <Heatmap />
      </div>
    </div>
  );
};

export default Dashboard;
