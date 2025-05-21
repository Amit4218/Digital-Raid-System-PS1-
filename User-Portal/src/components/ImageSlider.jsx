import React, { useState, useEffect } from "react";
import s1 from "../Images/s1.png";
import s2 from "../Images/s2.png";
import s3 from "../Images/s3.png";
import s4 from "../Images/s4.png";
import s5 from "../Images/s5.png";

const images = [s1, s2, s3, s4, s5];

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-96 overflow-hidden">
      <div className="w-full h-full">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Slide ${index + 1}`}
            className={`absolute w-full h-full object-contain transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          />
        ))}
      </div>

      
      {/* Circle indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-3 h-3 rounded-full border border-green-800 ${
              i === currentIndex ? "bg-green-200" : "bg-transparent"
            } transition duration-300`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
