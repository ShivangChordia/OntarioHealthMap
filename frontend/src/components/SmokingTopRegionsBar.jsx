import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const SmokingTopRegionsBar = ({ smokingData }) => {
  if (!smokingData || smokingData.length === 0) return null;

  // Filter and sort top 10 regions for the most recent year
  const latestYear = Math.max(...smokingData.map((d) => d.year));
  const topData = smokingData
    .filter((d) => d.year === latestYear)
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 10);

  const data = {
    labels: topData.map((d) => d.geography), // still needed for tooltip
    datasets: [
      {
        label: "Daily Smoking Rate",
        data: topData.map((d) => d.rate),
        backgroundColor: "rgba(59, 130, 246, 0.6)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: (context) =>
            `${context.dataset.label}: ${context.raw} per 100,000`,
          title: (context) => topData[context[0].dataIndex].geography,
        },
      },
    },
    scales: {
      x: {
        display: false, // 🟦 Hides x-axis labels
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Rate per 100,000",
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-lg font-semibold text-center mb-2">
        Top 10 Regions by Daily Smoking Rate ({latestYear})
      </h2>
      <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 text-sm text-gray-700">
        <h3 className="font-semibold mb-1">🔍 Insight:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Highlights the top 10 regions in Ontario with the highest daily
            smoking rates for {latestYear}.
          </li>
          <li>
            Identifies regional disparities and hotspots needing stronger
            tobacco control efforts.
          </li>
          <li>
            Useful for targeted awareness campaigns and public health resource
            allocation.
          </li>
        </ul>
      </div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default SmokingTopRegionsBar;
