import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function RaidPage() {
  const navigate = useNavigate();
  const knownDeviceName = "Test_bluetooth"; // bluetooth device name

  const notify = () => {
    const popUp = document.getElementById("bluetooth");
    popUp.classList.remove("hidden");
  };
  const cancel = () => {
    const popUp = document.getElementById("bluetooth");
    popUp.classList.add("hidden");
  };

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
        navigate("/form")
      } else {
        toast.error("Unknown device. Access denied.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Bluetooth scan failed or was cancelled");
    }
  };

  return (
    <>
      <div className="h-screen bg-zinc-800">
        <div className="flex items-center justify-center z-2">
          <button onClick={notify} className="bg-blue-600 px-4 py-3 mt-60">
            start
          </button>
        </div>

        <div id="bluetooth" className="-mt-60 z-10 hidden">
          <div className="flex justify-center items-center  ">
            <section className="h-35 w-60 border border-white rounded bg-purple-300 p-4 text-md">
              <h3>Login with Bluetooth to continue !</h3>
              <div className="row row-2 flex gap-5">
                <button
                  onClick={scan}
                  className="mt-3 px-4 py-2 bg-blue-400 rounded "
                >
                  Okay
                </button>
                <button
                  onClick={cancel}
                  className="mt-3 px-4 py-2 bg-red-400 rounded"
                >
                  cancel
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

export default RaidPage;
