"use client"
import { IoClose } from "react-icons/io5"

const FilterPanel = ({
  isFilterOpen,
  setIsFilterOpen,
  selectedYear,
  setSelectedYear,
  availableYears,
  selectedAge,
  setSelectedAge,
  selectedGender,
  setSelectedGender,
  resetFilters,
}) => {
  return (
    <div className="fixed top-0 right-0 w-80 z-10 h-full bg-white shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Filter Data</h2>
        <button onClick={() => setIsFilterOpen(false)}>
          <IoClose className="text-2xl" />
        </button>
      </div>

      {/* Year Filter */}
      <label className="block font-medium mb-1">Year</label>
      <select
        className="w-full p-2 border rounded-lg mb-4"
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
      >
        {availableYears.length === 0 ? (
          <option value="">Loading...</option>
        ) : (
          availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))
        )}
      </select>

      {/* Age Filter */}
      <label className="block font-medium mb-1">Age Range</label>
      <select
        className={`w-full p-2 border rounded-lg mb-4 ${
          selectedGender !== "" ? "bg-gray-200 text-gray-500 cursor-not-allowed" : ""
        }`}
        value={selectedAge}
        onChange={(e) => {
          setSelectedAge(e.target.value)
          setSelectedGender("") // Reset Gender
        }}
        disabled={selectedGender !== ""}
        title={selectedGender !== "" ? "You cannot select Age when Gender is chosen" : ""}
      >
        <option value="">Select Age</option>
        <option value="0-14">0-14</option>
        <option value="15-29">15-29</option>
        <option value="30-49">30-49</option>
        <option value="50-64">50-64</option>
        <option value="65-79">65-79</option>
        <option value="80+">80+</option>
      </select>

      {/* Gender Filter */}
      <label className="block font-medium mb-2">Gender</label>
      <div className="flex space-x-2 mb-6">
        {["Both", "Male", "Female"].map((gender) => (
          <button
            key={gender}
            onClick={() => {
              setSelectedGender(gender)
              setSelectedAge("") // Reset Age
            }}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              selectedGender === gender ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            } ${selectedAge !== "" ? "bg-gray-200 text-gray-500 cursor-not-allowed" : ""}`}
            disabled={selectedAge !== ""}
            title={selectedAge !== "" ? "You cannot select Gender when Age is chosen" : ""}
          >
            {gender}
          </button>
        ))}
      </div>

      {/* Apply & Reset Buttons */}
      <div className="flex space-x-4">
        <button
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
          onClick={() => setIsFilterOpen(false)}
        >
          Apply Filters
        </button>
        <button className="w-full bg-gray-200 px-4 py-2 rounded-lg font-semibold" onClick={resetFilters}>
          Reset
        </button>
      </div>
    </div>
  )
}

export default FilterPanel

