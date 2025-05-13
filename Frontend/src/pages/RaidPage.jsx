import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

function RaidPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [bluetoothPopupVisible, setBluetoothPopupVisible] = useState(false);

  const knownDeviceName = "Test_bluetooth";
  const token = localStorage.getItem("token");

  const data = { token, latitude, longitude };

  // Get user location on mount
  useEffect(() => {
    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
            setFormVisible(true);
          },
          (error) => {
            toast.error("Please enable location to proceed");
            setFormVisible(false);
          }
        );
      } else {
        toast.info("Geolocation is not supported by this browser");
      }
    }

    getLocation();
  }, []);

  // Toggle bluetooth popup
  const notify = () => setBluetoothPopupVisible(true);
  const cancel = () => setBluetoothPopupVisible(false);

  // Update coordinates API call
  const updateCoordinates = async () => {
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

  // Bluetooth scanning and navigation logic
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

        const update = await updateCoordinates();
        if (update) {
          toast.success("Raid Started");
          navigate("/raid-start-form");
        }

        setLoading(false);
      } else {
        toast.error("Unknown device. Access denied.");
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
        <div className="h-screen bg-zinc-800">
          {formVisible && (
            <>
              <div className="flex items-center justify-center z-2">
                <button
                  onClick={notify}
                  className="bg-blue-600 px-4 py-3 mt-60"
                >
                  Start
                </button>
              </div>

              {bluetoothPopupVisible && (
                <div className="-mt-60 z-10">
                  <div className="flex justify-center items-center">
                    <section className="h-35 w-60 border border-white rounded bg-purple-300 p-4 text-md">
                      <h3>Login with RFID to continue!</h3>
                      <div className="row row-2 flex gap-5">
                        <button
                          onClick={scan}
                          className="mt-3 px-4 py-2 bg-blue-400 rounded"
                        >
                          Okay
                        </button>
                        <button
                          onClick={cancel}
                          className="mt-3 px-4 py-2 bg-red-400 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </section>
                  </div>
                </div>
              )}

              <div className="flex justify-center items-center">
                <div className="w-30 mt-5 px-4 py-3 rounded bg-yellow-500">
                  <button onClick={() => navigate("/unplanned-raid")}>
                    Create Unplanned
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default RaidPage;
