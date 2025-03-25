import { createContext, useContext, useState, useEffect } from "react";
import { fetchCancerTypes, fetchChronicTypes, fetchAvailableYears, fetchDiseaseData, fetchGeoData, fetchPhuData } from "../services/healthApi";

// ✅ Explicitly export HealthDataContext
export const HealthDataContext = createContext(null);

export const HealthDataProvider = ({ children }) => {
  const [selectedDisease, setSelectedDisease] = useState("Cancer");
  const [selectedType, setSelectedType] = useState("all");
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("2015");
  const [diseaseData, setDiseaseData] = useState([]);
  const [cancerTypes, setCancerTypes] = useState([]);
  const [chronicTypes, setChronicTypes] = useState([]);
  const [geoData, setGeoData] = useState(null); 
  const [phuData, setPhuData] = useState([]);

  // Fetch sub-disease types for cancer and chronic disease
  useEffect(() => {
    if (selectedDisease === "Cancer") {
      fetchCancerTypes()
        .then((types) => {
          console.log("✅ Cancer Types Fetched:", types);
          setCancerTypes(types);
        })
        .catch((error) => console.error("❌ Error Fetching Cancer Types:", error));
    } else if (selectedDisease === "Chronic") {
      fetchChronicTypes()
        .then((types) => {
          console.log("✅ Chronic Types Fetched:", types);
          setChronicTypes(types);
        })
        .catch((error) => console.error("❌ Error Fetching Chronic Types:", error));
    }
  }, [selectedDisease]);

  // Fetch Available years
  useEffect(() => {
    if (selectedDisease && selectedType) {
      fetchAvailableYears(selectedDisease, selectedType).then(setAvailableYears);
    }
  }, [selectedDisease, selectedType]);  

  // Fetch disease data, type, and year
  useEffect(() => {
    fetchDiseaseData(selectedDisease, selectedType, selectedYear, "", "")
      .then((data) => {
        console.log(`✅ Disease Data Fetched for ${selectedDisease}:`, data);
        setDiseaseData(data);
      })
      .catch((err) => console.error("❌ Fetch Error:", err));
  }, [selectedDisease, selectedType, selectedYear]);
  
   // ✅ Fetch GeoJSON Data
   useEffect(() => {
    fetchGeoData()
      .then(setGeoData)
      .catch((error) => console.error("❌ Error fetching GeoJSON data:", error));
  }, []);

  // ✅ Fetch PHU Data
  useEffect(() => {
    fetchPhuData()
      .then(setPhuData)
      .catch((error) => console.error("❌ Error fetching PHU data:", error));
  }, []);

  return (
    <HealthDataContext.Provider
      value={{
        selectedDisease,
        setSelectedDisease,
        selectedType,
        setSelectedType,
        availableYears,
        selectedYear,
        setSelectedYear,
        diseaseData,
        cancerTypes,
        chronicTypes,
        geoData,
        phuData,
      }}
    >
      {children}
    </HealthDataContext.Provider>
  );
};

// ✅ Explicitly export useHealthData
export const useHealthData = () => {
  const context = useContext(HealthDataContext);
  if (!context) {
    throw new Error("useHealthData must be used within a HealthDataProvider");
  }
  return context;
};
