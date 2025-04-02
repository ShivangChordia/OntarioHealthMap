import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const DiseaseIncidenceMortalityChart = ({ diseaseData, type }) => {
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (
      !diseaseData ||
      (!diseaseData.primary.length &&
        !diseaseData.secondary.length &&
        !diseaseData.tertiary?.length)
    ) {
      setIsLoading(false);
      return;
    }
  
    const years = [
      ...new Set([
        ...diseaseData.primary.map((d) => d.year),
        ...diseaseData.secondary.map((d) => d.year),
        ...(diseaseData.tertiary || []).map((d) => d.year),
      ]),
    ].sort();
  
    const getRate = (year, measureFilter, dataset) => {
      const entry = dataset.find(
        (d) => d.year === year && d.measure.trim() === measureFilter
      );
      return entry ? entry.rate : null;
    };
  
    const lowerType = type?.toLowerCase() || "";
    const isFemaleCancer = ["breast", "cervical"].includes(lowerType);
    const isMaleCancer = ["prostate"].includes(lowerType);
    const isSingleIncidenceMeasure = isFemaleCancer || isMaleCancer;
  
    const datasets = [];
  
    // Incidence (special case)
    if (isSingleIncidenceMeasure) {
      datasets.push({
        label: "Incidence Rate",
        data: years.map((year) =>
          getRate(year, "Age-standardized rate", diseaseData.primary)
        ),
        borderColor: "#2563EB",
        backgroundColor: "rgba(37, 99, 235, 0.2)",
        tension: 0.4,
        fill: true,
      });
    } else {
      datasets.push(
        {
          label: "Incidence Rate (Females)",
          data: years.map((year) =>
            getRate(year, "Age-standardized rate (females)", diseaseData.primary)
          ),
          borderColor: "#D97706",
          backgroundColor: "rgba(217, 119, 6, 0.2)",
          tension: 0.4,
          fill: true,
        },
        {
          label: "Incidence Rate (Males)",
          data: years.map((year) =>
            getRate(year, "Age-standardized rate (males)", diseaseData.primary)
          ),
          borderColor: "#059669",
          backgroundColor: "rgba(5, 150, 105, 0.2)",
          tension: 0.4,
          fill: true,
        },
        {
          label: "Incidence Rate (Both Sexes)",
          data: years.map((year) =>
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
        }
      );
    }
  
    // Mortality (gendered for all)
    if (diseaseData.secondary?.length) {
      if (!isMaleCancer) {
        datasets.push({
          label: "Mortality Rate (Females)",
          data: years.map((year) =>
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
        });
      }
  
      if (!isFemaleCancer) {
        datasets.push({
          label: "Mortality Rate (Males)",
          data: years.map((year) =>
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
        });
      }
  
      if (!isMaleCancer && !isFemaleCancer) {
        datasets.push({
          label: "Mortality Rate (Both Sexes)",
          data: years.map((year) =>
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
        });
      }
    }
  
    // Prevalence
    if (diseaseData.tertiary?.length) {
      datasets.push({
        label: "Prevalence Rate (Both Sexes)",
        data: years.map((year) =>
          getRate(
            year,
            "Age-standardized rate (both sexes)",
            diseaseData.tertiary
          )
        ),
        borderColor: "#9333EA",
        backgroundColor: "rgba(147, 51, 234, 0.2)",
        tension: 0.4,
        fill: true,
      });
    }
  
    setChartData({
      labels: years,
      datasets,
    });
  
    setIsLoading(false);
  }, [diseaseData, type]);
  

  return (
    <div className="bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-lg font-semibold text-center mb-2 text-gray-700">
        Incidence, Mortality & Prevalence Rate Over Time (Distinguished by
        Gender)
      </h2>

      {/* 🔍 Insight Box */}
      <div className="bg-blue-50 border-l-4 border-blue-400 text-sm text-blue-800 p-3 mb-4 rounded-md">
        <p className="font-medium mb-1">Insight:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Track how incidence, mortality, and prevalence rates have changed
            over time.
          </li>
          <li>
            Identify gender-specific trends — for example, higher rates in males
            or females.
          </li>
          <li>
            See if public health interventions are reducing mortality despite
            rising incidence.
          </li>
        </ul>
      </div>

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
