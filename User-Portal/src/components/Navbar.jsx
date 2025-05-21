import React from "react";
import Sikkimlogo from "../Images/sikkim.png";

// Import your nav button components
import AboutUs from "./NavButtons/AboutUs";
import FactsFigures from "./NavButtons/FactsFigures";
import ActsRulesOrders from "./NavButtons/ActsRulesOrders";
import RightToInformation from "./NavButtons/RightToInformation";
import Feedback from "./NavButtons/Feedback";
import ContactUs from "./NavButtons/ContactUs";

const Navbar = () => {
  return (
    <header className="bg-lime-700 text-white py-2 px-6 relative z-30">
      <div className="flex flex-col lg:flex-row items-center justify-between">
        <div className="flex items-center gap-4 mb-4 lg:mb-0">
          <img src={Sikkimlogo} alt="Sikkim Emblem" className="h-14" />
          <div>
            <h1 className="text-2xl font-bold">EXCISE DEPARTMENT</h1>
            <p className="text-sm">GOVERNMENT OF SIKKIM</p>
          </div>
        </div>

        <nav className="flex flex-wrap justify-center gap-4 text-sm font-medium">
          <AboutUs />
          <FactsFigures />
          <ActsRulesOrders />
          <RightToInformation />
          <Feedback />
          <ContactUs />
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
