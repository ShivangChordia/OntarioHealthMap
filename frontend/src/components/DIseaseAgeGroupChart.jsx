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

    const rawAgeGroups = [
      "Age-specific rate (0 to 14)",
      "Age-specific rate (15 to 29)",
      "Age-specific rate (30 to 49)",
      "Age-specific rate (50 to 64)",
      "Age-specific rate (65 to 79)",
      "Age-specific rate (80+)",
      "Age-specific rate (20 to 44)",
      "Age-specific rate (45 to 64)",
      "Age-specific rate (65 to 74)",
      "Age-specific rate (75+)",
    ];

    const years = [
      ...new Set(diseaseData.primary.map((entry) => entry.year)),
    ].sort();

    // ✅ Function to check if any entry exists for a group
    const hasData = (ageGroup) => {
      const inPrimary = diseaseData.primary.some((d) =>
        d.measure.includes(ageGroup)
      );
      const inSecondary = diseaseData.secondary.some((d) =>
        d.measure.includes(ageGroup)
      );
      return inPrimary || inSecondary;
    };

    // ✅ Filter age groups to only those that have data
    const validAgeGroups = rawAgeGroups.filter(hasData);

    const getRate = (ageGroup, year, dataset) => {
      const entry = dataset.find(
        (d) => d.year === year && d.measure.includes(ageGroup)
      );
      return entry ? entry.rate : null;
    };

    const datasetsIncidence = years.map((year, index) => ({
      label: `Incidence Rate - ${year}`,
      data: validAgeGroups.map((age) =>
        getRate(age, year, diseaseData.primary)
      ),
      backgroundColor: `rgba(75, 192, 192, ${0.2 + index * 0.1})`,
      borderColor: "rgb(75, 192, 192)",
      borderWidth: 1,
    }));

    const datasetsMortality = years.map((year, index) => ({
      label: `Mortality Rate - ${year}`,
      data: validAgeGroups.map((age) =>
        getRate(age, year, diseaseData.secondary)
      ),
      backgroundColor: `rgba(255, 99, 132, ${0.2 + index * 0.1})`,
      borderColor: "rgb(255, 99, 132)",
      borderWidth: 1,
    }));

    setChartData({
      labels: validAgeGroups.map((age) =>
        age.replace("Age-specific rate ", "")
      ),
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
      ) : chartData && chartData.labels.length > 0 ? (
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: { legend: { position: "top" } },
            scales: {
              x: { stacked: false },
              y: { beginAtZero: true },
            },
          }}
        />
      ) : (
        <p className="text-center text-red-500">No age group data available</p>
      )}
    </div>
  );
};

export default DiseaseAgeGroupChart;
