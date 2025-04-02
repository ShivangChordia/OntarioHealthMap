import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const StackedBarByRegion = ({ diseaseData }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (!diseaseData?.primary?.length) return;

    const grouped = {};
    diseaseData.primary.forEach((entry) => {
      const region = entry.geography;
      const disease = entry.type;
      if (!grouped[region]) grouped[region] = {};
      if (!grouped[region][disease]) grouped[region][disease] = 0;
      grouped[region][disease] += entry.rate;
    });

    const regions = Object.keys(grouped);
    const diseases = Array.from(
      new Set(diseaseData.primary.map((d) => d.type))
    );

    const datasets = diseases.map((disease) => ({
      label: disease,
      data: regions.map((region) => grouped[region][disease] || 0),
      backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
    }));

    setChartData({
      labels: regions,
      datasets,
    });
  }, [diseaseData]);

  return (
    <div className="bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-lg font-semibold text-center mb-4">
        Stacked Bar Chart of Disease Incidence by Region
      </h2>

      {/* 🔍 Insight Box */}
      <div className="bg-blue-50 border-l-4 border-blue-400 text-sm text-blue-800 p-3 mb-4 rounded-md">
        <p className="font-medium mb-1">Insight:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Compare how different diseases contribute to total incidence across
            regions.
          </li>
          <li>
            Helps spot regional dominance — e.g., regions with high rates of a
            specific disease.
          </li>
          <li>
            Useful for prioritizing disease-specific interventions geographically.
          </li>
        </ul>
      </div>

      {chartData ? (
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "top" },
              tooltip: {
                callbacks: {
                  label: (ctx) =>
                    `${ctx.dataset.label}: ${ctx.raw.toFixed(2)} per 100k`,
                },
              },
            },
            scales: {
              x: {
                stacked: true,
                ticks: { display: false }, // 🚫 Hide X-axis labels
              },
              y: {
                stacked: true,
                title: {
                  display: true,
                  text: "Rate per 100,000",
                },
              },
            },
          }}
        />
      ) : (
        <p className="text-center text-gray-500">No data available</p>
      )}
    </div>
  );
};

export default StackedBarByRegion;
