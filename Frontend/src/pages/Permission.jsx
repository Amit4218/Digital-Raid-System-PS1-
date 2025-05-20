import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import axios from "axios";
import UploadImage from "../components/UploadImage";

function Permission() {
  const location = useLocation();
  const navigate = useNavigate();
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false);
  const knownDeviceName = "Test_bluetooth";

  const { raidId } = location.state || {};

  localStorage.setItem("raidId", raidId);

  // Get user location on mount
  useEffect(() => {
    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
            setLocationEnabled(true);
          },
          () => {
            toast.error("Please enable location to proceed & Refresh the page");
            setLocationEnabled(false);
          }
        );
      } else {
        toast.info("Geolocation is not supported by this browser");
        setLocationEnabled(false);
      }
    }

    getLocation();
  }, []);

  // Update coordinates API
  const updateCoordinates = async () => {
    const token = localStorage.getItem("token");
    const data = { token, latitude, longitude, raidId };
    console.log(data);

    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/user/update-cordinates`,
        data
      );
      return true;
    } catch (error) {
      console.error("Failed to update coordinates:", error);
      toast.error("Failed to update location");
      return false;
    }
  };

  const scanBluetooth = async () => {
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
        toast.success(`Connected to ${device.name}`);
        setBluetoothEnabled(true);

        const updated = await updateCoordinates();
        if (updated) {
          toast.success("Location updated successfully");
          // Don't navigate here, let the confirm button handle it
        }
      } else {
        toast.error("Unknown device. Access denied.");
        setBluetoothEnabled(false);
      }
    } catch (error) {
      console.error("Bluetooth Error:", error);
      toast.error("Bluetooth scan failed or was cancelled");
      setBluetoothEnabled(false);
    }
  };
  const handleConfirm = async () => {
    if (locationEnabled && bluetoothEnabled) {
      toast.success("Raid Started");
      navigate(`/raid-start-form/${raidId}`);
    } else {
      toast.error("Please enable both location and Bluetooth to proceed");
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
                <li>
                  Location Access:{" "}
                  {locationEnabled ? (
                    <span className="bg-green-600 ml-5 px-3 py-1 rounded">
                      Location acquired successfully
                    </span>
                  ) : (
                    <span className="bg-red-600 ml-5 px-3 py-1 rounded">
                      Location access required
                    </span>
                  )}
                </li>
                <li>
                  RFID Connection:
                  {bluetoothEnabled ? (
                    <div>
                      <span className="bg-green-600 ml-5 px-3 py-1 rounded">
                        RFID connected successfully
                      </span>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <span className="bg-red-600 mr-3 px-3 py-1 rounded">
                        Connect to RFID
                      </span>
                      <button
                        onClick={scanBluetooth}
                        className="bg-yellow-500 py-1 px-3 rounded hover:bg-yellow-600"
                      >
                        Connect Device
                      </button>
                    </div>
                  )}
                </li>
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
                onClick={handleConfirm}
                disabled={!locationEnabled || !bluetoothEnabled}
                className={`px-4 py-2 text-white rounded-md ${
                  !locationEnabled || !bluetoothEnabled
                    ? "bg-zinc-600 hover:bg-zinc-700 cursor-not-allowed"
                    : "bg-amber-600 hover:bg-amber-700 cursor-pointer"
                }`}
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
