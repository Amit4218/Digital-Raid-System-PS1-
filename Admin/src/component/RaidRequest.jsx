import React from "react";

const RaidRequest = () => {
  const dummyData = {
    
    inCharge: "Thandup",
    culpritName: "Amit",
    identification: "666666666",
    crimeDescription:
      "Involvement in smuggling and organized crime activities.",
    address: "Soreng bazar west sikkim",
    scheduledDate: "19-5-2025",
    description:
      "This raid is scheduled based on intelligence reports linking the suspect to multiple illegal operations.",
    warrantFile: "dummy_warrant.pdf",
  };

  const handleApprove = () => {
    console.log("Raid approved:", dummyData);
    
  };

  const handlePreview = () => {
    
    alert("Opening warrant: " + dummyData.warrantFile);
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          
        </div>
        <div className="text-red-500 font-semibold">UNEDITABLE</div>
      </div>

      <div className="bg-white border border-[#213448] shadow-2xl rounded-xl p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Info label="Culprit Name" value={dummyData.culpritName} />
          <Info label="Identification" value={dummyData.identification} />
          <Info
            label="Crime Description"
            value={dummyData.crimeDescription}
            wide
          />
          <Info label="Raid Officer (In-Charge)" value={dummyData.inCharge} />
          <Info label="Raid Date" value={dummyData.scheduledDate} />
          <Info label="Address" value={dummyData.address} wide />
          <Info label="Raid Description" value={dummyData.description} wide />
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-4">
          <button
            onClick={handlePreview}
            className="px-4 py-2 bg-[#213448] text-white font-bold rounded hover:bg-[#547792]"
          >
            Preview Warrant
          </button>

          <button
            onClick={handleApprove}
            className="bg-green-600 text-white font-bold px-6 py-2 rounded-md hover:bg-green-700"
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value, wide }) => (
  <div className={wide ? "md:col-span-2" : ""}>
    <label className="block text-sm font-medium text-[#213448]">{label}</label>
    <div className="mt-1 block w-full border border-[#213448] rounded-md shadow-sm p-3 bg-gray-100 text-[#213448]">
      {value}
    </div>
  </div>
);

export default RaidRequest;
