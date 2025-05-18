import React, { useState, useRef } from "react";

const PlannedRaid = () => {
  const [status, setStatus] = useState("pending");
  const [inCharge, setInCharge] = useState("");
  const [culpritName, setCulpritName] = useState("");
  const [address, setAddress] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [description, setDescription] = useState("");
  const [warrantFile, setWarrantFile] = useState(null);

  const fileInputRef = useRef(null);

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handlePublish = () => {
    
    console.log({
      status,
      inCharge,
      culpritName,
      address,
      scheduledDate,
      description,
      warrantFile,
    });

    
    setInCharge("");
    setCulpritName("");
    setAddress("");
    setScheduledDate("");
    setDescription("");
    setWarrantFile(null);

    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold capitalize">{status}</span>
          <span className="w-3 h-3 rounded-full bg-orange-500 border-2 border-orange-300"></span>
        </div>
        <div className="text-red-500 font-semibold">EDITABLE</div>
      </div>

      <div className="bg-white border border-[#213448] shadow-2xl rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
         
          <div>
            <label className="block text-sm font-medium text-[#213448]">
              Culprit Name
            </label>
            <input
              type="text"
              className="mt-1 block w-full border border-[#213448] rounded-md shadow-sm p-2"
              value={culpritName}
              onChange={(e) => setCulpritName(e.target.value)}
            />
          </div>

         
          <div>
            <label className="block text-sm font-medium text-[#213448]">
              Raid Officer (In-Charge)
            </label>
            <select
              className="mt-1 block w-full border border-[#213448] rounded-md shadow-sm p-2"
              value={inCharge}
              onChange={(e) => setInCharge(e.target.value)}
            >
              <option value="">Select Officer</option>
              <option value="officer1">Ankit</option>
              <option value="officer2">Thandup</option>
              <option value="officer3">Amit</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#213448]">
              Address
            </label>
            <input
              type="text"
              className="mt-1 block w-full border border-[#213448] rounded-md shadow-sm p-2"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          
          <div>
            <label className="block text-sm font-medium text-[#213448]">
              Raid Date
            </label>
            <input
              type="date"
              className="mt-1 block w-full border border-[#213448] rounded-md shadow-sm p-2"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
            />
          </div>

         
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#213448]">
              Description
            </label>
            <textarea
              className="mt-1 block w-full border border-[#213448] rounded-md shadow-sm p-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            ></textarea>

            
            {warrantFile && (
              <p className="text-sm mt-1 text-green-600">
                Selected: {warrantFile.name}
              </p>
            )}
          </div>
        </div>

      
        <div className="flex flex-col items-center justify-center gap-32 mt-6 md:flex-row">
          <div>
            <button
              type="button"
              onClick={handleFileClick}
              className="px-4 py-2 bg-[#213448] text-white font-bold rounded hover:bg-[#547792]"
            >
              Upload Warrant
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => setWarrantFile(e.target.files[0])}
              className="hidden"
            />
          </div>

          <button
            onClick={handlePublish}
            className="bg-[#213448] text-white font-bold px-6 py-2 rounded-md hover:bg-[#547792]"
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlannedRaid;
