import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CategoryTabs from "../components/CategoryTabs";
import DiseaseTabs from "../components/DiseaseTabs";
import OntarioMap from "../components/OntarioMap";
import DiseaseDetailPanel from "../components/DiseaseDetailPanel";
import {
  fetchDiseaseData,
  fetchAvailableYears,
  fetchAvailableAgeGender,
} from "../utils/api";

const Home = () => {
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

  // State for selected category and disease
  const [selectedCategory, setSelectedCategory] = useState("Cancer");
  const [selectedRegion, setSelectedRegion] = useState({
    name: "Ontario",
    phu: { median_total_income: 70500 },
  }); // ✅ Default to Ontario

  const [selectedDisease, setSelectedDisease] = useState("Aggregate");
  const [filters, setFilters] = useState({
    year: "",
    age: "",
    gender: "",
    availableYears: [],
    availableAges: [],
    availableGenders: [],
  });
  const [diseaseData, setDiseaseData] = useState([]); // Store disease data

  // Fetch available years when disease changes
  useEffect(() => {
    if (selectedDisease) {
      fetchAvailableYears(selectedCategory, selectedDisease)
        .then((years) => {
          setFilters((prev) => ({ ...prev, availableYears: years || [] }));
        })
        .catch((err) => console.error("Error fetching available years:", err));
    }
  }, [selectedDisease]);

  // Fetch available age & gender filters when disease changes
  useEffect(() => {
    if (selectedDisease) {
      fetchAvailableAgeGender(selectedCategory, selectedDisease)
        .then(({ ageFilters, genderFilters }) => {
          setFilters((prev) => ({
            ...prev,
            availableAges: ageFilters || [],
            availableGenders: genderFilters || [],
          }));
        })
        .catch((err) =>
          console.error("Error fetching age/gender filters:", err)
        );
    }
  }, [selectedDisease]);

  // Fetch disease data when filters change
  useEffect(() => {
    if (selectedDisease) {
      fetchDiseaseData({
        disease: selectedCategory,
        type: selectedDisease,
        year: filters.year,
        age: filters.age,
        gender: filters.gender,
      })
        .then((data) => setDiseaseData(data))
        .catch((err) => console.error("Error fetching disease data:", err));
    }
  }, [selectedDisease, filters]);

  return (
    <>
      <Navbar />
      <div className="bg-gray-100">
        {/* Categories Tabs */}
        <div className="container mx-auto px-6 pt-6">
          <CategoryTabs
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
          <DiseaseTabs
            selectedCategory={selectedCategory}
            selectedDisease={selectedDisease}
            setSelectedDisease={setSelectedDisease}
            filters={filters}
            setFilters={setFilters}
          />
        </div>

        {/* Main Content Layout */}
        <div className="container mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Map Section */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">
            <OntarioMap
              selectedDisease={selectedDisease}
              setSelectedRegion={setSelectedRegion}
            />
          </div>

          {/* Right: Disease Details Panel */}
          <div className="bg-white rounded-lg shadow p-4">
            <DiseaseDetailPanel
              selectedCategory={selectedCategory}
              selectedDisease={selectedDisease}
              diseaseData={diseaseData}
              selectedRegion={selectedRegion}
              selectedFilters={filters}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
