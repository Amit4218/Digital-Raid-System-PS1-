import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import TokenValidator from "../utils/tokenValidator";


function RaidPage() {
  TokenValidator();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [raids, setRaids] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const userId = localStorage.getItem("userId");

  // Fetch all raids
  useEffect(() => {
    setLoading(true);
    const getRaids = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/user/get-all-raids`,
          {
            headers: {
              "x-access-key": import.meta.env.VITE_SECRET_ACCESS_KEY,
            },
          }
        );

        // Check if response has raids array
        if (res.data?.raids && Array.isArray(res.data.raids)) {
          // Filter raids where inchargeId matches userId
          const userRaids = res.data.raids.filter(
            (raid) => raid.inchargeId === userId
          );
          setRaids(userRaids);
        } else {
          setRaids([]);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching raids:", error);
        toast.error("Failed to fetch raids");
        setLoading(false);
      }
    };

    getRaids();
  }, [userId]);

  const canStartRaid = useCallback((raid) => {
    if (!raid) return false;

    if (raid.status === "completed" || raid.status === "active") {
      return false;
    }

    if (raid.isUnplannedRequest) {
      return raid.unplannedRequestDetails?.approvalStatus === "approved";
    }

    return raid.status === "pending" && raid.raidApproved?.isApproved === true;
  }, []);

  const handleStartRaid = (raidId) => {
    navigate("/permission", { state: { raidId } });
  };

  // Filter raids based on conditions
  const filteredRaids = raids.filter((raid) => {
    const isApproved = raid.raidApproved?.isApproved === true;
    const isPending = raid.status === "pending";
    const isActive = raid.status === "active";
    const matchesSearch =
      raid._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      raid.inCharge?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      raid.location?.address?.toLowerCase().includes(searchTerm.toLowerCase());

    return ((isApproved && isPending) || isActive) && matchesSearch;
  });

  if (loading) return <Loading />;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Raid Operations
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              View and manage all active and approved raids
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="mb-6 bg-gray-800 rounded-xl p-4 shadow-lg">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-grow w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search raids by ID, incharge or address..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full md:w-auto">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400 text-sm">Status:</span>
                  <div className="flex space-x-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-600/30 text-amber-300">
                      Active
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-600/30 text-green-300">
                      Approved
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Raids Card */}
          <div className="bg-gray-800/80 border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
            {/* Desktop Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 py-4 px-6 bg-gray-700/50 rounded-t-xl font-semibold text-amber-400 text-sm uppercase tracking-wider border-b border-gray-700">
              <span className="col-span-3">Raid ID</span>
              <span className="col-span-2">Incharge</span>
              <span className="col-span-3">Location</span>
              <span className="col-span-2">Type</span>
              <span className="col-span-2 text-center">Action</span>
            </div>

            {/* Raids List */}
            <div className="overflow-y-auto max-h-[calc(100vh-250px)] custom-scroll">
              {filteredRaids.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-gray-400 py-12 text-lg">
                  <svg
                    className="h-16 w-16 mb-4 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p>No active or approved raids found</p>
                  <p className="text-sm mt-1 text-gray-500">
                    Try adjusting your search or check back later
                  </p>
                </div>
              ) : (
                filteredRaids.map((raid, idx) => (
                  <div
                    key={raid._id || idx}
                    className={`flex flex-col md:grid md:grid-cols-12 gap-4 py-4 px-6 border-b border-gray-700 last:border-b-0 transition-all duration-200 hover:bg-gray-700/30 ${
                      raid.status === "active" ? "bg-gray-700/20" : ""
                    }`}
                  >
                    {/* Mobile View */}
                    <div className="md:hidden space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-amber-400">
                            {raid.inCharge || "N/A"}
                          </h3>
                          <p className="text-xs text-gray-400 mt-1">
                            {Array.isArray(raid.raidType)
                              ? raid.raidType.join(", ")
                              : raid.raidType || "N/A"}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            raid.status === "completed"
                              ? "bg-green-600/30 text-green-300"
                              : raid.status === "active"
                              ? "bg-amber-600/30 text-amber-300"
                              : "bg-red-600/30 text-red-300"
                          }`}
                        >
                          {raid.status || "unknown"}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-start">
                          <svg
                            className="h-4 w-4 text-gray-500 mr-1.5 mt-0.5 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <p className="text-sm text-gray-300 break-words">
                            {raid.location?.address || "N/A"}
                          </p>
                        </div>

                        <div className="flex items-start">
                          <svg
                            className="h-4 w-4 text-gray-500 mr-1.5 mt-0.5 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <p className="text-xs font-mono text-gray-400 break-all">
                            {raid._id || "N/A"}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleStartRaid(raid._id)}
                        className={`w-full py-2 rounded-lg text-sm font-bold transition-all duration-200 flex items-center justify-center ${
                          canStartRaid(raid)
                            ? "bg-gradient-to-r from-amber-500 to-amber-600 text-gray-900 hover:from-amber-400 hover:to-amber-500 shadow-md"
                            : "bg-gray-700 text-gray-500 cursor-not-allowed"
                        }`}
                        disabled={!canStartRaid(raid)}
                      >
                        {raid.status === "active" ? (
                          <>
                            <svg
                              className="h-4 w-4 mr-2 animate-pulse"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                              />
                            </svg>
                            In Progress
                          </>
                        ) : raid.status === "completed" ? (
                          "Completed"
                        ) : (
                          "Start Raid"
                        )}
                      </button>
                    </div>

                    {/* Desktop View */}
                    <span className="hidden md:flex items-center col-span-3 font-mono text-xs text-gray-300 break-all">
                      <svg
                        className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {raid._id || "N/A"}
                    </span>
                    <span className="hidden md:flex items-center col-span-2 text-gray-300 truncate">
                      <svg
                        className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      {raid.inCharge || "N/A"}
                    </span>
                    <span className="hidden md:flex items-start col-span-3 text-gray-300">
                      <svg
                        className="h-4 w-4 text-gray-500 mr-2 mt-0.5 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="break-words">
                        {raid.location?.address || "N/A"}
                      </span>
                    </span>
                    <span className="hidden md:flex items-center col-span-2 text-gray-300">
                      <svg
                        className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      {Array.isArray(raid.raidType)
                        ? raid.raidType.join(", ")
                        : raid.raidType || "N/A"}
                    </span>

                    {/* Status & Action (Desktop) */}
                    <div className="hidden md:flex flex-col items-center justify-center col-span-2 space-y-2">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          raid.status === "completed"
                            ? "bg-green-600/30 text-green-300"
                            : raid.status === "active"
                            ? "bg-amber-600/30 text-amber-300"
                            : "bg-red-600/30 text-red-300"
                        }`}
                      >
                        {raid.status || "unknown"}
                      </span>
                      <button
                        onClick={() => handleStartRaid(raid._id)}
                        className={`w-full max-w-[120px] py-2 rounded-md text-xs font-bold transition-all duration-200 flex items-center justify-center ${
                          canStartRaid(raid)
                            ? "bg-gradient-to-r from-amber-500 to-amber-600 text-gray-900 hover:from-amber-400 hover:to-amber-500 shadow-sm"
                            : "bg-gray-700 text-gray-500 cursor-not-allowed"
                        }`}
                        disabled={!canStartRaid(raid)}
                      >
                        {raid.status === "active" ? (
                          <>
                            <svg
                              className="h-3 w-3 mr-1 animate-pulse"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                              />
                            </svg>
                            In Progress
                          </>
                        ) : raid.status === "completed" ? (
                          "Completed"
                        ) : (
                          "Start Raid"
                        )}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RaidPage;
