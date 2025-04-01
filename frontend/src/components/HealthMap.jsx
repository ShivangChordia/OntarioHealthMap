"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { IoFilter } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import MapView from "./map-view";
import FilterPanel from "./filter-panel";
import DiseaseSelector from "./disease-selector";
import RegionDetails from "./region-details";
import {
  fetchGeoData,
  fetchPhuData,
  fetchCancerTypes,
  fetchAvailableYears,
  fetchCancerData,
  fetchChronicData,
  fetchHealthData,
} from "../services/api-service";

const HealthMap = () => {
  const [geoData, setGeoData] = useState(null);
  const [phuData, setPhuData] = useState([]);
  const [cancerTypes, setCancerTypes] = useState([]);
  const [healthData, setHealthData] = useState([]); // Renamed from cancerData to be more generic
  const [mapReady, setMapReady] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [geoJsonKey, setGeoJsonKey] = useState(0);

  const [diseaseTypes, setDiseaseTypes] = useState([
    "Cancer",
    "Chronic",
    "Smoking",
    "Reproductive",
    "Overall Health",
  ]);

  const [selectedDisease, setSelectedDisease] = useState("Cancer");
  const [selectedCancerType, setSelectedCancerType] = useState("all");
  const [selectedChronicType, setSelectedChronicType] = useState("");
  const [chronicTypes] = useState([
    "Diabetes",
    "COPD",
    "Hypertension",
    "Asthma",
  ]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedAge, setSelectedAge] = useState("");
  const [selectedYear, setSelectedYear] = useState("2020");
  const [selectedGender, setSelectedGender] = useState("");
  const [availableYears, setAvailableYears] = useState([]);
  const [minRate, setMinRate] = useState(0);
  const [maxRate, setMaxRate] = useState(100);

  const navigate = useNavigate();

  // Handle disease type change
  useEffect(() => {
    // Reset subcategory selections when main disease changes
    if (selectedDisease === "Cancer") {
      setSelectedCancerType("all");
      setSelectedChronicType("");
    } else if (selectedDisease === "Chronic") {
      setSelectedCancerType("");
      setSelectedChronicType("Diabetes"); // Default to first chronic type
    } else {
      setSelectedCancerType("");
      setSelectedChronicType("");
    }
  }, [selectedDisease]);

  const handleDetailedAnalysis = () => {
    navigate("/analysis", {
      state: {
        selectedRegion,
        selectedDisease,
        selectedCancerType,
        selectedChronicType,
      },
    });
  };

  // Load GeoJSON Data
  useEffect(() => {
    fetchGeoData()
      .then((geojson) => {
        console.log("🗺️ GeoJSON Data Loaded:", geojson);
        setGeoData(geojson);
      })
      .catch((error) => console.error("❌ Error loading GeoJSON data:", error));
  }, []);

  // Fetch PHU Data
  useEffect(() => {
    fetchPhuData()
      .then((data) => {
        console.log("✅ Fetched PHU Data");
        setPhuData(data);
      })
      .catch((error) => console.error("❌ Error fetching PHU data:", error));
  }, []);

  // Fetch available cancer types when "Cancer" is selected
  useEffect(() => {
    if (selectedDisease === "Cancer") {
      fetchCancerTypes()
        .then((data) => {
          console.log("✅ Fetched Cancer Types:", data);
          setCancerTypes(data);
        })
        .catch((error) =>
          console.error("❌ Error fetching cancer types:", error)
        );
    }
  }, [selectedDisease]);

  // Fetch available years when a cancer type is selected
  useEffect(() => {
    if (selectedDisease !== "Cancer" || !selectedCancerType) return;

    fetchAvailableYears(selectedCancerType)
      .then((years) => {
        console.log("✅ Available Years:", years);
        setAvailableYears(years);
        setSelectedYear(years[0]);
      })
      .catch((error) => console.error("❌ Error fetching years:", error));
  }, [selectedDisease, selectedCancerType]);

  // Fetch health data based on selected disease type
  useEffect(() => {
    // Reset data when changing disease types
    setHealthData([]);
    setMapReady(false);

    if (selectedDisease === "Cancer" && selectedCancerType) {
      fetchCancerData(
        selectedCancerType,
        selectedYear,
        selectedAge,
        selectedGender
      )
        .then((data) => {
          if (data.length > 0) {
            console.log("✅ Fetched Cancer Data:", data);
            setHealthData(data);
            const rates = data.map((entry) => entry.rate).filter(Boolean);
            setMinRate(Math.min(...rates));
            setMaxRate(Math.max(...rates));
            setMapReady(true);
            setGeoJsonKey((prevKey) => prevKey + 1);
          }
        })
        .catch((error) =>
          console.error("❌ Error fetching cancer data:", error)
        );
    } else if (selectedDisease === "Chronic" && selectedChronicType) {
      fetchChronicData(
        selectedChronicType,
        selectedYear,
        selectedAge,
        selectedGender
      )
        .then((data) => {
          if (data.length > 0) {
            console.log("✅ Fetched Chronic Disease Data:", data);
            setHealthData(data);
            const rates = data.map((entry) => entry.rate).filter(Boolean);
            setMinRate(Math.min(...rates));
            setMaxRate(Math.max(...rates));
            setMapReady(true);
            setGeoJsonKey((prevKey) => prevKey + 1);
          }
        })
        .catch((error) =>
          console.error("❌ Error fetching chronic disease data:", error)
        );
    } else if (
      ["Smoking", "Reproductive", "Overall Health"].includes(selectedDisease)
    ) {
      // Fetch general health data for other disease types
      fetchHealthData(
        selectedDisease,
        selectedYear,
        selectedAge,
        selectedGender
      )
        .then((data) => {
          if (data.length > 0) {
            console.log(`✅ Fetched ${selectedDisease} Data:`, data);
            setHealthData(data);
            const rates = data.map((entry) => entry.rate).filter(Boolean);
            setMinRate(Math.min(...rates));
            setMaxRate(Math.max(...rates));
            setMapReady(true);
            setGeoJsonKey((prevKey) => prevKey + 1);
          }
        })
        .catch((error) =>
          console.error(`❌ Error fetching ${selectedDisease} data:`, error)
        );
    }
  }, [
    selectedDisease,
    selectedCancerType,
    selectedChronicType,
    selectedYear,
    selectedAge,
    selectedGender,
  ]);

  // Reset Filters
  const resetFilters = () => {
    setSelectedAge("");
    setSelectedGender("");
    setSelectedYear("2020");
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Disease Selection & Subtypes */}
      <div className="bg-gray-100 shadow-md p-4 flex justify-between items-center">
        <DiseaseSelector
          diseaseTypes={diseaseTypes}
          selectedDisease={selectedDisease}
          setSelectedDisease={setSelectedDisease}
          cancerTypes={cancerTypes}
          selectedCancerType={selectedCancerType}
          setSelectedCancerType={setSelectedCancerType}
          chronicTypes={chronicTypes}
          selectedChronicType={selectedChronicType}
          setSelectedChronicType={setSelectedChronicType}
        />

        {/* Filters Button */}
        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center space-x-2 bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
        >
          <IoFilter className="text-lg" />
          <span>Filters</span>
        </button>
      </div>

      {/* Sidebar Filter Panel */}
      {isFilterOpen && (
        <FilterPanel
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          availableYears={availableYears}
          selectedAge={selectedAge}
          setSelectedAge={setSelectedAge}
          selectedGender={selectedGender}
          setSelectedGender={setSelectedGender}
          resetFilters={resetFilters}
          selectedDisease={selectedDisease}
          setSelectedDisease={setSelectedDisease}
          selectedCancerType={selectedCancerType}
          setSelectedCancerType={setSelectedCancerType}
          selectedChronicType={selectedChronicType}
          setSelectedChronicType={setSelectedChronicType}
        />
      )}

      {/* Map Display */}
      <div className="flex flex-1 flex-row justify-center z-0 items-center p-6">
        <MapContainer
          center={[49, -85]}
          zoom={5}
          minZoom={5}
          maxBounds={[
            [41.6, -95],
            [56.9, -74],
          ]}
          maxBoundsViscosity={1.0}
          className="w-full h-full rounded-lg shadow-lg"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {mapReady && geoData && (
            <MapView
              geoData={geoData}
              geoJsonKey={geoJsonKey}
              phuData={phuData}
              healthData={healthData}
              selectedDisease={selectedDisease}
              selectedCancerType={selectedCancerType}
              selectedChronicType={selectedChronicType}
              setSelectedRegion={setSelectedRegion}
              minRate={minRate}
              maxRate={maxRate}
            />
          )}
        </MapContainer>

        {/* Right Sidebar for Selected Region Details */}
        {selectedRegion && (
          <RegionDetails
            selectedRegion={selectedRegion}
            selectedDisease={selectedDisease}
            selectedCancerType={selectedCancerType}
            selectedChronicType={selectedChronicType}
            handleDetailedAnalysis={handleDetailedAnalysis}
          />
        )}
      </div>
    </div>
  );
};

export default HealthMap;
