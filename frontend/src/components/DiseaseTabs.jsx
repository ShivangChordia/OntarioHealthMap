import React from "react";

const DiseaseTabs = ({
  selectedCategory,
  selectedDisease,
  setSelectedDisease,
  filters,
  setFilters,
}) => {
  const diseaseOptions = {
    Cancer: [
      "Aggregate",
      "Breast",
      "Colorectal",
      "Lung",
      "Prostate",
      "Cervical",
      "Oral",
      "Malignant",
    ],
    Chronic: ["Diabetes", "Hypertension", "Asthma", "COPD"],
    Smoking: ["Active", "Former"],
    Reproductive: ["HIV", "AIDS"],
    Respiratory: ["Influenza", "Covid", "Tuberculosis"],
  };

  return (
    <div className="flex flex-wrap justify-between items-center mt-4">
      {/* Disease Tabs */}
      <div className="flex flex-wrap space-x-2">
        {diseaseOptions[selectedCategory]?.map((disease) => (
          <button
            key={disease}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              selectedDisease === disease
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setSelectedDisease(disease)}
          >
            {disease}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex space-x-2">
        {/* Year Filter */}
        <select
          className="border p-2 rounded-md text-sm"
          value={filters.year}
          onChange={(e) => setFilters({ ...filters, year: e.target.value })}
        >
          <option value="">Year</option>
          {filters.availableYears?.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        {/* Age Filter (Disables Gender when selected) */}
        <select
          className="border p-2 rounded-md text-sm"
          value={filters.age}
          onChange={(e) =>
            setFilters({ ...filters, age: e.target.value, gender: "" })
          }
          disabled={filters.gender !== ""}
        >
          <option value="">Age</option>
          {filters.availableAges?.map((age) => (
            <option key={age} value={age}>
              {age}
            </option>
          ))}
        </select>

        {/* Gender Filter (Disables Age when selected) */}
        <select
          className="border p-2 rounded-md text-sm"
          value={filters.gender}
          onChange={(e) =>
            setFilters({ ...filters, gender: e.target.value, age: "" })
          }
          disabled={filters.age !== ""}
        >
          <option value="">Gender</option>
          {filters.availableGenders?.map((gender) => (
            <option key={gender} value={gender}>
              {gender}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DiseaseTabs;
