import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";

const ActiveReview = () => {
  const navigate = useNavigate();
  const inCharge = "Thandup";
  const culpritName = "Amit";
  const identification = "6666666";
  const crimeDescription = "Suspected of smuggling illegal goods.";
  const address = "1234 Criminal Lane, Gotham City";
  const scheduledDate = "2025-05-20";
  const description =
    "Initial evidence suggests planned movement of contraband.";
  const dummyWarrantURL = "https://photricity.com/flw";

  const [showPreview, setShowPreview] = useState(false);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = dummyWarrantURL;
    link.download = "warrant.png";
    link.click();
  };

  const handleClose = () => {
    navigate("/admin/raids");
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50 relative">
      <div className="flex justify-between items-center mt-20 mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold capitalize text-[#3B82F6]">
            Active
          </span>
          <span className="w-3 h-3 rounded-full bg-[#3B82F6] border-2 border-[#3B82F6]"></span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-red-500 font-semibold">UNEDITABLE</div>
          {/* X button with red circle */}
          <button
            onClick={handleClose}
            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
            aria-label="Close"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#213448] shadow-2xl rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          {/* Culprit Name */}
          <div>
            <label className="block text-sm font-medium text-[#213448]">
              Culprit Name
            </label>
            <p className="mt-1 p-3 border border-[#213448] rounded-md bg-gray-100">
              {culpritName}
            </p>
          </div>

          {/* Identification */}
          <div>
            <label className="block text-sm font-medium text-[#213448]">
              Identification
            </label>
            <p className="mt-1 p-3 border border-[#213448] rounded-md bg-gray-100">
              {identification}
            </p>
          </div>

          {/* Crime Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#213448]">
              Crime Description
            </label>
            <p className="mt-1 p-3 border border-[#213448] rounded-md bg-gray-100">
              {crimeDescription}
            </p>
          </div>

          {/* Raid Officer & Date */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#213448]">
                Raid Officer (In-Charge)
              </label>
              <p className="mt-1 p-3 border border-[#213448] rounded-md bg-gray-100">
                {inCharge}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#213448]">
                Raid Date
              </label>
              <p className="mt-1 p-3 border border-[#213448] rounded-md bg-gray-100">
                {scheduledDate}
              </p>
            </div>
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#213448]">
              Address
            </label>
            <p className="mt-1 p-3 border border-[#213448] rounded-md bg-gray-100">
              {address}
            </p>
          </div>

          {/* Raid Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#213448]">
              Raid Description
            </label>
            <p className="mt-1 p-3 border border-[#213448] rounded-md bg-gray-100">
              {description}
            </p>
            <p className="text-sm text-gray-500 mt-2 break-all">
              Warrant URL: {dummyWarrantURL}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col items-center justify-center gap-8 mt-8 md:flex-row">
          <div className="flex flex-col items-center w-full">
            <div className="flex flex-wrap justify-between w-full items-center">
              <div className="flex gap-4 flex-wrap">
                {!showPreview ? (
                  <button
                    onClick={() => setShowPreview(true)}
                    className="bg-[#213448] text-white font-bold px-4 py-2 rounded hover:bg-[#547792]"
                  >
                    Preview Warrant
                  </button>
                ) : (
                  <button
                    onClick={() => setShowPreview(false)}
                    className="bg-red-500 text-white font-bold px-4 py-2 rounded hover:bg-red-600"
                  >
                    Close Preview
                  </button>
                )}

                <button
                  onClick={handleDownload}
                  className="bg-[#213448] text-white font-bold px-4 py-2 rounded hover:bg-[#547792]"
                >
                  Download Warrant
                </button>
              </div>

              {/* Close button at far right */}
              <div className="ml-auto">
                <button
                  onClick={handleClose}
                  className="bg-red-500 text-white font-bold px-4 py-2 rounded-4xl hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>

            {showPreview && (
              <img
                src={dummyWarrantURL}
                alt="Warrant Preview"
                className="w-[300px] h-auto rounded shadow-md border border-gray-300 mt-4"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveReview;
