import { useState } from "react";
import axios from "axios";

function SearchCriminal() {
  const [criminal, setCriminal] = useState(null);
  const [criminalId, setCriminalId] = useState("");
  const [error, setError] = useState("");
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
      console.log(res.data);
    } catch (error) {
      setCriminal(null);
      setError(error.response?.data?.message || "Criminal not found");
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setCriminal(null);
    setCriminalId("");
    setError("");
  };

  return (
    <div className="mt-10 max-w-md mx-auto">
      {criminal ? (
        <div className="bg-zinc-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">{criminal.criminalName}</h2>
          <h3 className="text-lg font-semibold mb-2">Past Records:</h3>
          {Array.isArray(criminal.pastRecords) &&
          criminal.pastRecords.length > 0 ? (
            <ul className="list-disc pl-5 mb-4">
              {criminal.pastRecords.map((record, idx) => (
                <li key={idx} className="mb-1">
                  {record}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-zinc-400">No past records found</p>
          )}
          <button
            onClick={resetSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Search Again
          </button>
        </div>
      ) : (
        <form
          onSubmit={getCriminal}
          className="bg-zinc-800 p-6 rounded-lg shadow-lg"
        >
          <div className="mb-4">
            <label htmlFor="criminalId" className="block mb-2 font-medium">
              Criminal ID
            </label>
            <input
              id="criminalId"
              type="text"
              value={criminalId}
              className="w-full outline-none text-white bg-zinc-700 px-4 py-3 rounded"
              placeholder="Enter the Criminal ID"
              onChange={(e) => setCriminalId(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 text-white font-bold rounded ${
              loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Searching..." : "Search Criminal"}
          </button>
        </form>
      )}
    </div>
  );
}

export default SearchCriminal;
