import React, { useState } from "react";

const RightToInformation = () => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 300); // Reset after animation
  };

  return (
    <a
      href="https://excise.sikkim.gov.in/CommonUser/Portal_New_rti_act.aspx"
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`px-4 py-2 rounded-md transition duration-200 border border-white text-white bg-lime-700 inline-block ${
        clicked ? "animate-bounce-once" : ""
      }`}
    >
      Right to Information
    </a>
  );
};

export default RightToInformation;
