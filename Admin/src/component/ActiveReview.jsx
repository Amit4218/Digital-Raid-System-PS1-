import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { toast } from "react-toastify";

const ActiveReview = () => {
  const { raidId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [raidData, setRaidData] = useState(null);
  const dummyWarrantURL = "https://photricity.com/flw";

  useEffect(() => {
    const fetchRaids = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/user/get-all-raids`,
          {
            headers: {
              "x-access-key": import.meta.env.VITE_SECRET_ACCESS_KEY,
            },
          }
        );

        const allRaids = res.data.raids || [];
        const targetRaid = allRaids.find((r) => r._id === raidId);

        if (!targetRaid) {
          toast.error("Raid not found");
          navigate("/admin/raids");
        } else {
          setRaidData(targetRaid);
        }
      } catch (error) {
        console.error("Error fetching raids:", error);
        toast.error("Failed to fetch raids");
      } finally {
        setLoading(false);
      }
    };

    fetchRaids();
  }, [raidId, navigate]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = dummyWarrantURL;
    link.download = "warrant.png";
    link.click();
  };

  const handleClose = () => {
    navigate("/admin/raids");
  };

  if (loading || !raidData) return <div className="p-6">Loading...</div>;

  const {
    culprits,
    inCharge,
    address,
    status,
    scheduledDate,
    description,
    crimeDescription,
  } = {
    culprits: raidData.culprits || [],
    inCharge: raidData.inCharge || "",
    address: raidData.location?.address || "",
    status: raidData.status,
    scheduledDate: raidData.scheduledDate || "",
    description: raidData.description || "",
    crimeDescription: raidData.culprits[0].description || "",
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50 relative">
      <div className="flex justify-between items-center mt-20 mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold capitalize text-[#3B82F6]">
            {status}
          </span>
          <span className="w-3 h-3 rounded-full bg-[#3B82F6] border-2 border-[#3B82F6]"></span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-red-500 font-semibold">UNEDITABLE</div>
          <button
            onClick={handleClose}
            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
            aria-label="Close"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#213448] shadow-2xl rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-sm font-medium text-[#213448]">
              Culprit Name
            </label>
            <input
              type="text"
              className="mt-1 block w-full border border-[#213448] rounded-md shadow-sm p-3"
              defaultValue={culprits[0]?.name || ""}
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#213448]">
              Identification
            </label>
            <input
              type="text"
              className="mt-1 block w-full border border-[#213448] rounded-md shadow-sm p-3"
              defaultValue={culprits[0]?.identification || ""}
              readOnly
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#213448]">
              Crime Description
            </label>
            <textarea
              rows={2}
              className="mt-1 block w-full border border-[#213448] rounded-md shadow-sm p-3"
              defaultValue={crimeDescription}
              readOnly
            />
          </div>

          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#213448]">
                Raid Officer (In-Charge)
              </label>
              <input
                type="text"
                className="mt-1 block w-full border border-[#213448] rounded-md shadow-sm p-3"
                defaultValue={inCharge}
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#213448]">
                Raid Date
              </label>
              <input
                type="date"
                className="mt-1 block w-full border border-[#213448] rounded-md shadow-sm p-3"
                defaultValue={scheduledDate?.slice(0, 10)}
                readOnly
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#213448]">
              Address
            </label>
            <input
              type="text"
              className="mt-1 block w-full border border-[#213448] rounded-md shadow-sm p-3"
              defaultValue={address}
              readOnly
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#213448]">
              Raid Description
            </label>
            <textarea
              rows={3}
              className="mt-1 block w-full border border-[#213448] rounded-md shadow-sm p-3"
              defaultValue={description}
              readOnly
            />
            <p className="text-sm text-gray-500 mt-2 break-all">
              Warrant URL: {dummyWarrantURL}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-8 mt-8 md:flex-row">
          <div className="flex flex-col items-center w-full">
            <div className="flex flex-wrap justify-between w-full items-center">
              <div className="flex gap-4 flex-wrap">
                <button
                  onClick={handleDownload}
                  className="bg-[#213448] text-white font-bold px-4 py-2 rounded hover:bg-[#547792]"
                >
                  Download Warrant
                </button>
              </div>

              <div className="ml-auto">
                <button
                  onClick={handleClose}
                  className="bg-red-500 text-white font-bold px-4 py-2 rounded-4xl hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveReview;
