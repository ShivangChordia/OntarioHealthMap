import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Legend,
  Tooltip,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { fetchSmokingData } from "../utils/api"; // 🔁 You need to implement this API helper

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Legend,
  Tooltip
);

const SmokingDiseaseComparisonChart = ({
  diseaseData,
  diseaseType,
  specificType,
}) => {
  const [smokingData, setSmokingData] = useState([]);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const loadSmokingData = async () => {
      try {
        const data = await fetchSmokingData(); // ✅ fetch all years, Ontario-level by default
        setSmokingData(data);
      } catch (error) {
        console.error("❌ Error loading smoking data:", error);
      }
    };

    loadSmokingData();
  }, []);

  useEffect(() => {
    if (!diseaseData.primary.length || !smokingData.length) return;

    const diseaseByYear = Object.fromEntries(
      diseaseData.primary.map((item) => [item.year, item.rate])
    );

    const smokingByYear = Object.fromEntries(
      smokingData.map((item) => [item.year, item.rate])
    );

    const years = [
      ...new Set([
        ...Object.keys(diseaseByYear),
        ...Object.keys(smokingByYear),
      ]),
    ]
      .map((y) => parseInt(y))
      .sort();

    const incidenceRates = years.map((year) => diseaseByYear[year] || null);
    const smokingRates = years.map((year) => smokingByYear[year] || null);

    setChartData({
      labels: years,
      datasets: [
        {
          type: "bar",
          label: "Smoking Rate (%)",
          data: smokingRates,
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          yAxisID: "ySmoking",
        },
        {
          type: "line",
          label: `${specificType} Incidence Rate (/100,000)`,
          data: incidenceRates,
          borderColor: "rgba(54, 162, 235, 1)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          yAxisID: "yDisease",
          tension: 0.3,
        },
      ],
    });
  }, [diseaseData, smokingData, specificType]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg col-span-2">
      <h2 className="text-lg font-semibold text-center mb-4">
        Smoking Rate vs {specificType} {diseaseType} Incidence Over Time
      </h2>

      {chartData ? (
        <Chart
          type="bar"
          data={chartData}
          options={{
            responsive: true,
            interaction: {
              mode: "index",
              intersect: false,
            },
            scales: {
              ySmoking: {
                type: "linear",
                position: "left",
                title: { display: true, text: "Smoking Rate (%)" },
                ticks: { beginAtZero: true },
              },
              yDisease: {
                type: "linear",
                position: "right",
                title: {
                  display: true,
                  text: "Disease Incidence Rate (/100,000)",
                },
                grid: { drawOnChartArea: false },
                ticks: { beginAtZero: true },
              },
            },
          }}
        />
      ) : (
        <p className="text-center text-gray-500">Loading chart...</p>
      )}
    </div>
  );
};

export default SmokingDiseaseComparisonChart;
