import React, { useEffect, useRef } from "react";

// Import images
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
  "https://excise.sikkim.gov.in/UserLogIn/Login.aspx", // img1
  "https://excise.sikkim.gov.in/public_License_Application/PLA_quick_tips.aspx", // img2
  "https://excise.sikkim.gov.in/public_License_Application/PLA_Application_Status.aspx", // img3
  "https://excise.sikkim.gov.in/UserLogIn/Login.aspx", // img4
  "https://excise.sikkim.gov.in/UserLogIn/Login.aspx", // img5
  "https://excise.sikkim.gov.in/UserLogIn/Login.aspx", // img6
  "https://excise.sikkim.gov.in/UserLogIn/Login.aspx", // img7
  "https://excise.sikkim.gov.in/UserLogIn/Login.aspx", // img8
  "https://excise.sikkim.gov.in/UserLogIn/Login.aspx", // img9
  "https://excise.sikkim.gov.in/UserLogIn/Login.aspx", // img10
  "https://excise.sikkim.gov.in/UserLogIn/Login.aspx", // img11
  "https://excise.sikkim.gov.in/Retail_Map/Page/Retail_Map_Show.aspx", // img12
];

const InfiniteScrolling = () => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    let scrollAmount = 0;
    const speed = 1.5;

    if (!scrollContainer) return;

    scrollContainer.scrollLeft = 0;

    let animationFrameId;

    const step = () => {
      if (!scrollContainer) return;

      scrollAmount += speed;

      if (scrollAmount >= scrollContainer.scrollWidth / 2) {
        scrollAmount = 0;
      }

      scrollContainer.scrollLeft = scrollAmount;

      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const duplicatedImages = [...images, ...images];
  const duplicatedLinks = [...links, ...links];

  return (
    <div className="overflow-hidden w-full select-none border-y border-green-500 pt-6 py-6">
      <div
        ref={scrollRef}
        className="flex space-x-6"
        style={{
          width: "100%",
          maxWidth: "100vw",
          overflowX: "hidden",
          scrollBehavior: "auto",
        }}
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
    </div>
  );
};

export default InfiniteScrolling;
