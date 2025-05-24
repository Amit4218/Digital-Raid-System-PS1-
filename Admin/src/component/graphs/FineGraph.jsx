import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Select, MenuItem, FormControl, InputLabel, Box } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const FineGraph = () => {
  const [fineData, setFineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    const fetchFineData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin/fines-data`,
        );

        if (!response.data.success) {
          throw new Error(response.data.message || "Failed to fetch data");
        }

        const fines = response.data.data;
        const years = new Set();

        fines.forEach((fine) => {
          const year = new Date(fine.createdAt).getFullYear();
          years.add(year);
        });

        const sortedYears = Array.from(years).sort((a, b) => b - a);
        setAvailableYears(sortedYears);

        if (sortedYears.length > 0 && !sortedYears.includes(selectedYear)) {
          setSelectedYear(sortedYears[0]);
        }

        setFineData(fines);
      } catch (error) {
        console.error("Fetch error:", error.response?.data || error.message);
        toast.error(
          error.response?.data?.message || "Failed to fetch fine data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFineData();
  }, []);

  // Process data for the chart
  const getChartData = () => {
    if (loading || !fineData.length) return { labels: [], datasets: [] };

    // Filter fines by selected year
    const yearlyFines = fineData.filter((fine) => {
      return new Date(fine.createdAt).getFullYear() === selectedYear;
    });

    // Group by month
    const monthlyData = Array(12).fill(0);
    yearlyFines.forEach((fine) => {
      const month = new Date(fine.createdAt).getMonth();
      monthlyData[month] += fine.amount;
    });

    const labels = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return {
      labels,
      datasets: [
        {
          label: "Fine Revenue",
          data: monthlyData,
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.1,
          fill: true,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Fine Revenue for ${selectedYear}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Amount (₹)",
        },
      },
    },
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ maxWidth: 200, mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel>Year</InputLabel>
          <Select
            value={selectedYear}
            label="Year"
            onChange={(e) => setSelectedYear(e.target.value)}
            disabled={loading}
          >
            {availableYears.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "400px",
          }}
        >
          Loading chart data...
        </Box>
      ) : (
        <Box sx={{ height: "400px" }}>
          <Line options={chartOptions} data={getChartData()} />
        </Box>
      )}
    </Box>
  );
};

export default FineGraph;
