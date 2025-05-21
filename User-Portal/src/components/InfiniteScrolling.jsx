import React, { useEffect, useRef } from "react";

// Images imports (your images)
import img1 from "../Images/link1.png";
import img2 from "../Images/link2.png";
import img3 from "../Images/link3.png";
import img4 from "../Images/link4.png";
import img5 from "../Images/link5.png";
import img6 from "../Images/link6.png";
import img7 from "../Images/link7.png";
import img8 from "../Images/link8.png";
import img9 from "../Images/link9.png";
import img10 from "../Images/link10.png";
import img11 from "../Images/link11.png";
import img12 from "../Images/link12.png";

const images = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  img9,
  img10,
  img11,
  img12,
];

const links = [
  "https://excise.sikkim.gov.in/UserLogIn/Login.aspx",
  "https://excise.sikkim.gov.in/public_License_Application/PLA_quick_tips.aspx",
  "https://excise.sikkim.gov.in/public_License_Application/PLA_Application_Status.aspx",
  "https://excise.sikkim.gov.in/UserLogIn/Login.aspx",
  "https://excise.sikkim.gov.in/UserLogIn/Login.aspx",
  "https://excise.sikkim.gov.in/UserLogIn/Login.aspx",
  "https://excise.sikkim.gov.in/UserLogIn/Login.aspx",
  "https://excise.sikkim.gov.in/UserLogIn/Login.aspx",
  "https://excise.sikkim.gov.in/UserLogIn/Login.aspx",
  "https://excise.sikkim.gov.in/UserLogIn/Login.aspx",
  "https://excise.sikkim.gov.in/UserLogIn/Login.aspx",
  "https://excise.sikkim.gov.in/Retail_Map/Page/Retail_Map_Show.aspx",
];

const InfiniteScrolling = () => {
  const scrollRef = useRef(null);
  const animationRef = useRef(null);
  const isHoveredRef = useRef(false); // track hover state
  const scrollAmountRef = useRef(0);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    const speed = 1.5;

    if (!scrollContainer) return;

    scrollContainer.scrollLeft = 0;
    scrollAmountRef.current = 0;

    const step = () => {
      if (!scrollContainer) return;

      if (!isHoveredRef.current) {
        scrollAmountRef.current += speed;

        if (scrollAmountRef.current >= scrollContainer.scrollWidth / 2) {
          scrollAmountRef.current = 0;
        }

        scrollContainer.scrollLeft = scrollAmountRef.current;
      }

      animationRef.current = requestAnimationFrame(step);
    };

    animationRef.current = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  const duplicatedImages = [...images, ...images];
  const duplicatedLinks = [...links, ...links];

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
  };

  return (
    <div className="w-full select-none border-t border-green-500 pt-6 py-6">
      <div
        ref={scrollRef}
        className="flex space-x-6"
        style={{
          width: "100%",
          maxWidth: "100vw",
          overflowX: "hidden",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {duplicatedImages.map((src, index) => (
          <a
            key={index}
            href={duplicatedLinks[index]}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0"
          >
            <img
              src={src}
              alt={`circle-${index}`}
              className="rounded-full w-32 h-32 object-cover cursor-pointer"
              draggable={false}
            />
          </a>
        ))}
      </div>

      {/* Label below */}
      <div className="mt-6 bg-green-100 text-center text-lg font-medium py-2 rounded shadow-md">
        E-SERVICES
      </div>
    </div>
  );
};

export default InfiniteScrolling;
