import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Notification from "./Notification";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const image = localStorage.getItem("picture");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const logoutHandler = async (e) => {
    e.preventDefault();

    try {
      const r = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/logout`,
        { token }
      );
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("picture");
      toast.success("Logout successful");
      navigate("/");
    } catch (error) {
      toast.error("Error logging out ! Please try again");
      console.error("Logout", error);
    }
  };

  return (
    <nav className="bg-[#1f3143] shadow-md sticky top-0 z-50">
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center justify-between px-6 py-3">
        {/* Left - Profile Image */}
        <div className="flex items-center gap-4">
          <img
            src={image}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover border-2 border-white"
          />
        </div>

        {/* Center - Navigation Buttons */}
        <div className="flex w-[70%] gap-10 ml-5">
          <button
            onClick={(e) => {
              e.preventDefault();
              navigate("/raidPage");
            }}
            className="px-6 py-2 font-semibold rounded-full border border-white text-white shadow-md bg-[#213448] cursor-pointer hover:bg-[#435465]"
          >
            Raids
          </button>
          <button
            onClick={(e) => {
              navigate("/unplanned-raid");
            }}
            className="px-6 py-2 text-white font-semibold rounded-full border border-white cursor-pointer shadow-md bg-[#213448] hover:bg-[#435465]"
          >
            Create Unplanned Raid
          </button>
         
          <button
            onClick={(e) => {
              navigate("/Finished-raids");
            }}
            className="px-6 py-2 text-white font-semibold rounded-full border border-white cursor-pointer shadow-md bg-[#213448] hover:bg-[#435465]"
          >
            Finished Raids
          </button>
         
          <button
            onClick={(e) => {
              navigate("/bailbond");
            }}
            className="px-6 py-2 text-white font-semibold rounded-full border border-white cursor-pointer shadow-md bg-[#213448] hover:bg-[#435465]"
          >
            Issue Bailbond
          </button>
        </div>

        {/* Right - Logout */}
        <div className="flex items-center gap-10 mr-4">
          <Notification />

          <button
            onClick={logoutHandler}
            className="flex items-center gap-2 px-4 py-2 bg-[#eae8cc] text-[#1f3143] rounded-md font-medium hover:bg-[#e2e0bb] transition cursor-pointer"
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
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <img
            src={image}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border-2 border-white"
          />
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="px-4 py-3 space-y-3">
            <button
              onClick={(e) => {
                e.preventDefault();
                navigate("/raidPage");
                setIsMenuOpen(false);
              }}
              className="w-full px-4 py-2 font-semibold rounded-full border border-white text-white shadow-md bg-[#213448] cursor-pointer hover:bg-[#435465]"
            >
              Raids
            </button>
            <button
              onClick={(e) => {
                navigate("/unplanned-raid");
                setIsMenuOpen(false);
              }}
              className="w-full px-4 py-2 text-white font-semibold rounded-full border border-white cursor-pointer shadow-md bg-[#213448] hover:bg-[#435465]"
            >
              Create Unplanned Raid
            </button>
            <button
              onClick={(e) => {
                navigate("/unplanned-raid");
                setIsMenuOpen(false);
              }}
              className="w-full px-4 py-2 text-white font-semibold rounded-full border border-white cursor-pointer shadow-md bg-[#213448] hover:bg-[#435465]"
            >
              Finished Raids
            </button>
            <button
              onClick={(e) => {
                navigate("/unplanned-raid");
                setIsMenuOpen(false);
              }}
              className="w-full px-4 py-2 text-white font-semibold rounded-full border border-white cursor-pointer shadow-md bg-[#213448] hover:bg-[#435465]"
            >
              Issue Bailbond
            </button>
            <button
              onClick={logoutHandler}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#eae8cc] text-[#1f3143] rounded-md font-medium hover:bg-[#e2e0bb] transition cursor-pointer"
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
        )}
      </div>
    </nav>
  );
};

export default Navbar
