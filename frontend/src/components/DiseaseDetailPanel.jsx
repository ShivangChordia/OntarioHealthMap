import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase"; // Import Firebase authentication
import { onAuthStateChanged } from "firebase/auth"; // ✅ Import Firebase Auth
import Papa from "papaparse";
import { saveAs } from "file-saver"; // optional, or use native download

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

  const handleDownloadCSV = () => {
    if (!diseaseData || diseaseData.length === 0) {
      alert("No data available to download.");
      return;
    }

    // Convert to CSV
    const csv = Papa.unparse(diseaseData);

    // Create Blob and trigger download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const fileName = `${selectedCategory}_${selectedDisease}_filtered_data.csv`;
    saveAs(blob, fileName);
  };

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
  const phuPopulation = phu?.population;

  // ✅ Identify whether it's Age or Gender filter
  const filterType = selectedFilters.age
    ? `${selectedFilters.age}`
    : `${selectedFilters.gender || "Age-standardized rate (both sexes)"}`;

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
        <b>
          {selectedDisease.toLowerCase()} {selectedCategory.toLowerCase()}
        </b>{" "}
        was <b>{rate || "0"} per 100,000</b> individuals in{" "}
        <b>{year || "N/A"}</b>, based on <b>{filterType}</b>, with a{" "}
        <b>
          {ci
            ? `95% confidence interval of ${ci}`
            : "no confidence interval available"}
        </b>
        . A total of <b>{cases || "0"} cases</b> were recorded. According to
        regional estimates, the population of this area was{" "}
        <b>{population || phuPopulation}</b>, with a median income of{" "}
        <b>{medianIncome}</b>.
        <br />
      </p>

      <div className="mt-4 p-3 bg-gray-100 rounded-lg">
        <h3 className="text-sm font-medium text-blue-600">Incidence Rate</h3>
        <p className="text-xl font-bold">{rate || "0"}</p>
        <p className="text-sm text-gray-500">per 100,000</p>
      </div>

      <div className="mt-4 p-3 bg-green-100 rounded-lg">
        <h3 className="text-sm font-medium text-green-600">Total Cases</h3>
        <p className="text-xl font-bold">{cases || "0"}</p>
        <p className="text-sm text-gray-500">Total cases reported</p>
      </div>

      <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
        <h3 className="text-sm font-medium text-yellow-600">Year</h3>
        <p className="text-lg font-bold">{year || "N/A"}</p>
      </div>

      <button
        className="mt-4 mb-3 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        onClick={handleNavigation}
      >
        See Detailed {selectedDisease} Analysis
      </button>
      <div className="mt-4 flex items-center justify-between">
        <a
          href="https://www.publichealthontario.ca/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          Source: Public Health Ontario
        </a>
        <button
          onClick={handleDownloadCSV}
          className="bg-green-600 text-white px-4 py-1 rounded-md hover:bg-green-700 transition text-sm"
        >
          📥 Download CSV
        </button>
      </div>
    </div>
  );
};

export default DiseaseDetailPanel;
