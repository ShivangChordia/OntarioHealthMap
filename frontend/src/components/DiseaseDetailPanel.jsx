import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase"; // Import Firebase authentication
import { onAuthStateChanged } from "firebase/auth"; // ✅ Import Firebase Auth

const DiseaseDetailPanel = ({
  selectedCategory,
  selectedDisease,
  diseaseData,
  selectedRegion,
  selectedFilters,
}) => {
  const [regionData, setRegionData] = useState(null);

  const navigate = useNavigate();

  // Redirect to landing page if user is unauthenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/"); // Redirect to landing page if user is not logged in
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [navigate]);

  useEffect(() => {
    if (!selectedRegion?.name) {
      setRegionData(null);
      return;
    }

    console.log("🏥 Selected Region Changed:", selectedRegion.name);

    const regionName = selectedRegion.name.trim().toLowerCase();

    // ✅ Find matching disease data
    const matchedDiseaseData = diseaseData.find(
      (entry) => entry.geography.trim().toLowerCase() === regionName
    );

    console.log("📊 Matched Disease Data for Region:", matchedDiseaseData);
    setRegionData(matchedDiseaseData || null);
  }, [selectedRegion, diseaseData]);

  if (!selectedRegion?.name) {
    return (
      <p className="p-4 text-gray-500">Select a region to view details.</p>
    );
  }

  if (!regionData) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-bold">
          {selectedCategory} - {selectedDisease} ({selectedRegion.name})
        </h2>
        <p className="text-gray-600 mt-2">
          No available data for {selectedRegion.name}.
        </p>
      </div>
    );
  }

  // ✅ Extract relevant data
  const { rate, cases, year, ci, population } = regionData;
  const { phu } = selectedRegion || {};
  const medianIncome = phu?.median_total_income
    ? `$${phu.median_total_income.toLocaleString()}`
    : "N/A";

  // ✅ Identify whether it's Age or Gender filter
  const filterType = selectedFilters.age
    ? `Age-specific rate (${selectedFilters.age})`
    : `Age-standardized rate (${selectedFilters.gender || "both sexes"})`;

  // ✅ Pass selected disease & category as state to analysis page
  const handleNavigation = () => {
    navigate("/analysis", {
      state: {
        diseaseType: selectedCategory,
        specificType: selectedDisease,
      },
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">
        {selectedCategory} - {selectedDisease} ({selectedRegion.name})
      </h2>
      <p className="text-gray-600 mt-2">
        In the <b>{selectedRegion.name}</b>, the estimated incidence rate for{" "}
        <b>{selectedDisease.toLowerCase()}</b> was{" "}
        <b>{rate || "N/A"} per 100,000</b> individuals in <b>{year || "N/A"}</b>
        , based on <b>{filterType}</b>, with a{" "}
        <b>
          {ci
            ? `95% confidence interval of (${ci})`
            : "no confidence interval available"}
        </b>
        . A total of <b>{cases || "N/A"} cases</b> were recorded. According to
        regional estimates, the population of this area was <b>{population}</b>,
        with a median income of <b>{medianIncome}</b>.
        <br />
      </p>

      <div className="mt-4 p-3 bg-gray-100 rounded-lg">
        <h3 className="text-sm font-medium text-blue-600">Incidence Rate</h3>
        <p className="text-xl font-bold">{rate || "N/A"}</p>
        <p className="text-sm text-gray-500">per 100,000</p>
      </div>

      <div className="mt-4 p-3 bg-green-100 rounded-lg">
        <h3 className="text-sm font-medium text-green-600">Total Cases</h3>
        <p className="text-xl font-bold">{cases || "N/A"}</p>
        <p className="text-sm text-gray-500">Total cases reported</p>
      </div>

      <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
        <h3 className="text-sm font-medium text-yellow-600">Year</h3>
        <p className="text-lg font-bold">{year || "N/A"}</p>
      </div>

      <button
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        onClick={handleNavigation}
      >
        See Detailed {selectedDisease} Analysis
      </button>
      <a
        href="https://www.publichealthontario.ca/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-center text-blue-300 underline "
      >
        Source: Public Health Ontario
      </a>
    </div>
  );
};

export default DiseaseDetailPanel;
