import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PublicGrievance = () => {
  const [clicked, setClicked] = useState(false);
  const navigate = useNavigate();   

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => {
      setClicked(false);
      navigate("/public-sign-up"); 
    }, 300);
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
