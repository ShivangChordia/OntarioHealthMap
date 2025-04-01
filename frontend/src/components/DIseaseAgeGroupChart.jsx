import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const DiseaseAgeGroupChart = ({ diseaseData }) => {
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

    // ✅ Define the Age Groups to Extract Data
    const ageGroups = [
      "Age-specific rate (0 to 14)",
      "Age-specific rate (15 to 29)",
      "Age-specific rate (30 to 49)",
      "Age-specific rate (50 to 64)",
      "Age-specific rate (65 to 79)",
      "Age-specific rate (80+)",
    ];

    // ✅ Extract Unique Years from the Dataset
    const years = [
      ...new Set(diseaseData.primary.map((entry) => entry.year)),
    ].sort();

    // ✅ Function to Get Rates by Age Group and Year
    const getRate = (ageGroup, year, dataset) => {
      const entry = dataset.find(
        (d) => d.year === year && d.measure.includes(ageGroup)
      );
      return entry ? entry.rate : null; // Returns null if no data for that age group
    };

    // ✅ Prepare Dataset for Incidence & Mortality Charts
    const datasetsIncidence = years.map((year, index) => ({
      label: `Incidence Rate - ${year}`,
      data: ageGroups.map((age) => getRate(age, year, diseaseData.primary)),
      backgroundColor: `rgba(75, 192, 192, ${0.2 + index * 0.1})`,
      borderColor: "rgb(75, 192, 192)",
      borderWidth: 1,
    }));

    const datasetsMortality = years.map((year, index) => ({
      label: `Mortality Rate - ${year}`,
      data: ageGroups.map((age) => getRate(age, year, diseaseData.secondary)),
      backgroundColor: `rgba(255, 99, 132, ${0.2 + index * 0.1})`,
      borderColor: "rgb(255, 99, 132)",
      borderWidth: 1,
    }));

    setChartData({
      labels: ageGroups.map((age) => age.replace("Age-specific rate ", "")), // Clean Labels
      datasets: [...datasetsIncidence, ...datasetsMortality],
    });

    setIsLoading(false);
  }, [diseaseData]);

  return (
    <div className="bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-lg font-semibold text-center mb-2 text-gray-700">
        Incidence & Mortality Rate by Age Group
      </h2>
      {isLoading ? (
        <p className="text-center text-gray-500">Loading data...</p>
      ) : chartData ? (
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: { legend: { position: "top" } },
          }}
        />
      ) : (
        <p className="text-center text-red-500">No data available</p>
      )}
    </div>
  );
};

export default DiseaseAgeGroupChart;
