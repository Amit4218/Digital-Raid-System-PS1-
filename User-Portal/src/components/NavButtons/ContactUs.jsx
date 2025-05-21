import React, { useState } from "react";

const ContactUs = () => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 300); // Reset animation after a short delay
  };

  return (
    <a
      href="https://excise.sikkim.gov.in/CommonUser/Portal_New_TelephoneDisplay.aspx"
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`px-4 py-2 rounded-md transition duration-200 border border-white text-white bg-lime-700 inline-block ${
        clicked ? "animate-bounce-once" : ""
      }`}
    >
      Contact Us
    </a>
  );
};

export default ContactUs;
