import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { fetchDiseaseTrends } from "../utils/api";

Chart.register(...registerables);

const DiseaseAnalysis = () => {
  const location = useLocation();
  const { diseaseType, specificType } = location.state || {};

  const [trendData, setTrendData] = useState({ primary: [], secondary: [] });
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!diseaseType || !specificType) return;

    const loadTrendData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch disease trends from API
        const data = await fetchDiseaseTrends(diseaseType, specificType);

        if (!data.primary.length && !data.secondary.length) {
          setError(`No ${diseaseType} data found for ${specificType}`);
          setIsLoading(false);
          return;
        }

        setTrendData(data);

        // Extract years and rates for line chart
        const years = [
          ...new Set(data.primary.map((entry) => entry.year)),
        ].sort();
        const incidenceRates = years.map(
          (year) => data.primary.find((d) => d.year === year)?.rate || null
        );
        const mortalityRates = years.map(
          (year) => data.secondary.find((d) => d.year === year)?.rate || null
        );

        setChartData({
          labels: years,
          datasets: [
            {
              label: "Incidence Rate (per 100,000)",
              data: incidenceRates,
              borderColor: "#2563EB",
              backgroundColor: "rgba(37, 99, 235, 0.2)",
              tension: 0.4,
              fill: true,
            },
            {
              label: "Mortality Rate (per 100,000)",
              data: mortalityRates,
              borderColor: "#DC2626",
              backgroundColor: "rgba(220, 38, 38, 0.2)",
              tension: 0.4,
              fill: true,
            },
          ],
        });

        setIsLoading(false);
      } catch (err) {
        setError(`Failed to load ${diseaseType} data.`);
        console.error(err);
      }
    };

    loadTrendData();
  }, [diseaseType, specificType]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-6 py-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          {diseaseType} - {specificType} Analysis
        </h1>

        {/* Data Overview Section */}
        <div className="mt-6 bg-white shadow-md p-6 rounded-lg">
          <p className="text-gray-700 text-lg">
            Analyzing historical data for <b>{specificType}</b> under{" "}
            <b>{diseaseType}</b>. The chart below shows trends over the years
            for incidence and mortality rates.
          </p>
        </div>

        {/* Loading & Error Messages */}
        {isLoading && (
          <p className="text-center text-gray-500 mt-6">Loading data...</p>
        )}
        {error && <p className="text-center text-red-500 mt-6">{error}</p>}

        {/* Incidence & Mortality Over Time Chart */}
        {!isLoading && !error && chartData && (
          <div className="mt-6 bg-white shadow-md p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Incidence & Mortality Rate Over Time
            </h2>
            <Line data={chartData} options={{ responsive: true }} />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default DiseaseAnalysis;
