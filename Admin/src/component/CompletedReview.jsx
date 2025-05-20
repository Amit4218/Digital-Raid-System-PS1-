import React, { useState } from "react";
import { Eye, Download, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CompletedReview = () => {
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);
  const warrantURL = "https://example.com/Raidwarrant.pdf";

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = warrantURL;
    link.download = "Raidwarrant.pdf";
    link.click();
  };

  const handleClose = () => {
    navigate("/admin/raids");
  };

  const [videos, setVideos] = useState([
    { id: "Dajdfsjf92832923d3", size: "49 MB", date: "Lat/Long 13/05/2025" },
    { id: "Dajdfsjf92832923d3", size: "52 MB", date: "Lat/Long 13/05/2025" },
  ]);

  return (
    <div className="bg-[#e5ebbd] p-4 rounded-md font-sans text-sm relative">
      {/* Status with X button */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-green-500 rounded-full shadow border border-white"></span>
          <span className="text-green-700 font-medium">Completed</span>
        </div>
        <button
          onClick={handleClose}
          className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>

      {/* Main Container */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Left Panel */}
        <div className="bg-[#1e2c3e] text-white p-4 rounded-lg w-full md:w-[280px] shadow">
          <p className="mb-2">
            <strong>Raid officer :</strong> inspector xyz
          </p>
          <p className="mb-2">
            <strong>Suspect name :</strong> Amit bhagat
          </p>
          <p className="mb-2">
            <strong>Address :</strong> Soreng bazar
          </p>
          <p className="mb-2">
            <strong>Raid date :</strong> Soreng bazar
          </p>
          <p>
            <strong>Identification :</strong> 347A-QW88
          </p>
        </div>

        {/* Right Panel */}
        <div className="flex-1 p-2 rounded-lg border border-[#ccc] bg-white shadow-sm">
          {/* Descriptions (Vertical Stack) */}
          <div className="space-y-4">
            {/* Basic Description */}
            <div>
              <div className="flex justify-between items-start mb-1">
                <h2 className="text-base font-semibold text-black">
                  Crime description
                </h2>
                <span className="text-red-600 text-xs font-semibold italic">
                  UNEDITABLE
                </span>
              </div>
              <textarea
                readOnly
                placeholder=""
                className="w-full h-24 p-2 border border-gray-300 rounded-lg resize-none"
              />
            </div>

            {/* Additional Description */}
            <div>
              <div className="flex justify-between items-start mb-1">
                <h2 className="text-base font-semibold text-black">
                  Raid description
                </h2>
              </div>
              <textarea
                readOnly
                placeholder=""
                className="w-full h-24 p-2 border border-gray-300 rounded-lg resize-none"
              />
            </div>
          </div>

          {/* File & Buttons - Moved Below Descriptions */}
          <div className="flex items-center gap-2 mt-4 flex-wrap border-t pt-3">
            <div className="bg-gray-100 border border-gray-300 px-2 py-1 rounded text-gray-700">
              Raidwarrant.pdf
            </div>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-1 bg-[#1e2c3e] text-white px-3 py-1 rounded hover:bg-[#33475b]"
            >
              <Eye size={16} />
              Preview warrant
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 bg-[#1e2c3e] text-white px-3 py-1 rounded hover:bg-[#33475b]"
            >
              <Download size={16} />
              Download warrant
            </button>
          </div>

          {/* PDF Preview */}
          {showPreview && (
            <iframe
              src={warrantURL}
              title="Warrant Preview"
              className="mt-4 w-full h-64 border rounded"
            ></iframe>
          )}
        </div>
      </div>

      {/* Location + Time Section */}
      <div className="mt-4 border border-[#1e2c3e] bg-white text-[#1e2c3e] rounded-xl px-4 py-3 shadow-sm">
        <p className="font-bold mb-2">
          LOCATION:{" "}
          <span className="font-normal">
            Latitude: 27.32849° N, Longitude: 88.61244° E
          </span>
        </p>

        {/* Time Grid with Vertical Line */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm relative">
          <div className="space-y-1">
            <p>
              <strong>Start Date :</strong>
            </p>
            <p>
              <strong>Time :</strong>
            </p>
          </div>

          <div className="space-y-1 border-l border-gray-300 pl-4">
            <p>
              <strong>End Date :</strong>
            </p>
            <p>
              <strong>Time :</strong>
            </p>
          </div>
        </div>

        {/* Horizontal Line */}
        <hr className="mt-4 border-t border-gray-300" />
      </div>

      {/* New Section: Written Report, License, Uploaded Files */}
      <div className="mt-6 bg-[#1e2c3e] p-4 rounded-xl text-black flex flex-col gap-4 text-sm">
        {/* Written Report */}
        <div className="bg-[#f2f2c2] p-4 rounded-xl shadow text-center">
          <h2 className="text-xl font-semibold mb-2">WRITTEN REPORT</h2>
          <p className="text-justify text-[13px] leading-relaxed">
            "Lorem Ipsum Dolor Sit Amet, Consectetur Adipisicing Elit, Sed Do
            Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua. Ut Enim
            Ad Minim Veniam, Quis Nostrud Exercitation Ullamco Laboris Nisi Ut
            Aliquip Ex Ea Commodo Consequat. Duis Aute Irure Dolor In
            Reprehenderit In Voluptate Velit Esse Cillum Dolore Eu Fugiat Nulla
            Pariatur. Excepteur Sint Occaecat Cupidatat Nonproident, Sunt In
            Culpa Qui Officia Deserunt Mollit Anim Id Est Laborum."
          </p>
        </div>

        {/* License and Uploaded Files Grid */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* License Box */}
          <div className="bg-[#f2f2c2] p-4 rounded-xl flex-1 shadow">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">License</h3>
              <select className="text-sm bg-white border border-gray-300 rounded px-2 py-1">
                <option>Select Category</option>
              </select>
            </div>
            <div className="text-sm space-y-1 mb-3">
              <p>
                <strong>ID:</strong>
              </p>
              <p>
                <strong>ISSUED DATE:</strong>
              </p>
              <p>
                <strong>EXPIRY DATE:</strong>
              </p>
            </div>
            <div className="border border-black rounded-md p-2 text-center bg-white">
              <p className="font-bold text-xs">PREVIOUS CRIME RECORD</p>
              <p className="text-sm mt-1">No Previous Crime Record Found</p>
            </div>
          </div>

          {/* Uploaded Files */}
          <div className="bg-[#f2f2c2] p-4 rounded-xl flex-1 shadow">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Uploaded Files</h3>
              <button className="text-sm bg-[#1e2c3e] text-white px-3 py-1 rounded shadow">
                Upload
              </button>
            </div>
            <input
              type="text"
              readOnly
              value="UploadedSeizedItems.Docs"
              className="w-full border border-gray-400 rounded px-2 py-1 text-sm mb-3"
            />
            <div className="border border-gray-400 rounded-lg p-4 bg-white flex flex-col items-center justify-center text-sm text-gray-700">
              <p className="mb-2">Drag And Drop To Upload File</p>
              <div className="border border-gray-300 p-4 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="40"
                  fill="gray"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14l4-4h12l4 4z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seized Item Details */}
      <div className="bg-[#e5ebbd] text-[#1e2c3e] p-6 rounded-lg shadow-lg mt-6 border">
        <h2 className="text-center text-xl font-bold mb-4">
          Seized Item Details
        </h2>

        {/* Form Top Section */}
        <div className="flex justify-between items-center gap-4 mb-4">
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Category:</label>
            <select className="border border-gray-400 px-3 py-1 rounded bg-white text-sm">
              <option>Select</option>
            </select>
          </div>
          <button className="bg-[#1e2c3e] text-white px-4 py-2 rounded shadow">
            Upload Image
          </button>
        </div>

        <div className="mb-4">
          <label className="text-sm font-semibold mb-1 block">
            Description
          </label>
          <textarea
            className="w-full border border-gray-400 rounded px-3 py-2"
            rows="3"
          ></textarea>
        </div>

        {/* Images and Item Details */}
        <div className="flex gap-4 justify-center mb-6">
          {[1, 2].map((_, index) => (
            <div
              key={index}
              className="text-white bg-[#1e2c3e] p-2 rounded-lg shadow-md"
            >
              <img
                src="https://via.placeholder.com/150"
                alt="seized item"
                className="w-40 h-32 object-cover rounded mb-2"
              />
              <h3 className="text-sm font-semibold">ITEM NAME</h3>
              <p className="text-xs">Some Crazy Things About The Seized Item</p>
            </div>
          ))}
        </div>
      </div>

      {/* Video Upload Section */}
      <div className="flex flex-col items-start mt-7">
        <button className="bg-[#1e2c3e] text-white px-4 py-1 rounded shadow mb-2">
          Upload Video
        </button>
        <div className="bg-[#1e2c3e] text-white rounded-lg shadow w-full">
          <div className="grid grid-cols-3 p-2 font-semibold text-sm border-b border-white">
            <span>Video ID</span>
            <span>Size</span>
            <span>Location/Date Time</span>
          </div>
          {videos.map((video, i) => (
            <div
              key={i}
              className="grid grid-cols-3 p-2 text-sm border-t border-gray-400"
            >
              <span>{video.id}</span>
              <span>{video.size}</span>
              <span>{video.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Signature */}
      <div className="mb-4">
        <label className="text-sm italic mb-1 block">Signature</label>
        <input
          type="text"
          className="border border-gray-400 rounded px-3 py-1 w-40"
        />
      </div>

      {/* Approve and Close buttons */}
      <div className="flex justify-end gap-4">
        <button className="bg-green-500 text-white font-semibold px-6 py-2 rounded-full">
          Approve
        </button>
        <button
          onClick={handleClose}
          className="bg-red-500 text-white font-semibold px-6 py-2 rounded-full hover:bg-gray-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CompletedReview;
