import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";

function Unplanned() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  // Stores all the form Data / information

  const [formData, setFormData] = useState({
    culprits: [
      {
        name: "",
      },
    ],
    location: {
      address: "",
    },
    scheduledDate: today,
    description: "",
    userId: localStorage.getItem("userId"),
  });

  // Handels form changes

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const path = name.split(/[\[\].]+/).filter((k) => k !== "");

    setFormData((prev) => {
      const newState = JSON.parse(JSON.stringify(prev));
      let current = newState;

      for (let i = 0; i < path.length - 1; i++) {
        const part = path[i];
        if (!current[part]) current[part] = isNaN(path[i + 1]) ? {} : [];
        current = current[part];
      }

      const lastPart = path[path.length - 1];
      current[lastPart] = type === "checkbox" ? checked : value;
      return newState;
    });
  };

  // Handels From Submission

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.culprits[0].name) {
      toast.error("Please enter suspect name");
      return;
    }
    if (!formData.location.address) {
      toast.error("Please enter address");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/create-raid`,
        formData,
        {
          headers: {
            "x-access-key": import.meta.env.VITE_SECRET_ACCESS_KEY,
          },
        }
      );
      // console.log(formData);

      toast.success("Raid request created successfully");
      navigate("/raidPage");
    } catch (error) {
      console.error("Failed to create raid:", error);
      toast.error(
        error.response?.data?.message || "Failed to create raid request"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#213448]">
      <Navbar />
      <div className="container mx-auto p-4 md:p-8">
        <form
          onSubmit={handleSubmit}
          className="bg-[#2d4055] rounded-lg shadow-md p-6 text-white"
        >
          <h2 className="text-xl font-semibold text-white mb-6">
            Unplanned Raid Request
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Suspect Name */}
            <div>
              <label
                htmlFor="culpritName"
                className="block text-gray-300 text-sm font-medium mb-2"
              >
                Suspect name :
              </label>
              <input
                name="culprits[0].name"
                value={formData.culprits[0].name}
                onChange={handleChange}
                type="text"
                id="culpritName"
                className="outline-none py-3 px-4 bg-[#3a4e66] border border-[#4a607a] rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 w-full text-white"
                required
              />
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="address"
                className="block text-gray-300 text-sm font-medium mb-2"
              >
                Address :
              </label>
              <input
                name="location.address"
                onChange={handleChange}
                value={formData.location.address}
                type="text"
                id="address"
                className="outline-none py-3 px-4 bg-[#3a4e66] border border-[#4a607a] rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 w-full text-white"
                required
              />
            </div>

            {/* Raid Date */}
            <div>
              <label
                htmlFor="scheduledDate"
                className="block text-gray-300 text-sm font-medium mb-2"
              >
                Raid date :
              </label>
              <input
                name="scheduledDate"
                onChange={handleChange}
                value={formData.scheduledDate}
                type="date"
                id="scheduledDate"
                className="outline-none py-3 px-4 bg-[#3a4e66] border border-[#4a607a] rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 w-full text-white"
                required
              />
            </div>
          </div>

          {/* Basic Description */}
          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-gray-300 text-sm font-medium mb-2"
            >
              Basic description
            </label>
            <textarea
              name="description"
              onChange={handleChange}
              value={formData.description}
              id="description"
              rows="3"
              className="outline-none py-3 px-4 bg-[#3a4e66] border border-[#4a607a] rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 w-full text-white"
              placeholder="Enter raid description"
              required
            ></textarea>
          </div>

          {/* Request Approval Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
            >
              Request approval
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Unplanned;
