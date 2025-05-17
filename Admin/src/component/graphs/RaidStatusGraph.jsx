import React, { useState, useEffect } from "react";
import { PolarArea } from "react-chartjs-2";
import { Chart as ChartJs } from "chart.js/auto";
import axios from "axios";
import {
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJs.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const RaidStatusGraph = () => {
  const [statusData, setStatusData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStatusData = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin/statusData`
        );
        console.log("API response data:", response.data);

        if (
          !response.data?.statusData ||
          !Array.isArray(response.data.statusData)
        ) {
          setError("No status data found in API response");
          setStatusData([]);
        } else {
          setStatusData(response.data.statusData);
        }
      } catch (error) {
        console.error("Error fetching status data:", error);
        setError("Failed to load status data");
        setStatusData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatusData();
  }, []);

  // Status labels and keys - adapt if your statuses change
  const statusLabels = {
    pending: "Pending",
    active: "Active",
    completed: "Completed",
    completed_approved: "Completed (Approved)",
  };

  const defaultStatusKeys = Object.keys(statusLabels);

  // Count statuses
  const statusCount = statusData.reduce((acc, item) => {
    const status = item.status;
    if (statusLabels[status]) {
      acc[status] = (acc[status] || 0) + 1;
    } else {
      acc["unknown"] = (acc["unknown"] || 0) + 1;
    }
    return acc;
  }, {});

  // Ensure all keys present
  defaultStatusKeys.forEach((key) => {
    if (!statusCount[key]) statusCount[key] = 0;
  });

  const totalCount = statusData.length;

  const chartData = {
    labels: defaultStatusKeys.map((key) => statusLabels[key]),
    datasets: [
      {
        label: "Raid Status Count",
        data: defaultStatusKeys.map((key) => statusCount[key]),
        backgroundColor: ["#FF6384", "#36A2EB", "#4BC0C0", "#9ACD32"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "right" },
      title: {
        display: true,
        text: `Overall combined Raids (${totalCount})`,
        font: { size: 16 },
      },
    },
  };

  return (
    <div className="w-full max-w-4xl h-[40vh] bg-white rounded-xl shadow-lg p-6 flex flex-col mb-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Raid Status Overview
      </h2>
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center text-red-500">
          {error}
        </div>
      ) : statusData.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          No status data available
        </div>
      ) : (
        <div className="flex-1">
          <PolarArea data={chartData} options={options} />
        </div>
      )}
    </div>
  );
};

export default RaidStatusGraph;
