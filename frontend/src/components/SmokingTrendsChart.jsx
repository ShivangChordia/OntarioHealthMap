import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const SmokingTrendsChart = ({ smokingData }) => {
  const [chartData, setChartData] = useState(null);
  console.log(smokingData);

  useEffect(() => {
    if (!smokingData || smokingData.length === 0) return;

    const years = [...new Set(smokingData.map((d) => d.year))].sort();

    const dailyRates = years.map(
      (y) =>
        smokingData.find(
          (d) =>
            d.year === y && d.type === "Self-reported adult daily smoking rate"
        )?.rate || null
    );

    const formerRates = years.map(
      (y) =>
        smokingData.find(
          (d) =>
            d.year === y && d.type === "Self-reported adult former smoking rate"
        )?.rate || null
    );

    setChartData({
      labels: years,
      datasets: [
        {
          label: "Daily Smoking Rate",
          data: dailyRates,
          borderColor: "#DC2626",
          backgroundColor: "rgba(220, 38, 38, 0.2)",
          tension: 0.4,
        },
        {
          label: "Former Smoking Rate",
          data: formerRates,
          borderColor: "#3B82F6",
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          tension: 0.4,
        },
      ],
    });
  }, [smokingData]);

  return (
    <div className="bg-white p-6 shadow rounded-lg">
      <h2 className="text-lg font-semibold text-center mb-3">
        Smoking Trends Over Time
      </h2>

      {/* 🔍 Insight */}
      <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 text-sm text-gray-700">
        <h3 className="font-semibold mb-1">Insight:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Visualize how smoking habits (daily vs. former smokers) have changed
            over time.
          </li>
          <li>
            A decreasing trend in daily smoking may reflect successful
            anti-smoking policies or campaigns.
          </li>
          <li>
            An increasing trend in former smoking indicates growing awareness
            and cessation efforts.
          </li>
        </ul>
      </div>

      {chartData ? (
        <Line data={chartData} />
      ) : (
        <p className="text-center text-gray-500">No data available</p>
      )}
    </div>
  );
};

export default SmokingTrendsChart;
