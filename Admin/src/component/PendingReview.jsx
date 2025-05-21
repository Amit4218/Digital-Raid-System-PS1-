import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";

const PendingReview = () => {
  const navigate = useNavigate();
  const [inCharge, setInCharge] = useState("Thandup");
  const [culpritName, setCulpritName] = useState("Amit");
  const [identification, setIdentification] = useState("6666666");
  const { raidId } = location.state || {};
  const [crimeDescription, setCrimeDescription] = useState(
    "Suspected of smuggling illegal goods."
  );
  const [address, setAddress] = useState("1234 Criminal Lane, Gotham City");
  const [scheduledDate, setScheduledDate] = useState("2025-05-20");
  const [description, setDescription] = useState(
    "Initial evidence suggests planned movement of contraband."
  );
  const [warrantFile, setWarrantFile] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const fileInputRef = useRef(null);
  const dummyWarrantURL = "https://photricity.com/flw";

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = warrantFile
      ? URL.createObjectURL(warrantFile)
      : dummyWarrantURL;
    link.download = "warrant.png";
    link.click();
  };

  const handleClose = () => {
    navigate("/admin/raids");
  };

  const currentWarrantURL = warrantFile
    ? URL.createObjectURL(warrantFile)
    : dummyWarrantURL;

  return (
    <div className="p-6 min-h-screen bg-gray-50 relative">
      <div className="flex justify-between items-center mt-20 mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold capitalize text-orange-600">
            pending
          </span>
          <span className="w-3 h-3 rounded-full bg-orange-500 border-2 border-orange-300"></span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-green-600 font-semibold">EDITABLE</div>
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
          <div>
            <label className="block text-sm font-medium text-[#213448]">
              Culprit Name
            </label>
            <input
              type="text"
              className="mt-1 block w-full border border-[#213448] rounded-md shadow-sm p-3"
              value={culpritName}
              onChange={(e) => setCulpritName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#213448]">
              Identification
            </label>
            <input
              type="text"
              className="mt-1 block w-full border border-[#213448] rounded-md shadow-sm p-3"
              value={identification}
              onChange={(e) => setIdentification(e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#213448]">
              Crime Description
            </label>
            <textarea
              rows={2}
              className="mt-1 block w-full border border-[#213448] rounded-md shadow-sm p-3"
              value={crimeDescription}
              onChange={(e) => setCrimeDescription(e.target.value)}
            />
          </div>

          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#213448]">
                Raid Officer (In-Charge)
              </label>
              <select
                className="mt-1 block w-full border border-[#213448] rounded-md shadow-sm p-3"
                value={inCharge}
                onChange={(e) => setInCharge(e.target.value)}
              >
                <option value="officer1">Ankit</option>
                <option value="officer2">Thandup</option>
                <option value="officer3">Amit</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#213448]">
                Raid Date
              </label>
              <input
                type="date"
                className="mt-1 block w-full border border-[#213448] rounded-md shadow-sm p-3"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#213448]">
              Address
            </label>
            <input
              type="text"
              className="mt-1 block w-full border border-[#213448] rounded-md shadow-sm p-3"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#213448]">
              Raid Description
            </label>
            <textarea
              rows={3}
              className="mt-1 block w-full border border-[#213448] rounded-md shadow-sm p-3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <p className="text-sm text-gray-500 mt-2 break-all">
              Warrant URL: {currentWarrantURL}
            </p>
          </div>
        </div>

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
                  onClick={handleFileClick}
                  className="bg-[#213448] text-white font-bold px-4 py-2 rounded hover:bg-[#547792]"
                >
                  Update Warrant
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => setWarrantFile(e.target.files[0])}
                  className="hidden"
                />

                <button
                  onClick={handleDownload}
                  className="bg-[#213448] text-white font-bold px-4 py-2 rounded hover:bg-[#547792]"
                >
                  Download Warrant
                </button>
              </div>

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
                src={currentWarrantURL}
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

export default PendingReview;
