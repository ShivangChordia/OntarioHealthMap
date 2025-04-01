import React, { useEffect, useState } from "react";
import { fetchAvailableYears, fetchAvailableAgeGender } from "../utils/api";

const Filters = ({ selectedDisease, selectedType, filters, setFilters }) => {
  const [years, setYears] = useState([]);
  const [ageOptions, setAgeOptions] = useState([]);
  const [genderOptions, setGenderOptions] = useState([]);

  useEffect(() => {
    if (selectedDisease && selectedType) {
      // ✅ Fetch Available Years
      fetchAvailableYears(selectedDisease, selectedType).then(setYears);

      // ✅ Fetch Available Age & Gender Filters
      fetchAvailableAgeGender(selectedDisease, selectedType).then(
        ({ ageFilters, genderFilters }) => {
          setAgeOptions(ageFilters);
          setGenderOptions(genderFilters);
        }
      );
    }
  }, [selectedDisease, selectedType]);

  // ✅ Handle Age Selection (Disable Gender)
  const handleAgeChange = (event) => {
    setFilters({ ...filters, age: event.target.value, gender: "" });
  };

  // ✅ Handle Gender Selection (Disable Age)
  const handleGenderChange = (event) => {
    setFilters({ ...filters, gender: event.target.value, age: "" });
  };

  return (
    <div className="flex space-x-4 mt-4">
      {/* Year Dropdown */}
      <select
        className="border p-2 rounded"
        value={filters.year}
        onChange={(e) => setFilters({ ...filters, year: e.target.value })}
      >
        <option value="">Latest Year</option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>

      {/* Age Dropdown */}
      <select
        className="border p-2 rounded"
        value={filters.age}
        onChange={handleAgeChange}
        disabled={filters.gender} // Disable if gender is selected
      >
        <option value="">Select Age Group</option>
        {ageOptions.map((age) => (
          <option key={age} value={age.match(/\d+ to \d+|\d+\+/g)?.[0] || age}>
            {age}
          </option>
        ))}
      </select>

      {/* Gender Dropdown */}
      <select
        className="border p-2 rounded"
        value={filters.gender}
        onChange={handleGenderChange}
        disabled={filters.age} // Disable if age is selected
      >
        <option value="">Select Gender</option>
        {genderOptions.map((gender) => (
          <option
            key={gender}
            value={
              gender.match(/\(.*?\)/g)?.[0].replace(/\(|\)/g, "") || gender
            }
          >
            {gender}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Filters;
