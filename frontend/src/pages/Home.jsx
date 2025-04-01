import React, { useState } from "react";
import Navbar from "../components/Navbar";
import HealthMap from "../components/HealthMap";
import Footer from "../components/Footer";
import CategoryTabs from "../components/disease-selector";
import SearchBar from "../components/SearchBar";
import StatsCard from "../components/region-details";
import FilterPanel from "../components/filter-panel";

const Home = () => {
  const [activeCategory, setActiveCategory] = useState("Cancer");
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      {/* Search Bar & Category Selector */}
      <div className="container mx-auto px-6 pt-20">
        <SearchBar />
        <CategoryTabs
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
      </div>

      {/* Health Map */}
      <div className="container mx-auto mt-6">
        <HealthMap />
      </div>

      {/* Statistics Section */}
      <div className="container mx-auto mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
        <StatsCard
          title="Incidence Rate"
          value="561.2"
          description="Per 100,000 people"
        />
        <StatsCard
          title="Total Cases"
          value="521"
          description="Recorded in 2014"
        />
        <StatsCard
          title="Median Income"
          value="$78,500"
          description="For this region"
        />
      </div>

      {/* Filters Button */}
      <div className="flex justify-center mt-6">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          onClick={() => setShowFilters(true)}
        >
          Open Filters
        </button>
      </div>

      {/* Filters Panel (Popup) */}
      {showFilters && <FilterPanel onClose={() => setShowFilters(false)} />}

      <Footer />
    </div>
  );
};

export default Home;
