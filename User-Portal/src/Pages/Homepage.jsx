import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import Navbar from "../components/Navbar";
import ImageSlider from "../components/ImageSlider";
import MapAndGraph from "../components/MapAndGraph";
import RaidImages from "../components/RaidImages";
import InfiniteScrolling from "../components/InfiniteScrolling";
import Footer from "../components/Footer";

function Homepage() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: false, // ← change here, animation triggers every time on scroll into view
    });

    // Optional: refresh AOS when components update or page resize
    // You can also add this for safety:
    window.addEventListener("load", AOS.refresh);
    window.addEventListener("resize", AOS.refresh);
    window.addEventListener("scroll", AOS.refresh);

    return () => {
      window.removeEventListener("load", AOS.refresh);
      window.removeEventListener("resize", AOS.refresh);
      window.removeEventListener("scroll", AOS.refresh);
    };
  }, []);

  return (
    <div>
      <Navbar data-aos="fade-down" />
      <div className="-mt-16" data-aos="fade-up" data-aos-delay="100">
        <ImageSlider />
      </div>
      <div data-aos="fade-up" data-aos-delay="200">
        <MapAndGraph />
      </div>
      <div data-aos="fade-up" data-aos-delay="300">
        <RaidImages />
      </div>
      <div className="mt-8" data-aos="fade-up" data-aos-delay="400">
        <InfiniteScrolling />
      </div>
      <Footer data-aos="fade-up" data-aos-delay="500" />
    </div>
  );
}

export default Homepage;
