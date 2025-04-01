import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DiseaseIncidenceMortalityChart from "../components/DiseaseIncidenceMortalityChart";
import DiseaseAgeGroupChart from "../components/DiseaseAgeGroupChart";
import { fetchDiseaseTrends } from "../utils/api";

const DiseaseAnalysis = () => {
  const location = useLocation();
  const { diseaseType, specificType } = location.state || {};

  const [trendData, setTrendData] = useState({
    primary: [],
    secondary: [],
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

        if (!data.primary.length && !data.secondary.length) {
          setTrendData({ primary: [], secondary: [] });
          setIsLoading(false);
          return;
        }

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

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen">
        <div className="container mx-auto px-6 pt-6">
          {/* Page Title */}
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            {specificType} {diseaseType} - Analysis
          </h1>

          {/* Loading & Error Handling */}
          {isLoading && (
            <p className="text-center text-gray-500 py-4">Loading data...</p>
          )}
          {error && <p className="text-center text-red-500 py-4">{error}</p>}

          {/* Charts Section */}
          {!isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Incidence & Mortality Rate Over Time */}
              <DiseaseIncidenceMortalityChart diseaseData={trendData} />

              <DiseaseAgeGroupChart diseaseData={trendData} />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DiseaseAnalysis;
