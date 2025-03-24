"use client";

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Line, Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { fetchDiseaseTrends } from "../services/api-service";

Chart.register(...registerables);

const AnalysisPage = () => {
  const location = useLocation();
  const {
    selectedRegion,
    selectedDisease,
    selectedCancerType,
    selectedChronicType,
  } = location.state || {};

  const [trendData, setTrendData] = useState({
    primary: [], // Incidence for cancer, prevalence for chronic, etc.
    secondary: [], // Mortality for cancer, complication rate for chronic, etc.
  });
  const [primaryChartData, setPrimaryChartData] = useState(null);
  const [secondaryChartData, setSecondaryChartData] = useState(null);
  const [casesChartData, setCasesChartData] = useState(null);
  const [confidenceData, setConfidenceData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get the specific disease subtype based on the main disease category
  const getSpecificType = () => {
    if (selectedDisease === "Cancer") return selectedCancerType;
    if (selectedDisease === "Chronic") return selectedChronicType;
    return selectedDisease;
  };

  // Get appropriate labels based on disease type
  const getLabels = () => {
    switch (selectedDisease) {
      case "Cancer":
        return {
          title: `${selectedRegion?.name || "Unknown Region"} - ${
            selectedCancerType?.toUpperCase() || "Unknown Cancer"
          } Analysis`,
          primary: "Incidence Rate Over Time",
          secondary: "Mortality Rate Over Time",
          cases: "Total Cases Per Year",
          confidence: "Confidence Interval Range",
          primaryLabel: "Incidence Rate per 100,000",
          secondaryLabel: "Mortality Rate per 100,000",
        };
      case "Chronic":
        return {
          title: `${selectedRegion?.name || "Unknown Region"} - ${
            selectedChronicType || "Unknown Condition"
          } Analysis`,
          primary: "Prevalence Rate Over Time",
          secondary: "Complication Rate Over Time",
          cases: "Total Cases Per Year",
          confidence: "Confidence Interval Range",
          primaryLabel: "Prevalence Rate per 100,000",
          secondaryLabel: "Complication Rate per 100,000",
        };
      case "Smoking":
        return {
          title: `${
            selectedRegion?.name || "Unknown Region"
          } - Tobacco Use Analysis`,
          primary: "Smoking Rate Over Time",
          secondary: "Related Health Issues Over Time",
          cases: "Total Smokers Per Year",
          confidence: "Confidence Interval Range",
          primaryLabel: "Smoking Rate per 100,000",
          secondaryLabel: "Health Issue Rate per 100,000",
        };
      case "Reproductive":
        return {
          title: `${
            selectedRegion?.name || "Unknown Region"
          } - Reproductive Health Analysis`,
          primary: "Reproductive Health Indicators Over Time",
          secondary: "Complication Rate Over Time",
          cases: "Total Cases Per Year",
          confidence: "Confidence Interval Range",
          primaryLabel: "Rate per 100,000",
          secondaryLabel: "Complication Rate per 100,000",
        };
      case "Overall Health":
        return {
          title: `${
            selectedRegion?.name || "Unknown Region"
          } - Overall Health Analysis`,
          primary: "Health Index Over Time",
          secondary: "Risk Factors Over Time",
          cases: "Population Health Distribution",
          confidence: "Confidence Interval Range",
          primaryLabel: "Health Index",
          secondaryLabel: "Risk Factor Index",
        };
      default:
        return {
          title: `${
            selectedRegion?.name || "Unknown Region"
          } - Health Analysis`,
          primary: "Primary Metric Over Time",
          secondary: "Secondary Metric Over Time",
          cases: "Total Cases Per Year",
          confidence: "Confidence Interval Range",
          primaryLabel: "Rate per 100,000",
          secondaryLabel: "Secondary Rate per 100,000",
        };
    }
  };

  useEffect(() => {
    if (!selectedRegion || !selectedDisease) return;

    const loadTrendData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Get the specific type based on the disease category
        const specificType = getSpecificType();

        // Use the API service to fetch data
        const data = await fetchDiseaseTrends(
          selectedRegion.name,
          selectedDisease,
          specificType
        );

        if (!data.primary.length && !data.secondary.length) {
          console.warn(`⚠ No ${selectedDisease} Data Found for Analysis`);
          setTrendData({ primary: [], secondary: [] });
          setPrimaryChartData(null);
          setSecondaryChartData(null);
          setCasesChartData(null);
          setConfidenceData(null);
          setIsLoading(false);
          return;
        }

        setTrendData({
          primary: data.primary,
          secondary: data.secondary,
        });

        const labels = getLabels();

        // Primary Rate Chart (Incidence, Prevalence, etc.)
        setPrimaryChartData({
          labels: data.primary.map((entry) => entry.year),
          datasets: [
            {
              label: labels.primaryLabel,
              data: data.primary.map((entry) => entry.rate),
              borderColor: "rgb(75, 192, 192)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              tension: 0.4,
            },
          ],
        });

        // Cases Chart
        setCasesChartData({
          labels: data.primary.map((entry) => entry.year),
          datasets: [
            {
              label: "Total Cases",
              data: data.primary.map((entry) => entry.cases),
              backgroundColor: "rgba(255, 99, 132, 0.6)",
              borderColor: "rgb(255, 99, 132)",
              borderWidth: 1,
            },
          ],
        });

        // Secondary Rate Chart (Mortality, Complications, etc.)
        if (data.secondary && data.secondary.length > 0) {
          setSecondaryChartData({
            labels: data.secondary.map((entry) => entry.year),
            datasets: [
              {
                label: labels.secondaryLabel,
                data: data.secondary.map((entry) => entry.rate),
                borderColor: "rgb(255, 159, 64)",
                backgroundColor: "rgba(255, 159, 64, 0.2)",
                tension: 0.4,
              },
            ],
          });
        } else {
          setSecondaryChartData(null);
        }

        // Confidence Interval Chart (if available)
        if (data.primary.some((entry) => entry.ci)) {
          setConfidenceData({
            labels: data.primary.map((entry) => entry.year),
            datasets: [
              {
                label: "Lower Bound CI",
                data: data.primary
                  .map((entry) => {
                    if (!entry.ci) return null;
                    return Number.parseFloat(
                      entry.ci.split("-")[0].split("(")[1]
                    );
                  })
                  .filter((val) => val !== null),
                borderColor: "rgba(255, 206, 86, 1)",
                backgroundColor: "rgba(255, 206, 86, 0.2)",
                borderDash: [5, 5],
                tension: 0.4,
              },
              {
                label: "Upper Bound CI",
                data: data.primary
                  .map((entry) => {
                    if (!entry.ci) return null;
                    return Number.parseFloat(entry.ci.split("-")[1]);
                  })
                  .filter((val) => val !== null),
                borderColor: "rgba(54, 162, 235, 1)",
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                borderDash: [5, 5],
                tension: 0.4,
              },
            ],
          });
        } else {
          setConfidenceData(null);
        }
      } catch (err) {
        setError(
          `Failed to load ${selectedDisease} analysis data. Please try again later.`
        );
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTrendData();
  }, [
    selectedRegion,
    selectedDisease,
    selectedCancerType,
    selectedChronicType,
  ]);

  const labels = getLabels();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Title */}
      <h1 className="text-2xl font-bold text-center mb-4">{labels.title}</h1>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center p-8">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
          <p className="mt-2 text-gray-600">Loading analysis data...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center p-8 bg-red-50 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Grid Layout for Charts */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Primary Rate (Incidence, Prevalence, etc.) */}
          {primaryChartData && (
            <div className="bg-white p-4 shadow-lg rounded-lg">
              <h2 className="text-lg font-semibold mb-2">{labels.primary}</h2>
              <Line data={primaryChartData} options={{ responsive: true }} />
            </div>
          )}

          {/* Secondary Rate (Mortality, Complications, etc.) */}
          {secondaryChartData && (
            <div className="bg-white p-4 shadow-lg rounded-lg">
              <h2 className="text-lg font-semibold mb-2">{labels.secondary}</h2>
              <Line data={secondaryChartData} options={{ responsive: true }} />
            </div>
          )}

          {/* Cases Per Year */}
          {casesChartData && (
            <div className="bg-white p-4 shadow-lg rounded-lg">
              <h2 className="text-lg font-semibold mb-2">{labels.cases}</h2>
              <Bar data={casesChartData} options={{ responsive: true }} />
            </div>
          )}

          {/* Confidence Interval (if available) */}
          {confidenceData && (
            <div className="md:col-span-2 bg-white p-4 shadow-lg rounded-lg">
              <h2 className="text-lg font-semibold mb-2">
                {labels.confidence}
              </h2>
              <Line data={confidenceData} options={{ responsive: true }} />
            </div>
          )}
        </div>
      )}

      {/* No Data Message */}
      {!isLoading && !error && !primaryChartData && !secondaryChartData && (
        <div className="text-center p-8 bg-gray-100 rounded-lg mt-6">
          <h2 className="text-xl font-semibold text-gray-700">
            No data available
          </h2>
          <p className="text-gray-600 mt-2">
            There is no analysis data available for {selectedDisease} in{" "}
            {selectedRegion?.name}.
          </p>
        </div>
      )}
    </div>
  );
};

export default AnalysisPage;
