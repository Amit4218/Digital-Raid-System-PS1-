import React, { useState, useEffect } from "react";
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
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";

const ApprovedReview = () => {
  const navigate = useNavigate();
  const { raidId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/admin/raid-evidence/${raidId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching raid details:", error);
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

  return (
    <div className="bg-gray-50 p-6 rounded-lg font-sans overflow-y-auto h-[calc(100vh-2rem)] no-scrollbar">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-blue-100">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 capitalize">
              Approved Raid Details
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

      {/* Approval Details */}
      {raid.raidApproved && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
            <CheckCircle className="text-blue-600" size={20} />
            Approval Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-blue-700">
                <span className="font-medium">Approved By:</span>{" "}
                {raid.raidApproved.approvedBy || "N/A"}
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

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar - Raid Overview */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <User className="text-blue-600" size={20} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Raid Officer
                </h3>
                <p className="font-semibold">{raid.inCharge}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <User className="text-purple-600" size={20} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Primary Suspect
                </h3>
                <p className="font-semibold">{primaryCulprit.name || "N/A"}</p>
                <p className="text-sm text-gray-500">
                  ID: {primaryCulprit.identification || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <MapPin className="text-green-600" size={20} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Location</h3>
                <p className="font-semibold">{raid.location.address}</p>
                <p className="text-sm text-gray-500">
                  Lat: {raid.location.coordinates.latitude}, Long:{" "}
                  {raid.location.coordinates.longitude}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <Calendar className="text-yellow-600" size={20} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Raid Date</h3>
                <p className="font-semibold">
                  {formatShortDate(raid.scheduledDate)}
                </p>
                <p className="text-sm text-gray-500">
                  {formatTime(raid.actualStartDate)} -{" "}
                  {formatTime(raid.actualEndDate)}
                </p>
              </div>
            </div>

            {/* Warrant Section */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium flex items-center gap-2">
                  <FileText className="text-gray-600" size={18} />
                  Raid Warrant
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    disabled={!raid.warrant?.fileUrl}
                    className={`text-sm bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded flex items-center gap-1 ${
                      !raid.warrant?.fileUrl
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <Eye size={16} />
                    Preview
                  </button>
                  <button
                    onClick={handleDownloadWarrant}
                    disabled={!raid.warrant?.fileUrl}
                    className={`text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded flex items-center gap-1 ${
                      !raid.warrant?.fileUrl
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <Download size={16} />
                    Download
                  </button>
                </div>
              </div>
              {raid.warrant?.hash && (
                <div className="mt-2 text-xs text-gray-500">
                  <span className="font-medium">Hash:</span> {raid.warrant.hash}
                </div>
              )}
              {showPreview && raid.warrant?.fileUrl && (
                <div className="mt-4">
                  <iframe
                    src={raid.warrant.fileUrl}
                    title="Warrant Preview"
                    className="w-full h-64 border rounded"
                  ></iframe>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Crime and Raid Descriptions */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              Crime Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Crime Description
                </label>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <p className="text-gray-800">
                    {primaryCulprit.description || "No description provided"}
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Raid Description
                </label>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <p className="text-gray-800">
                    {raid.description || "No description provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Written Report */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText size={20} />
              Written Report
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-gray-800 whitespace-pre-line">
                {raid.writtenReport || "No written report submitted yet."}
              </p>
            </div>
          </div>

          {/* License Information */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">License Information</h2>
            {raid.licence ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Holder Name
                  </label>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    {raid.licence.holderName}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    License ID
                  </label>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    {raid.licence.licenceId}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Previous Crime Record
                  </label>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                    No Previous Crime Record Found
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No license information available</p>
            )}
          </div>

          {/* Evidence Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Seized Evidence</h2>

            {evidence?.[0] ? (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Description
                  </label>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    {evidence[0].description}
                  </div>
                </div>

                {/* Evidence Images */}
                <div className="mb-6">
                  <h3 className="text-md font-medium mb-3">
                    Photographic Evidence
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {evidenceImages.fileUrl?.length > 0 ? (
                      evidenceImages.fileUrl.map((imageUrl, index) => (
                        <div key={index} className="border rounded-lg overflow">
                          <img
                            src={imageUrl}
                            alt={`Evidence ${index + 1}`}
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                              e.target.src = "/image-placeholder.svg";
                              e.target.className =
                                "w-full h-48 object-contain p-4 bg-gray-100";
                            }}
                          />
                          <div className="p-2 bg-gray-50">
                            <div className="flex justify-between items-center">
                              <span className="text-sm truncate">
                                {evidenceImages.originalName?.[index] ||
                                  `image_${index + 1}`}
                              </span>
                              <button
                                onClick={() =>
                                  handleDownloadImage(
                                    imageUrl,
                                    evidenceImages.originalName?.[index]
                                  )
                                }
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Download size={16} />
                              </button>
                            </div>
                            {evidenceImages.hash && (
                              <div className="text-xs text-gray-500 mt-1 truncate">
                                Hash: {evidenceImages.hash}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 col-span-2">
                        No images available
                      </p>
                    )}
                  </div>
                </div>

                {/* Evidence Videos Table */}
                <div>
                  <h3 className="text-md font-medium mb-3">Video Evidence</h3>
                  {evidenceVideos.fileUrl?.length > 0 ? (
                    <div className="overflow-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Video
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Hash
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {evidenceVideos.fileUrl.map((videoUrl, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <Video className="flex-shrink-0 h-5 w-5 text-gray-400" />
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      {evidenceVideos.originalName?.[index] ||
                                        `video_${index + 1}`}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500 font-mono truncate max-w-xs">
                                  {evidenceVideos.hash || "N/A"}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleViewVideo(videoUrl)}
                                    className="text-blue-600 hover:text-blue-900"
                                  >
                                    View
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDownloadVideo(
                                        videoUrl,
                                        evidenceVideos.originalName?.[index]
                                      )
                                    }
                                    className="text-green-600 hover:text-green-900"
                                  >
                                    Download
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500">No videos available</p>
                  )}
                </div>
              </>
            ) : (
              <p className="text-gray-500">
                No evidence collected for this raid
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Approval Confirmation */}
      <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <CheckCircle className="text-green-600" size={24} />
          <div>
            <h3 className="font-medium text-green-800">
              Approval Confirmation
            </h3>
            <p className="text-sm text-green-700">
              This raid has been officially approved and verified.
            </p>
          </div>
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
      </div>
    </div>
  );
};

export default ApprovedReview;
