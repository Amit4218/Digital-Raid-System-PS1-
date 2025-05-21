import React from "react";
import raidImage from "../Images/Raid1.jpg"; // Replace with your actual image path

const RaidImages = () => {
  return (
    <div className="w-[90%] h-[400px]  border border-green-900 rounded-2xl shadow-xl flex mx-auto overflow-hidden">
      {/* Left side - Image */}
      <div className="w-1/2 h-full">
        <img
          src={raidImage}
          alt="Raid"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right side - Details */}
      <div className="w-1/2 h-full text-black    px-8 py-6 flex flex-col justify-center">
        <h2 className="text-2xl font-bold mb-4 border-b border-green-300 pb-2">
          Raid Date: <span className="font-medium">May 21, 2025</span>
        </h2>
        <p className="text-lg leading-relaxed">
          <span className="font-semibold">Raid Details:</span> Lorem ipsum dolor
          sit amet, consectetur adipiscing elit. Quisque tincidunt, libero a
          malesuada bibendum, arcu sapien tempor nisl, a ullamcorper sem velit
          nec velit. Integer nec sem nec justo tincidunt mattis.
        </p>
      </div>
    </div>
  );
};

export default RaidImages;
