import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const DiseaseIncidenceMortalityChart = ({ diseaseData }) => {
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (
      !diseaseData ||
      (!diseaseData.primary.length && !diseaseData.secondary.length)
    ) {
      setIsLoading(false);
      return;
    }

    // ✅ Extract Unique Years from both Incidence & Mortality Data
    const incidenceYears = new Set(
      diseaseData.primary.map((entry) => entry.year)
    );
    const mortalityYears = new Set(
      diseaseData.secondary.map((entry) => entry.year)
    );

    // ✅ Merge Unique Years & Sort Them
    const allYears = [
      ...new Set([...incidenceYears, ...mortalityYears]),
    ].sort();

    // ✅ Function to Get Rates, Handling Missing Years
    const getRate = (year, genderFilter, dataset) => {
      const entry = dataset.find(
        (d) => d.year === year && d.measure.includes(genderFilter)
      );
      return entry ? entry.rate : null; // Returns null if no data for that year
    };

    setChartData({
      labels: allYears,
      datasets: [
        {
          label: "Incidence Rate (Both Sexes)",
          data: allYears.map((year) =>
            getRate(
              year,
              "Age-standardized rate (both sexes)",
              diseaseData.primary
            )
          ),
          borderColor: "#2563EB",
          backgroundColor: "rgba(37, 99, 235, 0.2)",
          tension: 0.4,
          fill: true,
        },
        {
          label: "Incidence Rate (Males)",
          data: allYears.map((year) =>
            getRate(year, "Age-standardized rate (males)", diseaseData.primary)
          ),
          borderColor: "#059669",
          backgroundColor: "rgba(5, 150, 105, 0.2)",
          tension: 0.4,
          fill: true,
        },
        {
          label: "Incidence Rate (Females)",
          data: allYears.map((year) =>
            getRate(
              year,
              "Age-standardized rate (females)",
              diseaseData.primary
            )
          ),
          borderColor: "#D97706",
          backgroundColor: "rgba(217, 119, 6, 0.2)",
          tension: 0.4,
          fill: true,
        },
        {
          label: "Mortality Rate (Both Sexes)",
          data: allYears.map((year) =>
            getRate(
              year,
              "Age-standardized rate (both sexes)",
              diseaseData.secondary
            )
          ),
          borderColor: "#DC2626",
          backgroundColor: "rgba(220, 38, 38, 0.2)",
          tension: 0.4,
          fill: true,
        },
        {
          label: "Mortality Rate (Males)",
          data: allYears.map((year) =>
            getRate(
              year,
              "Age-standardized rate (males)",
              diseaseData.secondary
            )
          ),
          borderColor: "#7C3AED",
          backgroundColor: "rgba(124, 58, 237, 0.2)",
          tension: 0.4,
          fill: true,
        },
        {
          label: "Mortality Rate (Females)",
          data: allYears.map((year) =>
            getRate(
              year,
              "Age-standardized rate (females)",
              diseaseData.secondary
            )
          ),
          borderColor: "#F59E0B",
          backgroundColor: "rgba(245, 158, 11, 0.2)",
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
        Incidence & Mortality Rate Over Time (Distinguished by Gender)
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
