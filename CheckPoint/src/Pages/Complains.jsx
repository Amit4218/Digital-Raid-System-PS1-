import React from "react";

function Complains() {
  // Sample raid information paragraph
  const raidInformation = `
    During the routine patrol in the commercial district, officers noticed suspicious activity 
    near the abandoned warehouse on 5th Avenue. Surveillance was conducted for 72 hours, 
    revealing multiple individuals entering and exiting with packages at unusual hours. 
    
    A raid was conducted at 03:00 hrs on June 15th with full tactical support. The team 
    discovered and seized 15kg of illegal substances packaged for distribution, along with 
    ₹12,50,000 in cash believed to be proceeds from drug sales. Three individuals were 
    apprehended at the scene and have been charged under NDPS Act sections 8(c), 21, and 29.
    
    Forensic analysis of seized mobile devices suggests connections to a larger interstate 
    network. All evidence has been cataloged (Case Ref: NDPS-2023-0456) and sent for further 
    processing. The location has been sealed pending complete investigation.
  `;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
          Raid Information
        </h1>

        <div className="text-gray-700">
          <p className="whitespace-pre-line text-justify leading-relaxed">
            {raidInformation}
          </p>

          
        </div>
      </div>
    </div>
  );
}

export default Complains;
