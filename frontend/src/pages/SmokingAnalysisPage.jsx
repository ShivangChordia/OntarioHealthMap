import React, { useEffect, useState } from "react";
import { fetchSmokingData } from "../utils/api";
import SmokingTrendsChart from "../components/SmokingTrendsChart";
import SmokingTopRegionsBar from "../components/SmokingTopRegionsBar";
import OntarioChoroplethMap from "../components/OntarioChoroplethMap";

const SmokingAnalysisPage = () => {
  const [smokingData, setSmokingData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSmokingData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchSmokingData(); // ⬅️ Ensure this fetches data from your API
        setSmokingData(data);
      } catch (err) {
        setError("Failed to load smoking data.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSmokingData();
  }, []);

  return (
    <>
      <div className="bg-gray-100 min-h-screen">
        <div className="container mx-auto px-6 pt-6 pb-10">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Smoking Trends & Insights (Ontario)
          </h1>

          {isLoading ? (
            <p className="text-center text-gray-500">Loading data...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SmokingTrendsChart smokingData={smokingData} />
              <SmokingTopRegionsBar smokingData={smokingData} />
              <div className="md:col-span-2">
                <OntarioChoroplethMap
                  diseaseData={smokingData}
                  title={`Smoking Incidence Map`}
                  measureOptions={["Age-standardized rate (both sexes)"]}
                  dataKey="primary"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SmokingAnalysisPage;
