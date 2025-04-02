import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DiseaseIncidenceMortalityChart from "../components/DiseaseIncidenceMortalityChart";
import DiseaseAgeGroupChart from "../components/DIseaseAgeGroupChart";
import SmokingDiseaseComparisonChart from "../components/SmokingDiseaseComparisonChart";
import OntarioChoroplethMap from "../components/OntarioChoroplethMap";
import { fetchDiseaseTrends } from "../utils/api";
import DiabetesHypertensionComparison from "../components/DiabetesHypertensionComparison";
import SmokingAnalysisPage from "./SmokingAnalysisPage";
import RadialDiseaseChart from "../components/RadialDiseaseChart";
import BubbleMap from "../components/BubbleMap";

const diseaseOptions = {
  Cancer: [
    "Aggregate",
    "Breast",
    "Lung",
    "Prostate",
    "Cervical",
    "Oral",
    "Malignant",
    "Colorectal",
  ],
  Chronic: ["Diabetes", "Hypertension", "COPD", "Asthma"],
  Reproductive: ["HIV", "AIDS"],
  Respiratory: ["Influenza", "Tuberculosis", "Covid"],
  Smoking: ["Daily Smoking"],
};

const DiseaseAnalysis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialDiseaseType = location.state?.diseaseType || "Chronic";
  const initialSpecificType = location.state?.specificType || "Diabetes";

  const [diseaseType, setDiseaseType] = useState(initialDiseaseType);
  const [specificType, setSpecificType] = useState(initialSpecificType);

  const [trendData, setTrendData] = useState({
    primary: [],
    secondary: [],
    tertiary: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!diseaseType) return;

    const loadTrendData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchDiseaseTrends(diseaseType, specificType);
        setTrendData(data);
      } catch (err) {
        setError(`Error loading ${diseaseType} data. Please try again.`);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTrendData();
  }, [diseaseType, specificType]);

  const isSmokingRelevant = (diseaseType, specificType) => {
    const key = `${diseaseType.toLowerCase()}_${specificType.toLowerCase()}`;
    return (
      key === "chronic_copd" ||
      key === "chronic_asthma" ||
      key === "chronic_hypertension"
    );
  };

  if (diseaseType === "Smoking") {
    return (
      <>
        <Navbar />
        <div className="bg-gray-100 min-h-screen">
          <div className="container mx-auto px-6 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            {/* 🔙 Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded-md shadow-sm"
            >
              ← Back
            </button>

            {/* 🩺 Disease Selectors */}
            <div className="flex gap-3">
              <select
                value={diseaseType}
                onChange={(e) => {
                  setDiseaseType(e.target.value);
                  setSpecificType(diseaseOptions[e.target.value][0]); // Update default specific type
                }}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white"
              >
                {Object.keys(diseaseOptions).map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>

              <select
                value={specificType}
                onChange={(e) => setSpecificType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white"
              >
                {diseaseOptions[diseaseType]?.map((specific) => (
                  <option key={specific}>{specific}</option>
                ))}
              </select>
            </div>
          </div>
            <SmokingAnalysisPage smokingData={trendData} />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen">
        <div className="container mx-auto px-6 pt-6 space-y-6">
          {/* 🔙 Back Button */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            {/* 🔙 Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded-md shadow-sm"
            >
              ← Back
            </button>

            {/* 🩺 Disease Selectors */}
            <div className="flex gap-3">
              <select
                value={diseaseType}
                onChange={(e) => {
                  setDiseaseType(e.target.value);
                  setSpecificType(diseaseOptions[e.target.value][0]); // Update default specific type
                }}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white"
              >
                {Object.keys(diseaseOptions).map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>

              <select
                value={specificType}
                onChange={(e) => setSpecificType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white"
              >
                {diseaseOptions[diseaseType]?.map((specific) => (
                  <option key={specific}>{specific}</option>
                ))}
              </select>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            {specificType} {diseaseType} - Analysis
          </h1>

          {isLoading ? (
            <p className="text-center text-gray-500">Loading data...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : ["reproductive", "respiratory"].includes(
              diseaseType.toLowerCase()
            ) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BubbleMap
                diseaseData={trendData}
                diseaseType={diseaseType}
                specificType={specificType}
              />
              <RadialDiseaseChart diseaseData={trendData} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden">
              <DiseaseIncidenceMortalityChart diseaseData={trendData} />
              <DiseaseAgeGroupChart diseaseData={trendData} />
              <div className="col-span-full w-full max-w-full">
                <OntarioChoroplethMap
                  diseaseData={trendData}
                  title={`${specificType} ${diseaseType} Incidence Map`}
                  measureOptions={[
                    "Age-standardized rate (males)",
                    "Age-standardized rate (females)",
                  ]}
                  dataKey="primary"
                />
              </div>
              {isSmokingRelevant(diseaseType, specificType) && (
                <SmokingDiseaseComparisonChart
                  diseaseData={trendData}
                  diseaseType={diseaseType}
                  specificType={specificType}
                />
              )}
              {["diabetes", "hypertension"].includes(
                specificType?.toLowerCase()
              ) && <DiabetesHypertensionComparison />}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DiseaseAnalysis;
