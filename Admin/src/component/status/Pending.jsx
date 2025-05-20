import React from "react";
import { useNavigate } from "react-router-dom";

const Pending = ({
  raidId = "RAID-001",
  culprit = "John Doe",
  address = "123 Main St",
  type = "Planned",
}) => {
  const navigate = useNavigate();

  const handlePendingReview = () => {
    navigate("/admin/pending-review");
  };

  return (
    <div className="grid grid-cols-6 gap-4 p-4 items-center hover:bg-gray-50 transition-colors">
      <div className="text-gray-800 font-medium">{raidId}</div>

      <div className="text-gray-700">{culprit}</div>

      <div className="text-gray-600 text-sm">{address}</div>

      <div>
        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
          {type}
        </span>
      </div>

      <div className="flex items-center">
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-orange-500 mr-2"></div>
          <span className="text-sm text-orange-500">Pending</span>
        </div>
      </div>

      <div>
        <button
          onClick={handlePendingReview}
          className="text-sm bg-white border border-[#213448] text-[#213448] px-3 py-1 rounded hover:bg-[#213448] hover:text-white transition-colors"
        >
          Review
        </button>
      </div>
    </div>
  );
};

export default Pending;
