import React, { useState } from "react";
import PublicGrievanceSignUp from "../PublicGrievanceSignUp";




const PublicGrievance = () => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 300); 

 
    console.log("Public grievance button clicked");
  };

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-2 rounded-md transition duration-200 border border-white text-white bg-lime-700 ${
        clicked ? "animate-bounce-once" : ""
      }`}
    >
      Public Grievance
    </button>
  );
};

export default PublicGrievance;
