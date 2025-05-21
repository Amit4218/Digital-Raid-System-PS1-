import React, { useState } from "react";
import raidImage1 from "../Images/Raid1.jpg";
import raidImage2 from "../Images/Raid2.jpg"; // Add a second image

const raids = [
  {
    image: raidImage1,
    date: "May 21, 2025",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque tincidunt, libero a malesuada bibendum.",
    label: "Excise Raid in Gangtok",
  },
  {
    image: raidImage2,
    date: "April 10, 2025",
    description:
      "Second raid details go here. This was an important crackdown on illegal substances in the rural areas.",
    label: "Excise Raid in Namchi",
  },
];

const RaidImages = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? raids.length - 1 : prev - 1));
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev === raids.length - 1 ? 0 : prev + 1));
  };

  const { image, date, description, label } = raids[currentIndex];

  return (
    <div className="relative w-[90%] mx-auto flex items-center justify-between">
      {/* Left Arrow Button */}
      <button
        onClick={goPrevious}
        className="text-3xl text-green-900 hover:text-green-700 transition duration-300 font-bold"
      >
        &larr;
      </button>

      {/* Main Card */}
      <div className="w-full mx-6 h-[400px] border border-green-900 rounded-2xl shadow-xl flex overflow-hidden bg-green-700">
        {/* Left - Image */}
        <div className="w-1/2 h-full">
          <img
            src={image}
            alt="Raid"
            className="w-full h-full object-cover transition-opacity duration-500"
          />
        </div>

        {/* Right - Details */}
        <div className="w-1/2 h-full text-white px-8 py-6 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-4 border-b border-green-300 pb-2">
            Raid Date: <span className="font-medium">{date}</span>
          </h2>
          <p className="text-lg leading-relaxed">
            <span className="font-semibold">Raid Details:</span> {description}
          </p>
        </div>
      </div>

      {/* Right Arrow Button */}
      <button
        onClick={goNext}
        className="text-3xl text-green-900 hover:text-green-700 transition duration-300 font-bold"
      >
        &rarr;
      </button>

      {/* Label below */}
      <div className="absolute bottom-[-3rem] left-1/2 transform -translate-x-1/2 w-full text-center">
        <div className="bg-green-100 text-green-900 text-lg font-medium py-2 px-4 rounded shadow-md inline-block w-3/4">
          {label}
        </div>
      </div>
    </div>
  );
};

export default RaidImages;
