import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Notification from "./Notification";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const image = localStorage.getItem("adminpicture");
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu
  const token = localStorage.getItem("token");

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/logout`,
        { token }
      );

      if (res.status === 200) {
        localStorage.removeItem("token");
        localStorage.removeItem("adminId");
        localStorage.removeItem("adminpicture");
        toast.success("Logged out successfully");
        navigate("/");
      } else {
        toast.error("Error logging out.. try again");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <nav className="w-full flex items-center justify-between px-4 py-3 bg-[#1f3143] shadow-md sticky top-0 z-50 md:px-6">
      {/* Left - Profile Image and Hamburger Menu */}
      <div className="flex items-center gap-4">
        {/* Hamburger Menu Icon (Mobile Only) */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            )}
          </svg>
        </button>
        <img
          src={image}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover border-2 border-white md:w-12 md:h-12"
        />
      </div>

      {/* Center - Navigation Buttons (Hidden on Mobile, Flex on Medium and Up) */}
      <div className="hidden md:flex flex-grow justify-center gap-4 lg:gap-10">
        <Link to="/admin">
          <button className="px-3 py-1 text-white font-semibold rounded-full border border-white hover:bg-white hover:text-[#1f3143] shadow-md text-sm lg:px-6 lg:py-2">
            Dashboard
          </button>
        </Link>
        <Link to="/admin/raids">
          <button className="px-3 py-1 text-white font-semibold rounded-full border border-white hover:bg-white hover:text-[#1f3143] shadow-md text-sm lg:px-6 lg:py-2">
            Raids
          </button>
        </Link>
        <Link to="/admin/unplannedRaids">
          <button className="px-3 py-1 text-white font-semibold rounded-full border border-white hover:bg-white hover:text-[#1f3143] shadow-md text-sm lg:px-6 lg:py-2">
            Unplanned Raid Requests
          </button>
        </Link>
        <Link to="/admin/logs">
          <button className="px-3 py-1 text-white font-semibold rounded-full border border-white hover:bg-white hover:text-[#1f3143] shadow-md text-sm lg:px-6 lg:py-2">
            Log Report
          </button>
        </Link>
      </div>

      {/* Right - Notifications and Logout */}
      <div className="flex items-center gap-4 md:gap-8 lg:gap-12">
        <Notification />

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 px-3 py-1 text-xs hover:cursor-pointer bg-[#eae8cc] text-[#1f3143] rounded-md font-medium hover:bg-[#e2e0bb] transition md:px-4 md:py-2 md:text-base"
        >
          Logout
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4 md:w-5 md:h-5"
          >
            <path d="M5 22C4.44772 22 4 21.5523 4 21V3C4 2.44772 4.44772 2 5 2H19C19.5523 2 20 2.44772 20 3V6H18V4H6V20H18V18H20V21C20 21.5523 19.5523 22 19 22H5ZM18 16V13H11V11H18V8L23 12L18 16Z"></path>
          </svg>
        </button>
      </div>

      {/* Mobile Menu (Conditional Rendering) */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#1f3143] shadow-lg flex flex-col items-center py-4 space-y-3">
          <Link to="/admin" onClick={() => setIsOpen(false)}>
            <button className="w-full px-6 py-2 text-white font-semibold rounded-full border border-white hover:bg-white hover:text-[#1f3143] shadow-md">
              Dashboard
            </button>
          </Link>
          <Link to="/admin/raids" onClick={() => setIsOpen(false)}>
            <button className="w-full px-6 py-2 text-white font-semibold rounded-full border border-white hover:bg-white hover:text-[#1f3143] shadow-md">
              Raids
            </button>
          </Link>
          <Link to="/admin/unplannedRaids" onClick={() => setIsOpen(false)}>
            <button className="w-full px-6 py-2 text-white font-semibold rounded-full border border-white hover:bg-white hover:text-[#1f3143] shadow-md">
              Unplanned Raid Requests
            </button>
          </Link>
          <Link to="/admin/logs" onClick={() => setIsOpen(false)}>
            <button className="w-full px-6 py-2 text-white font-semibold rounded-full border border-white hover:bg-white hover:text-[#1f3143] shadow-md">
              Log Report
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
