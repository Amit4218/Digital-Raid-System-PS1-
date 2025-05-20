import { useState } from "react";
import axios from "axios";

function SearchCriminal() {
  const [criminal, setCriminal] = useState(null);
  const [criminalId, setCriminalId] = useState("");
  const [LicenceId, setLicenceId] = useState("");
  const [LicenceDetails, setLicenceDetails] = useState(null);
  const [error, setError] = useState("");
  const [errlicence, seterrlicence] = useState("");
  const [loading, setLoading] = useState(false);

  const getCriminal = async (e) => {
    e.preventDefault();
    if (!criminalId.trim()) {
      setError("Please enter a criminal ID");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/user/search-criminal/${criminalId}`
      );
      setCriminal(res.data.criminal.criminal);
      localStorage.setItem("criminalId", res.data.criminal.criminal._id);
    } catch (error) {
      setCriminal(null);
      setError(error.response?.data?.message || "Criminal not found");
    } finally {
      setLoading(false);
    }
  };

  const getLicence = async (e) => {
    e.preventDefault();
    if (!LicenceId.trim()) {
      seterrlicence("Please enter a licence ID");
      return;
    }

    setLoading(true);
    seterrlicence("");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/user/licence/${LicenceId}`
      );
      setLicenceDetails(res.data.licence);
      localStorage.setItem("licenceId", res.data.licence._id);
    } catch (error) {
      setLicenceDetails(null);
      seterrlicence(error.response?.data?.message || "licence not found");
    } finally {
      setLoading(false);
    }
  };

  // Reset criminal search
  const resetCriminalSearch = () => {
    setCriminal(null);
    setCriminalId("");
    setError("");
  };

  // Reset license search
  const resetLicenceSearch = () => {
    setLicenceDetails(null);
    setLicenceId("");
    seterrlicence("");
  };

  return (
    <div className="bg-[#213448]  py-4">
      <div className="container mx-auto px-4">
        <div className="rounded-lg shadow-2xl p-6 md:p-8 lg:p-10">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-100">
            Search For Records
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Criminal Records Section */}
            <div className="border border-[#213448] shadow-2xl rounded-lg p-6">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-center mb-4 text-gray-200 tracking-tighter">
                  Criminal Identification
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-gray-300">
                      Identification ID
                    </label>
                    <input
                      className="w-full px-4 py-2 rounded-md border border-zinc-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
                      placeholder="Enter Identification ID"
                      type="text"
                      value={criminalId}
                      onChange={(e) => setCriminalId(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={getCriminal}
                      disabled={loading}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 transition-colors py-2 rounded-md font-medium text-gray-900"
                    >
                      {loading ? "Searching..." : "Search Criminal"}
                    </button>
                    {(criminal || criminalId) && (
                      <button
                        onClick={resetCriminalSearch}
                        className="bg-gray-600 hover:bg-gray-700 transition-colors py-2 px-4 rounded-md font-medium text-gray-100"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {criminal && (
                <div className="mt-6 bg-[#243c56] p-4 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2 text-gray-200">
                    {"Name: " + criminal.criminalName}
                  </h3>
                  <div className="mt-4 text-gray-300">
                    <h4 className="font-medium mb-2">Past Records:</h4>
                    {Array.isArray(criminal.pastRecords) &&
                    criminal.pastRecords.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-2">
                        {criminal.pastRecords.map((record, idx) => (
                          <li key={idx}>{record}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-zinc-400">No past records found</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* License Verification Section */}
            <div className="border border-[#213448] shadow-2xl rounded-lg p-6">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-center mb-4 text-gray-200">
                  License Verification
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-gray-300">
                      License Number
                    </label>
                    <input
                      className="w-full px-4 py-2 rounded-md border border-zinc-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
                      placeholder="Enter License Number"
                      type="text"
                      value={LicenceId}
                      onChange={(e) => setLicenceId(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={getLicence}
                      disabled={loading}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 transition-colors py-2 rounded-md font-medium text-gray-900"
                    >
                      {loading ? "Searching..." : "Search License"}
                    </button>
                    {(LicenceDetails || LicenceId) && (
                      <button
                        onClick={resetLicenceSearch}
                        className="bg-gray-600 hover:bg-gray-700 transition-colors py-2 px-4 rounded-md font-medium text-gray-100"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {LicenceDetails && (
                <div className="mt-6 bg-[#243c56] p-4 rounded-lg text-gray-300">
                  <h3 className="text-md tracking-tighter font-semibold mb-4 text-gray-200">
                    {"Holder Name: " + LicenceDetails.licenceHolder}
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">License ID:</span>{" "}
                      {LicenceDetails.licenceId}
                    </p>
                    <p>
                      <span className="font-medium">Renewal Date:</span>{" "}
                      {LicenceDetails.licenceRenewalDate}
                    </p>
                    <p>
                      <span className="font-medium">Publish Date:</span>{" "}
                      {LicenceDetails.licencePublishDate}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {errlicence && (
            <div className="mt-6 p-3 bg-red-500/20 border border-red-500 rounded-md text-red-500">
              {errlicence}
            </div>
          )}
          {error && (
            <div className="mt-6 p-3 bg-red-500/20 border border-red-500 rounded-md text-red-500">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchCriminal;
