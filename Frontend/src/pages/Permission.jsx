import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Permission() {
  const location = useLocation();
  const navigate = useNavigate();
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const { raidId } = location.state || {};

  // Get user location on mount
  useEffect(() => {
    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
            updateCoordinates();
          },
          () => {
            toast.error("Please enable location to proceed & Refresh the page");
          }
        );
      } else {
        toast.info("Geolocation is not supported by this browser");
      }
    }

    getLocation();
  }, []);

  // Update coordinates API
  const updateCoordinates = async () => {
    const token = localStorage.getItem("token");
    const data = { token, latitude, longitude };

    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/user/update-cordinates`,
        data
      );
    } catch (error) {
      console.error("Failed to update coordinates:", error);
      toast.error("Failed to update location");
    }
  };

  if (!raidId) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl text-red-500">Error: No raid ID provided</h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="p-4 mx-auto max-w-4xl">
        <div className="bg-zinc-800 border border-amber-300 rounded-xl mt-10 p-6 text-white shadow-lg">
          <h1 className="text-2xl font-bold text-amber-400 mb-6">
            Raid Permission
          </h1>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-amber-200">
                Raid Details
              </h3>
              <p className="mt-2">
                Raid ID:{" "}
                <span className="font-mono text-amber-100">{raidId}</span>
              </p>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-amber-200">
                Permissions Required
              </h3>
              <ul className="mt-2 space-y-2 pl-5 list-disc">
                <li>Location Access</li>
                <li>Bluetooth Access</li>
              </ul>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-zinc-700 text-white rounded-md hover:bg-zinc-600"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle permission confirmation
                  alert(`Starting raid with ID: ${raidId}`);
                }}
                className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
              >
                Confirm & Start Raid
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Permission;
