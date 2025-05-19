// import React, { useEffect, useState, useRef } from "react";
// import { useParams } from "react-router-dom";
// import UploadImage from "../components/UploadImage";
// import axios from "axios";
// import UploadVideo from "../components/UploadVideo";
// import SearchCriminal from "../components/SearchCriminal";
// import { toast } from "react-toastify";

// function Planned() {
//   const { id, userId } = useParams();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [info, setInfo] = useState(null);

//   // gets all the info about the raid

//   useEffect(() => {
//     const getRaidInfo = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.post(
//           `${import.meta.env.VITE_BASE_URL}/user/raid/${id}`
//         );
//         setInfo(res.data.info);
//       } catch (err) {
//         setError(err.message || "Failed to fetch raid info");
//       } finally {
//         setLoading(false);
//       }
//     };
//     getRaidInfo();
//   }, [id]);

//   const notify = (e) => {
//     e.preventDefault();
//     const approved = prompt(
//       "Approve Raid ? No changes can be made afterwords ! Please Type Confirm "
//     );
//     if (approved === "Confirm") {
//       toast.success("Raid Submitted");
//     } else {
//       toast.info("Not Approved");
//     }
//   };

//   if (loading) return <div>Loading raid information...</div>;
//   if (error) return <div>Error: {error}</div>;
//   if (!info) return <div>No raid information found</div>;

//   return (
//     <div className="min-h-screen bg-zinc-800 text-white p-5">
//       <div className="raid-info-container max-w-4xl mx-auto">
//         <h2 className="mb-6 text-3xl font-bold text-white">Raid Details</h2>

//         <div className="grid gap-4 mb-8">{/* Raid details rendering... */}</div>

//         <div className="flex gap-4 mb-8">
//           <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition">
//             Download Warrant
//           </button>
//           <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition">
//             Preview Warrant
//           </button>
//         </div>
//         {/* Image uploader */}
//         <div className="">
//           <UploadImage />
//         </div>
//         <div className="">
//           <UploadVideo />
//         </div>
//         <div className="">
//           <SearchCriminal />
//         </div>
//         <div className="flex justify-center items-center">
//           <form>
//             <button
//               className="bg-blue-500 mt-5 px-3 py-3 rounded"
//               onClick={notify}
//             >
//               Approve
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Planned;

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import axios from "axios";
import SearchCriminal from "../components/SearchCriminal";

function Planned() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getRaidInfo = async () => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/user/raid/${id}`
        );
        setData(res.data.info);
      } catch (err) {
        setError(err.message || "Failed to fetch raid info");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getRaidInfo();
  }, [id]);

  const formatDateTime = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleTimeString();
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!data) return <div className="p-4">No data found</div>;

  return (
    <>
      <Navbar />

      {/* Pre-filled Raid info */}

      <div className="p-4">
        <div className="border border-[#2c4258] h-auto w-full mt-4 shadow-2xl rounded-md">
          <div className="rounded-lg shadow-md p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-white">
              {data.raidType === "unplanned"
                ? "Unplanned Raid"
                : "Planned Raid"}{" "}
              Details
            </h1>

            <div className="bg-[#2c4258] text-white rounded-md p-4 mb-4">
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <div className="font-semibold text-gray-300">Raid Status:</div>
                <div className="capitalize text-white">{data.status}</div>

                <div className="font-semibold text-gray-300">Raid Officer:</div>
                <div className="text-white">
                  {data.inCharge || "Not specified"}
                </div>

                <div className="font-semibold text-gray-300">Suspect(s):</div>
                <div className="text-white">
                  {data.culprits?.length > 0 ? (
                    data.culprits.map((culprit, idx) => (
                      <div key={idx}>{culprit.name}</div>
                    ))
                  ) : (
                    <div>No suspects listed</div>
                  )}
                </div>

                <div className="font-semibold text-gray-300">Address:</div>
                <div className="text-white">
                  {data.location?.address || "Not specified"}
                </div>

                <div className="font-semibold text-gray-300">
                  Scheduled Date:
                </div>
                <div className="text-white">
                  {formatDate(data.scheduledDate)}
                </div>

                <div className="font-semibold text-gray-300">
                  Scheduled Time:
                </div>
                <div className="text-white">
                  {formatTime(data.scheduledDate)}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="basic-description"
                  className="block font-semibold text-gray-300 mb-2"
                >
                  Description
                </label>
                <span className="bg-red-700 text-white text-xs font-bold uppercase rounded-full px-2 py-0.5">
                  uneditable
                </span>
              </div>
              <textarea
                id="basic-description"
                className="w-full rounded-md p-3 border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-[#344d64] text-gray-100"
                rows="3"
                value={data.description || "No description provided"}
                readOnly
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-[#344d64] rounded-md p-4 text-sm text-gray-100">
                <h3 className="font-semibold mb-2 text-gray-100">
                  Location Details
                </h3>
                <div className="mb-1">
                  <span className="font-semibold text-gray-300">Address:</span>{" "}
                  <span className="text-gray-100">
                    {data.location?.address || "Not specified"}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-300">
                    Coordinates:
                  </span>{" "}
                  <span className="text-gray-100">
                    {data.location?.coordinates?.latitude ? (
                      <>
                        Latitude:{" "}
                        {data.location.coordinates.latitude.toFixed(6)}° N,
                        Longitude:{" "}
                        {data.location.coordinates.longitude.toFixed(6)}° E
                      </>
                    ) : (
                      "Not specified"
                    )}
                  </span>
                </div>
              </div>

              <div className="bg-[#344d64] rounded-md p-4 text-sm text-gray-100">
                <h3 className="font-semibold mb-2 text-gray-100">
                  Timing Details
                </h3>
                <div className="mb-1">
                  <span className="font-semibold text-gray-300">
                    Scheduled:
                  </span>{" "}
                  <span className="text-gray-100">
                    {formatDateTime(data.scheduledDate)}
                  </span>
                </div>
                <div className="mb-1">
                  <span className="font-semibold text-gray-300">
                    Actual Start:
                  </span>{" "}
                  <span className="text-gray-100">
                    {formatDateTime(data.actualStartDate)}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-300">
                    Actual End:
                  </span>{" "}
                  <span className="text-gray-100">
                    {formatDateTime(data.actualEndDate)}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-[#344d64] rounded-md p-4 text-sm text-gray-100">
                <h3 className="font-semibold mb-2 text-gray-100">
                  Request Details
                </h3>
                <div className="mb-1">
                  <span className="font-semibold text-gray-300">
                    Request Date:
                  </span>{" "}
                  <span className="text-gray-100">
                    {formatDateTime(data.unplannedRequestDetails?.requestDate)}
                  </span>
                </div>
                <div className="mb-1">
                  <span className="font-semibold text-gray-300">
                    Approval Status:
                  </span>{" "}
                  <span
                    className={`font-bold ${
                      data.unplannedRequestDetails?.approvalStatus ===
                      "approved"
                        ? "text-green-600"
                        : data.unplannedRequestDetails?.approvalStatus ===
                          "rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    } text-gray-100`}
                  >
                    {data.unplannedRequestDetails?.approvalStatus || "Pending"}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-300">
                    Approved By:
                  </span>{" "}
                  <span className="text-gray-100">
                    {data.unplannedRequestDetails?.approvedBy ||
                      "Not specified"}
                  </span>
                </div>
              </div>

              <div className="bg-[#344d64] rounded-md p-4 text-sm text-gray-100">
                <h3 className="font-semibold mb-2 text-gray-100">
                  Warrant Details
                </h3>
                <div className="mb-1">
                  <span className="font-semibold text-gray-300">Status:</span>{" "}
                  <span className="text-gray-100">
                    {data.warrant?.fileUrl ? "Uploaded" : "Not uploaded"}
                  </span>
                </div>
                {data.warrant?.fileUrl && (
                  <>
                    <div className="mb-1">
                      <span className="font-semibold text-gray-300">
                        Uploaded At:
                      </span>{" "}
                      <span className="text-gray-100">
                        {formatDateTime(data.warrant.uploadedAt)}
                      </span>
                    </div>
                    <button
                      className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-xs focus:outline-none focus:shadow-outline transition-colors duration-200"
                      onClick={() =>
                        window.open(data.warrant.fileUrl, "_blank")
                      }
                    >
                      View Warrant
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md text-sm focus:outline-none focus:shadow-outline transition-colors duration-200">
                Download Warrent
              </button>
            </div>
          </div>
        </div>

        {/* Written Report */}

        <div className="">
          <div className="border border-[#2c4258] h-auto w-full mt-4 shadow-2xl rounded-md p-5">
            <div className="text-center text-2xl py-2 border rounded">
              <h3>Written Report</h3>
            </div>
            <div className="mt-3">
              <textarea
                className="w-full border shadow-md rounded outline-none p-2"
                placeholder="Enter a summury of the raid"
                name=""
                id=""
                rows="8"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Search for crimainal record */}

        <SearchCriminal/>
      </div>
    </>
  );
}

export default Planned;
