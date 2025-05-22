import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import SearchCriminal from "../components/SearchCriminal";
import UploadImage from "../components/UploadImage";
import UploadVideo from "../components/UploadVideo";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

function Planned() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [writtenReport, setwrittenReport] = useState("");
  const crimainalId = localStorage.getItem("criminalId");
  const licenceId = localStorage.getItem("licenceId");
  const evidenceId = localStorage.getItem("evidenceId");
  const raidId = localStorage.getItem("raidId");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const getRaidInfo = async () => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/user/raid/${id}`
        );
        setData(res.data.info);
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (err) {
        setError(err.message || "Failed to fetch raid info");
        console.error(err);
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500);
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

  if (loading)
    return (
      <div className="">
        <Loading />
      </div>
    );
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!data) return <div className="p-4">No data found</div>;

  const info = { crimainalId, licenceId, evidenceId, raidId, writtenReport };
  console.log(info);

  const SubmitRaid = async () => {
    const confirm = prompt(
      "Are you sure ? This can't be undone ! please type CONFIRM "
    );
    if (confirm === "CONFIRM") {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/confirm-raid`,
        info
      );
      console.log(res);
      if (res.status == 200) {
        toast.success("Raid Completed Successfully");
        setTimeout(() => {
          setLoading(false);
        }, 500);
        navigate("/raidPage");
        localStorage.removeItem("criminalId");
        localStorage.removeItem("criminalId");
        localStorage.removeItem("raidId");
      } else {
        setTimeout(() => {
          setLoading(false);
        }, 500);
        toast.error("Something went wrong, Please Re-submmit again");
      }
    }
  };

  const downloadWarrant = () => {
    const fileUrl = data.warrant?.fileUrl; // "/uploads/warrant-1747837969061.pdf"
    if (!fileUrl) return;

    const filename = fileUrl.split("/").pop(); // "warrant-1747837969061.pdf"
    const downloadUrl = `${
      import.meta.env.VITE_BASE_URL
    }/user/download/${filename}`;

    console.log("Download URL:", downloadUrl); // Debug log

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "warrant.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {/* <Navbar /> */}

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
                  <span className="text-gray-100">
                    {data.location?.coordinates?.latitude ? (
                      <>
                        Latitude: {data.location.coordinates.latitude}° N,
                        <br></br>
                        Longitude: {data.location.coordinates.longitude}° E
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
                    Start Date:
                  </span>{" "}
                  <span className="text-gray-100">
                    {formatDateTime(data.actualStartDate)}
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
                    {/* <button
                      className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-xs focus:outline-none focus:shadow-outline transition-colors duration-200"
                      onClick={() =>
                        window.open(data.warrant.fileUrl, "_blank")
                      }
                    >
                      View Warrant
                    </button> */}
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={downloadWarrant}
                className={
                  !data.warrant.fileUrl
                    ? "hidden"
                    : "bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md text-sm focus:outline-none focus:shadow-outline transition-colors duration-200"
                }
              >
                {!data.warrant.fileUrl ? "Not Uploaded" : "Download Warrent"}
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
                className="w-full border shadow-md rounded outline-none p-5"
                placeholder="Enter a summury of the raid"
                value={writtenReport}
                onChange={(e) => {
                  setwrittenReport(e.target.value);
                }}
                name="written-report"
                id="written-report"
                rows="8"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Search for crimainal record */}
        <div className="">
          <SearchCriminal />
        </div>

        {/* Uploading the image */}
        <div className="mt-3">
          <UploadImage />
        </div>

        {/* Uploading the Video */}

        <div className="">
          <UploadVideo />
        </div>

        {/* Save the Raid Button */}

        <div className=" border-[#2c4258] h-auto w-full mt-4 shadow-2xl rounded-md p-5 text-center">
          <button
            onClick={SubmitRaid}
            className="px-10 py-2 bg-amber-400 rounded hover:bg-amber-600"
          >
            Submit Raid
          </button>
        </div>
      </div>
    </>
  );
}

export default Planned;
