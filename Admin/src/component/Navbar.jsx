import React from "react";
// import { FaSignOutAlt } from "react-icons/fa";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-[#1f3143] shadow-md sticky top-0 z-50">
      {/* Left - Profile Image */}
      <div className="flex items-center gap-4">
        <img
          src="#" // Replace with actual user profile image
          alt="Profile"
          className="w-12 h-12 rounded-full object-cover border-2 border-white"
        />
      </div>

      {/* Center - Navigation Buttons */}
      <div className="flex w-[70%] gap-15">
        <button className="px-6 py- text-white font-semibold rounded-full border border-white hover:bg-white hover:text-[#1f3143] shadow-md">
          Dashboard
        </button>
        <button className="px-6 py-2 text-white font-semibold rounded-full border border-white hover:bg-white hover:text-[#1f3143] shadow-md">
          Raids
        </button>
      </div>

      {/* Right - Logout */}
      <div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#eae8cc] text-[#1f3143] rounded-md font-medium hover:bg-[#e2e0bb] transition">
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
