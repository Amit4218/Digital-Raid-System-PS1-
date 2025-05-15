import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

function RaidPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [bluetoothPopupVisible, setBluetoothPopupVisible] = useState(false);
  const [raids, setRaids] = useState([]);
  const [selectedRaidId, setSelectedRaidId] = useState(null);

  const knownDeviceName = "Test_bluetooth";

  // Get user location on mount
  useEffect(() => {
    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
          },
          () => {
            toast.error("Please enable location to proceed");
          }
        );
      } else {
        toast.info("Geolocation is not supported by this browser");
      }
    }

    getLocation();
  }, []);

  // Fetch all raids
  useEffect(() => {
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
        setRaids(res.data.raids);
      } catch (error) {
        console.error("Error fetching raids:", error);
        toast.error("Failed to fetch raids");
      }
    };

    getRaids();
  }, []);

  // Show popup
  const notify = (raidId) => {
    setSelectedRaidId(raidId);
    setBluetoothPopupVisible(true);
  };

  // Cancel popup
  const cancel = () => {
    setBluetoothPopupVisible(false);
    setSelectedRaidId(null);
  };

  // Update coordinates API
  const updateCoordinates = async () => {
    const token = localStorage.getItem("token");
    const data = { token, latitude, longitude };

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/user/update-cordinates`,
        data
      );
      return res.status === 200;
    } catch (error) {
      console.error("Failed to update coordinates:", error);
      toast.error("Failed to update location");
      return false;
    }
  };

  // Bluetooth login & navigate
  const scan = async () => {
    if (!navigator.bluetooth) {
      toast.error("Web Bluetooth API not supported in this browser.");
      return;
    }

    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
      });

      console.log("Found device:", device.name);

      if (device.name === knownDeviceName) {
        toast.success(`Logged in as ${device.name}`);
        cancel();
        setLoading(true);

        const updated = await updateCoordinates();
        if (updated && selectedRaidId) {
          toast.success("Raid Started");
          navigate(`raid-start-form/${selectedRaidId}`);
        }

        setLoading(false);
      } else {
        toast.error("Unknown device. Access denied.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Bluetooth Error:", error);
      toast.error("Bluetooth scan failed or was cancelled");
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="bg-zinc-800 min-h-screen text-white">
          {latitude && longitude ? (
            <>
              <div className="flex justify-center items-center pt-20">
                <div className="w-[90%] min-h-40 p-5 border border-amber-300">
                  <div className="space-y-5">
                    {raids.map((raid) => (
                      <div
                        key={raid._id}
                        className="border p-4 rounded-md shadow-sm"
                      >
                        <p>
                          <strong>ID:</strong> {raid._id}
                        </p>
                        <p>
                          <strong>Officer:</strong> {raid.raidOfficer}
                        </p>
                        <p>
                          <strong>Culprit Name:</strong>{" "}
                          {raid.culprits.name}
                        </p>
                        <p>
                          <strong>Address:</strong> {raid.location.address}
                        </p>
                        <p>
                          <strong>Raid Type:</strong> {raid.raidType}
                        </p>
                        <p>
                          <strong>Raid Date:</strong>{" "}
                          {new Date(raid.raidDate).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>Status:</strong> {raid.status}
                        </p>
                        <p>
                          <strong>Description:</strong>{" "}
                          {raid.description || "N/A"}
                        </p>
                        <p>
                          <strong>Approval:</strong>{" "}
                          {raid.approvel ? "Approved" : "Not Approved"}
                        </p>
                        {raid.approvel ? (
                          <button
                            onClick={() => notify(raid._id)}
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                          >
                            Start
                          </button>
                        ) : (
                          <button
                            onClick={() => notify(raid._id)}
                            className="mt-2 px-4 py-2 bg-gray-400 text-white rounded"
                            disabled
                          >
                            {raid.status === "pending"
                              ? "Pending"
                              : raid.status === "active"
                              ? "Active"
                              : "Complete"}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bluetooth Popup */}
              {bluetoothPopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
                  <div className="w-72 border border-white rounded bg-purple-300 p-4 text-md text-black">
                    <h3 className="mb-2 font-semibold">
                      Login with RFID to continue!
                    </h3>
                    <div className="flex justify-between gap-4">
                      <button
                        onClick={scan}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                      >
                        Okay
                      </button>
                      <button
                        onClick={cancel}
                        className="px-4 py-2 bg-red-500 text-white rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Create Unplanned Raid Button */}
              <div className="flex justify-center items-center mt-5">
                <div className="w-40 px-4 py-3 rounded bg-yellow-500 text-center cursor-pointer">
                  <button onClick={() => navigate("/unplanned-raid")}>
                    Create Unplanned
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center pt-40">
              <p>Waiting for location access...</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default RaidPage;
