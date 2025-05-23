import React, { useEffect, useState } from "react";
import {
  Eye,
  Download,
  X,
  Clock,
  MapPin,
  Calendar,
  User,
  FileText,
  Video,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";

const ApproveReport = () => {
  const navigate = useNavigate();
  const { raidId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [approveError, setApproveError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/admin/raid-evidence/${raidId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching raid evidence:", error);
        setError(
          error.response?.data?.message || "Failed to fetch raid details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [raidId]);

  const handleDownloadWarrant = () => {
    if (!data?.raid?.warrant?.fileUrl) return;

    const link = document.createElement("a");
    link.href = data.raid.warrant.fileUrl;
    link.download = `warrant-${raidId}.pdf`;
    link.click();
  };

  const handleDownloadImage = (imageUrl, originalName) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = originalName || `evidence-image-${Date.now()}.jpg`;
    link.click();
  };

  const handleViewVideo = (videoUrl) => {
    window.open(videoUrl, "_blank");
  };

  const handleDownloadVideo = (videoUrl, originalName) => {
    const link = document.createElement("a");
    link.href = videoUrl;
    link.download = originalName || `evidence-video-${Date.now()}.mp4`;
    link.click();
  };

  const handleClose = () => {
    navigate("/admin/raids");
  };

  const handleApproveRaid = async () => {
    try {
      setIsApproving(true);
      setApproveError(null);

      // Get current user ID from local storage or context
      const approvedBy = localStorage.getItem("adminId"); // Adjust based on your auth system

      if (!approvedBy) {
        throw new Error("User information not available");
      }

      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/admin/raid-approve/${raidId}`,
        { approvedBy },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      try {
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/admin/audit-log`,
          {
            action: "raid_approved",
            performedBy: approvedBy,
            targetId: raidId,
            targetType: "raid",
            changes: [
              {
                field: "status",
                oldValue: "completed",
                newValue: "completed_approved",
              },
              {
                field: "approvedBy",
                oldValue: null,
                newValue: approvedBy,
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } catch (auditError) {
        console.error("Failed to create audit log:", auditError);
        // Don't fail the whole operation if audit logging fails
      }


      // Update local state with approved raid
      setData((prev) => ({
        ...prev,
        raid: {
          ...prev.raid,
          status: "completed_approved",
          raidApproved: response.data.raid.raidApproved,
        },
      }));
      
      setShowApproveModal(false);
    } catch (error) {
      console.error("Error approving raid:", error);
      setApproveError(
        error.response?.data?.message || "Failed to approve raid"
      );
    } finally {
      setIsApproving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "PPpp");
  };

  const formatShortDate = (dateString) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "PP");
  };

  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "p");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong className="font-bold">Error! </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (!data) {
    return <div className="text-center py-8">No raid data found</div>;
  }

  const { raid, evidence } = data;
  const primaryCulprit = raid.culprits?.[0] || {};
  const evidenceImages = evidence?.[0]?.mediaFiles?.images || {};
  const evidenceVideos = evidence?.[0]?.mediaFiles?.videos || {};

  // Check if raid is already approved
  const isApproved = raid.status === "completed_approved";

  return (
    <div className="bg-gray-50 p-6 rounded-lg font-sans">
      {/* Approval Confirmation Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-yellow-500" size={24} />
              <h3 className="text-lg font-bold">Confirm Approval</h3>
            </div>

            <div className="space-y-4">
              <p className="text-gray-700">
                Are you sure you want to approve this raid? Once approved, it
                cannot be changed.
              </p>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      By approving, you confirm that:
                    </p>
                    <ul className="list-disc pl-5 mt-1 text-sm text-yellow-700 space-y-1">
                      <li>All evidence is properly documented</li>
                      <li>The raid was conducted according to protocol</li>
                      <li>All information is accurate and complete</li>
                    </ul>
                  </div>
                </div>
              </div>

              {approveError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {approveError}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowApproveModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                  disabled={isApproving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleApproveRaid}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
                  disabled={isApproving}
                >
                  {isApproving ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Approving...
                    </>
                  ) : (
                    "Confirm Approval"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-full ${
              raid.status === "completed"
                ? "bg-green-100"
                : raid.status === "completed_approved"
                ? "bg-blue-100"
                : "bg-gray-100"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full ${
                raid.status === "completed"
                  ? "bg-green-500"
                  : raid.status === "completed_approved"
                  ? "bg-blue-500"
                  : "bg-gray-500"
              }`}
            ></div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 capitalize">
              {raid.status.replace("_", " ")} Raid Details
            </h1>
            <p className="text-sm text-gray-500">
              Raid ID: {raidId}
              {raid.raidApproved?.approvalDate && (
                <span className="ml-3">
                  Approved on: {formatDate(raid.raidApproved.approvalDate)}
                </span>
              )}
            </p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-full transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar - Raid Overview */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          {/* ... (previous left sidebar content) ... */}
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* ... (previous main content sections) ... */}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={handleClose}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-6 py-2 rounded-lg transition-colors"
        >
          Close
        </button>

        {!isApproved && raid.status === "completed" && (
          <button
            onClick={() => setShowApproveModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            Approve Report
          </button>
        )}

        {isApproved && (
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Report Approved
          </div>
        )}
      </div>

      {/* Approval Details */}
      {isApproved && raid.raidApproved && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-800 mb-2">Approval Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-blue-700">
                <span className="font-medium">Approved By:</span> User ID{" "}
                {raid.raidApproved.approvedBy}
              </p>
              <p className="text-sm text-blue-700">
                <span className="font-medium">Approval Date:</span>{" "}
                {formatDate(raid.raidApproved.approvalDate)}
              </p>
            </div>
            <div>
              <p className="text-sm text-blue-700">
                <span className="font-medium">Verification Hash:</span>
              </p>
              <code className="text-xs bg-blue-100 p-1 rounded break-all">
                {raid.raidApproved.raidHash}
              </code>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApproveReport;
