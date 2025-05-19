import React from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Notification from "./Notification";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Fixed casing to follow React conventions
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <nav className="w-[100vw] flex items-center justify-between px-6 py-3 bg-[#1f3143] shadow-md sticky top-0 z-50">
      {/* Left - Profile Image */}
      <div className="flex items-center gap-4">
        <img
          src="#" // Replace with actual user profile image
          alt="Profile"
          className="w-12 h-12 rounded-full object-cover border-2 border-white"
        />
      </div>

      {/* Center - Navigation Buttons */}
      <div className="w-[60%] flex  gap-10">
        {" "}
        {/* Removed fixed width and corrected gap class */}
        <Link to="/admin">
          {" "}
          {/* Added proper Link wrapper */}
          <button className="px-6 py-2 text-white font-semibold rounded-full border border-white hover:bg-white hover:text-[#1f3143] shadow-md">
            Dashboard
          </button>
        </Link>
        <Link to="/admin/raids">
          <button className="px-6 py-2 text-white font-semibold rounded-full border border-white hover:bg-white hover:text-[#1f3143] shadow-md">
            Raids
          </button>
        </Link>
        <Link to="/admin/unplannedRaids">
          <button className="px-6 py-2 text-white font-semibold rounded-full border border-white hover:bg-white hover:text-[#1f3143] shadow-md">
            Unplanned Raid Requests
          </button>
        </Link>
        <Link to="/admin/logs">
          <button className="px-6 py-2 text-white font-semibold rounded-full border border-white hover:bg-white hover:text-[#1f3143] shadow-md">
            Log Report
          </button>
        </Link>
      </div>

      {/* Right - Notifications and Logout */}
      <div className="flex items-center gap-12">
        <Notification />

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 hover:cursor-pointer bg-[#eae8cc] text-[#1f3143] rounded-md font-medium hover:bg-[#e2e0bb] transition"
        >
          Logout
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M5 22C4.44772 22 4 21.5523 4 21V3C4 2.44772 4.44772 2 5 2H19C19.5523 2 20 2.44772 20 3V6H18V4H6V20H18V18H20V21C20 21.5523 19.5523 22 19 22H5ZM18 16V13H11V11H18V8L23 12L18 16Z"></path>
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
