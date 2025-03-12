import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Line, Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const AnalysisPage = () => {
  const location = useLocation();
  const { selectedRegion, selectedCancerType } = location.state || {};

  const [incidenceData, setIncidenceData] = useState([]);
  const [mortalityData, setMortalityData] = useState([]);
  const [incidenceChartData, setIncidenceChartData] = useState(null);
  const [mortalityChartData, setMortalityChartData] = useState(null);
  const [casesChartData, setCasesChartData] = useState(null);
  const [ciData, setCiData] = useState(null);

  useEffect(() => {
    if (!selectedRegion || !selectedCancerType) return;

    const fetchData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/disease-trends?region=${
            selectedRegion.name
          }&type=${selectedCancerType}`
        );
        const data = await response.json();
        console.log("📌 Fetched Disease Trend Data:", data);

        if (!data.incidence.length && !data.mortality.length) {
          console.warn("⚠ No Data Found for Analysis");
          return;
        }

        setIncidenceData(data.incidence);
        setMortalityData(data.mortality);

        // ✅ Incidence Rate Chart
        setIncidenceChartData({
          labels: data.incidence.map((entry) => entry.year),
          datasets: [
            {
              label: "Incidence Rate per 100,000",
              data: data.incidence.map((entry) => entry.rate),
              borderColor: "rgb(75, 192, 192)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              tension: 0.4,
            },
          ],
        });

        // ✅ Cases Chart
        setCasesChartData({
          labels: data.incidence.map((entry) => entry.year),
          datasets: [
            {
              label: "Total Cases",
              data: data.incidence.map((entry) => entry.cases),
              backgroundColor: "rgba(255, 99, 132, 0.6)",
              borderColor: "rgb(255, 99, 132)",
              borderWidth: 1,
            },
          ],
        });

        // ✅ Mortality Rate Chart
        setMortalityChartData({
          labels: data.mortality.map((entry) => entry.year),
          datasets: [
            {
              label: "Mortality Rate per 100,000",
              data: data.mortality.map((entry) => entry.rate),
              borderColor: "rgb(255, 159, 64)",
              backgroundColor: "rgba(255, 159, 64, 0.2)",
              tension: 0.4,
            },
          ],
        });

        // ✅ Confidence Interval Chart
        setCiData({
          labels: data.incidence.map((entry) => entry.year),
          datasets: [
            {
              label: "Lower Bound CI",
              data: data.incidence.map((entry) =>
                parseFloat(entry.ci.split("-")[0].split("(")[1])
              ),
              borderColor: "rgba(255, 206, 86, 1)",
              backgroundColor: "rgba(255, 206, 86, 0.2)",
              borderDash: [5, 5],
              tension: 0.4,
            },
            {
              label: "Upper Bound CI",
              data: data.incidence.map((entry) =>
                parseFloat(entry.ci.split("-")[1])
              ),
              borderColor: "rgba(54, 162, 235, 1)",
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderDash: [5, 5],
              tension: 0.4,
            },
          ],
        });
      } catch (error) {
        console.error("❌ Error Fetching Analysis Data:", error);
      }
    };

    fetchData();
  }, [selectedRegion, selectedCancerType]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* ✅ Title */}
      <h1 className="text-2xl font-bold text-center mb-4">
        {selectedRegion.name || "Unknown Region"} -{" "}
        {selectedCancerType
          ? selectedCancerType.toUpperCase()
          : "Unknown Disease"}{" "}
        Analysis
      </h1>

      {/* ✅ Grid Layout for Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* ✅ Incidence Rate */}
        {incidenceChartData && (
          <div className="bg-white p-4 shadow-lg rounded-lg">
            <h2 className="text-lg font-semibold mb-2">
              Incidence Rate Over Time
            </h2>
            <Line data={incidenceChartData} options={{ responsive: true }} />
          </div>
        )}

        {/* ✅ Mortality Rate */}
        {mortalityChartData && (
          <div className="bg-white p-4 shadow-lg rounded-lg">
            <h2 className="text-lg font-semibold mb-2">
              Mortality Rate Over Time
            </h2>
            <Line data={mortalityChartData} options={{ responsive: true }} />
          </div>
        )}

        {/* ✅ Cases Per Year */}
        {casesChartData && (
          <div className="bg-white p-4 shadow-lg rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Total Cases Per Year</h2>
            <Bar data={casesChartData} options={{ responsive: true }} />
          </div>
        )}

        {/* ✅ Confidence Interval */}
        {ciData && (
          <div className="col-span-2 bg-white p-4 shadow-lg rounded-lg">
            <h2 className="text-lg font-semibold mb-2">
              Confidence Interval Range
            </h2>
            <Line data={ciData} options={{ responsive: true }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisPage;
