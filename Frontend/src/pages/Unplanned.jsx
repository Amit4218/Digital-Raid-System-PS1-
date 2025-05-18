// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// function Unplanned() {
//   const [officers, setOfficers] = useState([]);
//   const navigate = useNavigate();
//   const today = new Date().toISOString().split("T")[0];

//   const [formData, setFormData] = useState({
//     inCharge: "",
//     culprits: [
//       {
//         name: "",
//         identification: "",
//         description: "",
//       },
//     ],
//     location: {
//       address: "",
//       coordinates: {
//         longitude: "",
//         latitude: "",
//       },
//       hotspot: false,
//     },
//     scheduledDate: today,
//     description: "",
//     isUnplannedRequest: true,
//     unplannedRequestDetails: {
//       approvalStatus: "pending",
//       requestDate: today,
//     },
//     userId: localStorage.getItem("userId"),
//   });

//   console.log(formData.inCharge);

//   useEffect(() => {
//     const getOfficers = async () => {
//       try {
//         const res = await axios.get(
//           `${import.meta.env.VITE_BASE_URL}/user/get-all-raid-officers`,
//           {
//             headers: {
//               "x-access-key": import.meta.env.VITE_SECRET_ACCESS_KEY,
//             },
//           }
//         );
//         setOfficers(res.data.users);
//       } catch (error) {
//         console.error("Failed to fetch officers:", error);
//       }
//     };
//     getOfficers();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     const path = name.split(/[\[\].]+/).filter((k) => k !== "");

//     setFormData((prev) => {
//       const newState = JSON.parse(JSON.stringify(prev));
//       let current = newState;

//       for (let i = 0; i < path.length - 1; i++) {
//         const part = path[i];
//         if (!current[part]) current[part] = isNaN(path[i + 1]) ? {} : [];
//         current = current[part];
//       }

//       const lastPart = path[path.length - 1];
//       current[lastPart] = type === "checkbox" ? checked : value;
//       return newState;
//     });
//   };

//   const submitHandler = async () => {
//     try {
//       const res = await axios.post(
//         `${import.meta.env.VITE_BASE_URL}/user/create-raid`,
//         formData
//       );
//       toast.success("Request created");
//       navigate("/raidPage");
//     } catch (error) {
//       console.error("Failed to create raid:", error);
//       toast.error("Failed to create request");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center p-4">
//       <div className="w-full max-w-md bg-zinc-800 p-6 rounded shadow-lg space-y-4">
//         <h2 className="text-xl font-bold mb-4 text-center">
//           Unplanned Raid Report
//         </h2>

//         <div>
//           <label htmlFor="inCharge" className="block mb-1 text-sm">
//             Raid Officer
//           </label>
//           <select
//             name="inCharge"
//             id="inCharge"
//             value={formData.inCharge}
//             onChange={handleChange}
//             className="w-full px-3 py-2 rounded bg-zinc-700 text-white border border-zinc-600"
//           >
//             <option value="">Select a Raid Officer</option>
//             {officers.map((officer) => (
//               <option key={officer._id} value={officer.username}>
//                 {officer.username}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block mb-2 text-sm">Culprit Details</label>
//           <input
//             type="text"
//             name="culprits[0].name"
//             value={formData.culprits[0].name}
//             onChange={handleChange}
//             placeholder="Culprit Name"
//             className="w-full px-3 py-2 rounded bg-zinc-700 text-white border border-zinc-600 mb-2"
//           />
//           <input
//             type="text"
//             name="culprits[0].identification"
//             value={formData.culprits[0].identification}
//             onChange={handleChange}
//             placeholder="Identification Number"
//             className="w-full px-3 py-2 rounded bg-zinc-700 text-white border border-zinc-600 mb-2"
//           />
//           <input
//             type="text"
//             name="culprits[0].description"
//             value={formData.culprits[0].description}
//             onChange={handleChange}
//             placeholder="Culprit Description"
//             className="w-full px-3 py-2 rounded bg-zinc-700 text-white border border-zinc-600"
//           />
//         </div>

//         <div>
//           <label htmlFor="address" className="block mb-1 text-sm">
//             Location Address
//           </label>
//           <input
//             type="text"
//             name="location.address"
//             value={formData.location.address}
//             onChange={handleChange}
//             className="w-full px-3 py-2 rounded bg-zinc-700 text-white border border-zinc-600"
//           />
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label htmlFor="longitude" className="block mb-1 text-sm">
//               Longitude
//             </label>
//             <input
//               type="text"
//               name="location.coordinates.longitude"
//               value={formData.location.coordinates.longitude}
//               onChange={handleChange}
//               className="w-full px-3 py-2 rounded bg-zinc-700 text-white border border-zinc-600"
//             />
//           </div>
//           <div>
//             <label htmlFor="latitude" className="block mb-1 text-sm">
//               Latitude
//             </label>
//             <input
//               type="text"
//               name="location.coordinates.latitude"
//               value={formData.location.coordinates.latitude}
//               onChange={handleChange}
//               className="w-full px-3 py-2 rounded bg-zinc-700 text-white border border-zinc-600"
//             />
//           </div>
//         </div>

//         <div className="flex items-center space-x-2">
//           <input
//             type="checkbox"
//             name="location.hotspot"
//             checked={formData.location.hotspot}
//             onChange={handleChange}
//             className="text-blue-600"
//           />
//           <label htmlFor="hotspot" className="text-sm">
//             Mark as Hotspot
//           </label>
//         </div>

//         <div>
//           <label htmlFor="scheduledDate" className="block mb-1 text-sm">
//             Scheduled Date
//           </label>
//           <input
//             type="date"
//             name="scheduledDate"
//             value={formData.scheduledDate}
//             onChange={handleChange}
//             className="w-full px-3 py-2 rounded bg-zinc-700 text-white border border-zinc-600"
//           />
//         </div>

//         <div>
//           <label htmlFor="description" className="block mb-1 text-sm">
//             Description
//           </label>
//           <textarea
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             className="w-full px-3 py-2 rounded bg-zinc-700 text-white border border-zinc-600"
//             rows="4"
//           />
//         </div>

//         <button
//           onClick={submitHandler}
//           className="w-full py-2 px-4 bg-yellow-300 text-black rounded hover:bg-yellow-400 transition-colors"
//         >
//           Request Approval
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Unplanned;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Unplanned() {
  const [officers, setOfficers] = useState([]);
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const getOfficers = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/user/get-all-raid-officers`,
          {
            headers: {
              "x-access-key": import.meta.env.VITE_SECRET_ACCESS_KEY,
            },
          }
        );
        setOfficers(res.data.users);
      } catch (error) {
        console.error("Failed to fetch officers:", error);
      }
    };
    getOfficers();
  }, []);

  return (
    <div className="min-h-screen bg-[#213448]">
      <Navbar />
      <div className="container mx-auto p-4 md:p-8">
        <div className="bg-[#2d4055] rounded-lg shadow-md p-6 text-white">
          <h2 className="text-xl font-semibold text-white mb-6">
            Unplanned Raid Request
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Raid Officer Selection */}
            <div>
              <label
                htmlFor="officer"
                className="block text-gray-300 text-sm font-medium mb-2"
              >
                Raid officer :
              </label>
              <select
                id="officer"
                className="py-3 px-4 bg-[#3a4e66] border border-[#4a607a] rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 w-full text-white"
              >
                <option value="" className="bg-[#3a4e66]">
                  Option
                </option>
                {officers.map((officer) => (
                  <option
                    key={officer._id}
                    value={officer.username}
                    className="bg-[#3a4e66]"
                  >
                    {officer.username}
                  </option>
                ))}
              </select>
            </div>

            {/* Suspect Name */}
            <div>
              <label
                htmlFor="suspectName"
                className="block text-gray-300 text-sm font-medium mb-2"
              >
                Suspect name :
              </label>
              <input
                type="text"
                id="suspectName"
                className="outline-none py-3 px-4 bg-[#3a4e66] border border-[#4a607a] rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 w-full text-white"
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
                type="text"
                id="address"
                className="outline-none py-3 px-4 bg-[#3a4e66] border border-[#4a607a] rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 w-full text-white"
              />
            </div>

            {/* Raid Date */}
            <div>
              <label
                htmlFor="raidDate"
                className="block text-gray-300 text-sm font-medium mb-2"
              >
                Raid date :
              </label>
              <input
                type="date"
                id="raidDate"
                defaultValue={today}
                className="outline-none py-3 px-4 bg-[#3a4e66] border border-[#4a607a] rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 w-full text-white"
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
              id="description"
              rows="3"
              className="outline-none py-3 px-4 bg-[#3a4e66] border border-[#4a607a] rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 w-full text-white"
              placeholder="Enter raid description"
            ></textarea>
          </div>

          {/* Request Approval Button */}
          <div className="flex justify-end">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
              type="button"
            >
              Request approval
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Unplanned;
