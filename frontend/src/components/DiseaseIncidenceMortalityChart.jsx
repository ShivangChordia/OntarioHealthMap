import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const DiseaseIncidenceMortalityChart = ({ diseaseData }) => {
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!diseaseData || !diseaseData.primary.length) {
      setIsLoading(false);
      return;
    }

    // ✅ Extract Years & Data
    const years = [
      ...new Set(diseaseData.primary.map((entry) => entry.year)),
    ].sort();
    const incidenceRates = years.map((year) => {
      const entry = diseaseData.primary.find((d) => d.year === year);
      return entry ? entry.rate : null;
    });

    const mortalityRates = years.map((year) => {
      const entry = diseaseData.secondary.find((d) => d.year === year);
      return entry ? entry.rate : null;
    });

    // ✅ Set Chart Data
    setChartData({
      labels: years,
      datasets: [
        {
          label: "Incidence Rate (per 100,000)",
          data: incidenceRates,
          borderColor: "#1E40AF",
          backgroundColor: "rgba(30, 64, 175, 0.3)",
          tension: 0.4,
          fill: true,
        },
        {
          label: "Mortality Rate (per 100,000)",
          data: mortalityRates,
          borderColor: "#DC2626",
          backgroundColor: "rgba(220, 38, 38, 0.3)",
          tension: 0.4,
          fill: true,
        },
      ],
    });

    setIsLoading(false);
  }, [diseaseData]);

  return (
    <div className="bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-lg font-semibold text-center mb-2 text-gray-700">
        Incidence & Mortality Rate Over Time
      </h2>
      {isLoading ? (
        <p className="text-center text-gray-500">Loading data...</p>
      ) : chartData ? (
        <Line data={chartData} options={{ responsive: true }} />
      ) : (
        <p className="text-center text-red-500">No data available</p>
      )}
    </div>
  );
};

export default DiseaseIncidenceMortalityChart;
