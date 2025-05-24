import React, { useState, useEffect } from "react";
import axios from "axios";

function Complains() {
  const [complains, setComplains] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getComplain = async () => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/department/get-all-complain`
        );
        if (res.status === 200) {
          setComplains(res.data.complains);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Error fetching data");
      } finally {
        setLoading(false);
      }
    };
    getComplain();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center">
          Complaint Reports
        </h1>

        {complains.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-200">
            <p className="text-xl text-gray-600 font-medium">
              No complaints found at the moment.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {complains.map((complain, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1"
              >
                <div className="p-7">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5">
                    <span
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide ${
                        complain.complaintType === "drug"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {complain.complaintType === "drug"
                        ? "DRUG RELATED"
                        : "LIQUOR RELATED"}
                    </span>
                    <span className="text-sm text-gray-500 mt-2 sm:mt-0">
                      Filed on:{" "}
                      <span className="font-medium text-gray-700">
                        {new Date(complain.createdAt).toLocaleDateString()}
                      </span>
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-3">
                    Complaint Details
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">
                        Address
                      </p>
                      <p className="text-gray-800 text-base">
                        {complain.address}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">
                        Transport Mode
                      </p>
                      <p className="text-gray-800 text-base">
                        {complain.transportMode || "Not specified"}
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <p className="text-sm font-medium text-gray-500 mb-1">
                        Description
                      </p>
                      <p className="text-gray-800 text-base leading-relaxed">
                        {complain.description}
                      </p>
                    </div>

                    {complain.summary && (
                      <div className="md:col-span-2 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <p className="text-sm font-semibold text-yellow-800 mb-1">
                          Summary
                        </p>
                        <p className="text-gray-800 text-base">
                          {complain.summary}
                        </p>
                      </div>
                    )}
                  </div>

                  {(complain.images?.length > 0 ||
                    complain.videos?.length > 0) && (
                    <div className="mt-6 border-t pt-5">
                      <p className="text-md font-semibold text-gray-700 mb-3">
                        Media Attachments
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {complain.images?.map((img, i) => (
                          <div
                            key={i}
                            className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm flex-shrink-0"
                          >
                            <img
                              src={img}
                              alt={`Complaint Image ${i + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                        {complain.videos?.map((vid, i) => (
                          <div
                            key={i}
                            className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200 shadow-sm flex-shrink-0"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-8 w-8 text-gray-400"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.555 7.168a1 1 0 00-1.745-.632l-3.05 4.65V7a1 1 0 00-2 0v7a1 1 0 001.745.632l3.05-4.65V15a1 1 0 002 0V7.168z" />
                            </svg>
                            <span className="sr-only">
                              Video attachment {i + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Complains;
