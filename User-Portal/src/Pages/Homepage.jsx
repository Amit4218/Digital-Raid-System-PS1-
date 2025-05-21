import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import Navbar from "../components/Navbar";
import ImageSlider from "../components/ImageSlider";
import MapAndGraph from "../components/MapAndGraph";
import RaidImages from "../components/RaidImages";
import InfiniteScrolling from "../components/InfiniteScrolling";
import Footer from "../components/Footer";
import Heatmap from "../components/Maps/Heatmap";

function Homepage() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: false,
    });

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
      {/* Navbar */}
      <Navbar data-aos="fade-down" />

      {/* Image Slider */}
      <div className="-mt-16" data-aos="fade-up" data-aos-delay="100">
        <ImageSlider />
      </div>

      {/* Map and Graph */}
      <div data-aos="fade-up" data-aos-delay="200">
        <MapAndGraph />
      </div>

      {/* Raid Images */}
      <div data-aos="fade-up" data-aos-delay="300" className="mb-20">
        <RaidImages />
      </div>

      {/* Infinite Scrolling */}
      <div className="mt-8" data-aos="fade-up" data-aos-delay="400">
        <Heatmap />
      </div>
      {/* Infinite Scrolling */}
      <div className="mt-8" data-aos="fade-up" data-aos-delay="400">
        <InfiniteScrolling />
      </div>

      {/* Footer */}
      <Footer data-aos="fade-up" data-aos-delay="500" />
    </div>
  );
}

export default Homepage;
