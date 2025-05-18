import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import UploadImage from "../components/UploadImage";
import axios from "axios";
import UploadVideo from "../components/UploadVideo";
import SearchCriminal from "../components/SearchCriminal";
import { toast } from "react-toastify";

function Planned() {
  const { id, userId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  // gets all the info about the raid

  useEffect(() => {
    const getRaidInfo = async () => {
      try {
        setLoading(true);
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/user/raid/${id}`
        );
        setInfo(res.data.info);
      } catch (err) {
        setError(err.message || "Failed to fetch raid info");
      } finally {
        setLoading(false);
      }
    };
    getRaidInfo();
  }, [id]);

  const notify = (e) => {
    e.preventDefault();
    const approved = prompt(
      "Approve Raid ? No changes can be made afterwords ! Please Type Confirm "
    );
    if (approved === "Confirm") {
      toast.success("Raid Submitted");
    } else {
      toast.info("Not Approved");
    }
  };

  if (loading) return <div>Loading raid information...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!info) return <div>No raid information found</div>;

  return (
    <div className="min-h-screen bg-zinc-800 text-white p-5">
      <div className="raid-info-container max-w-4xl mx-auto">
        <h2 className="mb-6 text-3xl font-bold text-white">Raid Details</h2>

        <div className="grid gap-4 mb-8">{/* Raid details rendering... */}</div>

        <div className="flex gap-4 mb-8">
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition">
            Download Warrant
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition">
            Preview Warrant
          </button>
        </div>
        {/* Image uploader */}
        <div className="">
          <UploadImage />
        </div>
        <div className="">
          <UploadVideo />
        </div>
        <div className="">
          <SearchCriminal />
        </div>
        <div className="flex justify-center items-center">
          <form>
            <button
              className="bg-blue-500 mt-5 px-3 py-3 rounded"
              onClick={notify}
            >
              Approve
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Planned;
